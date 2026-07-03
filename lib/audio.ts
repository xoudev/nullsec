// Module-level AudioContext singleton.
// All construction is deferred to unlockAudio() — safe to import in SSR context
// because nothing is instantiated at module evaluation time.

let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let ambientSource: AudioBufferSourceNode | null = null;
let ambientStarted = false; // guards against stacking a second ambient loop
let muted = false;
let volume = 20;   // 0–100
let prefsLoaded = false;

// Mute/volume survive reloads — a visitor who muted the site must never get
// the ambient loop back at full volume on the next page.
const MUTE_KEY = "nullsec_muted";
const VOLUME_KEY = "nullsec_volume";

const muteListeners = new Set<(muted: boolean) => void>();
const volumeListeners = new Set<(volume: number) => void>();

// Decoded buffer cache — avoids re-fetching on repeated calls (e.g. click sound).
const bufferCache = new Map<string, AudioBuffer>();
// In-flight fetches — two callers racing for the same src share one request.
const pending = new Map<string, Promise<AudioBuffer | null>>();

function loadPrefs(): void {
  if (prefsLoaded || typeof window === "undefined") return;
  prefsLoaded = true;
  try {
    muted = localStorage.getItem(MUTE_KEY) === "1";
    const v = Number(localStorage.getItem(VOLUME_KEY));
    if (Number.isFinite(v) && v >= 0 && v <= 100 && localStorage.getItem(VOLUME_KEY) !== null) {
      volume = Math.round(v);
    }
  } catch {
    // storage unavailable — keep defaults
  }
}

function persistPrefs(): void {
  try {
    localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
    localStorage.setItem(VOLUME_KEY, String(volume));
  } catch {
    // ignore
  }
}

/** Must be called inside a user-gesture handler (click / keydown). */
export function unlockAudio(): void {
  if (typeof window === "undefined") return;
  loadPrefs();
  if (!ctx) {
    ctx = new AudioContext();
    gain = ctx.createGain();
    gain.gain.value = muted ? 0 : volume / 100;
    gain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
}

/** Fetch + decode with caching and in-flight dedupe. */
async function getBuffer(src: string): Promise<AudioBuffer | null> {
  if (!ctx) return null;
  const cached = bufferCache.get(src);
  if (cached) return cached;
  const inFlight = pending.get(src);
  if (inFlight) return inFlight;

  const task = (async (): Promise<AudioBuffer | null> => {
    try {
      const res = await fetch(src);
      if (!res.ok) return null;
      const buf = await ctx!.decodeAudioData(await res.arrayBuffer());
      bufferCache.set(src, buf);
      return buf;
    } catch {
      return null; // unsupported format / network error — sound is optional
    } finally {
      pending.delete(src);
    }
  })();

  pending.set(src, task);
  return task;
}

/** Fetch and cache a decoded buffer for later instant playback. */
export async function preloadSound(src: string): Promise<void> {
  await getBuffer(src);
}

/**
 * Play a pre-loaded buffer as a one-shot (no loop).
 * No-op if the buffer hasn't been preloaded yet.
 */
export function playClick(src: string): void {
  if (!ctx || !gain) return;
  const buf = bufferCache.get(src);
  if (!buf) return;
  const node = ctx.createBufferSource();
  node.buffer = buf;
  node.connect(gain);
  node.start();
}

/**
 * Fetch, decode, and play a sound once (suitable for boot sounds).
 * Caches the decoded buffer for subsequent calls.
 */
export async function playOnce(src: string): Promise<void> {
  if (!ctx || !gain) return;
  const buf = await getBuffer(src);
  if (!buf || !ctx || !gain) return;
  const node = ctx.createBufferSource();
  node.buffer = buf;
  node.connect(gain);
  node.start();
}

/**
 * Try each src in order and play the first one the browser can decode.
 * Use this to provide cross-browser fallbacks, e.g. playFirst("/a.mp3", "/a.wav").
 */
export async function playFirst(...srcs: string[]): Promise<void> {
  for (const src of srcs) {
    if (!ctx || !gain) return;
    const buf = await getBuffer(src);
    if (!buf) continue;
    const node = ctx.createBufferSource();
    node.buffer = buf;
    node.connect(gain);
    node.start();
    return; // played — stop trying
  }
}

/**
 * Fetch, decode, and loop an ambient audio file.
 * Silent no-op if the file is missing or the context isn't ready.
 */
export async function playAmbient(src: string): Promise<void> {
  if (!ctx || !gain) return;
  if (ambientStarted) return; // already looping — don't stack a second source
  ambientStarted = true;
  const decoded = await getBuffer(src);
  if (!decoded || !ctx || !gain) {
    ambientStarted = false; // let a later call retry
    return;
  }
  ambientSource?.stop();
  ambientSource = ctx.createBufferSource();
  ambientSource.buffer = decoded;
  ambientSource.loop = true;
  ambientSource.connect(gain);
  ambientSource.start();
}

/** Set volume (0–100). Updates the stored value even before audio is unlocked. */
export function setVolume(pct: number): void {
  loadPrefs();
  volume = Math.max(0, Math.min(100, Math.round(pct)));
  if (ctx && gain && !muted) {
    gain.gain.setTargetAtTime(volume / 100, ctx.currentTime, 0.05);
  }
  persistPrefs();
  volumeListeners.forEach((cb) => cb(volume));
}

export function getVolume(): number {
  loadPrefs();
  return volume;
}

/** Subscribe to volume changes. Returns an unsubscribe function. */
export function onVolumeChange(cb: (volume: number) => void): () => void {
  volumeListeners.add(cb);
  return () => volumeListeners.delete(cb);
}

/** Ramp gain to 0 or current volume over ~300 ms and notify subscribers. */
export function toggleMute(): void {
  loadPrefs();
  muted = !muted;
  if (ctx && gain) {
    gain.gain.setTargetAtTime(muted ? 0 : volume / 100, ctx.currentTime, 0.3);
  }
  persistPrefs();
  muteListeners.forEach((cb) => cb(muted));
}

export function getMuted(): boolean {
  loadPrefs();
  return muted;
}

/** Subscribe to mute-state changes. Returns an unsubscribe function. */
export function onMuteChange(cb: (muted: boolean) => void): () => void {
  muteListeners.add(cb);
  return () => muteListeners.delete(cb);
}
