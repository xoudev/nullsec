// Module-level AudioContext singleton.
// All construction is deferred to unlockAudio() — safe to import in SSR context
// because nothing is instantiated at module evaluation time.

let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let ambientSource: AudioBufferSourceNode | null = null;
let muted = false;
let volume = 20;   // 0–100

const muteListeners = new Set<(muted: boolean) => void>();
const volumeListeners = new Set<(volume: number) => void>();

// Decoded buffer cache — avoids re-fetching on repeated calls (e.g. click sound).
const bufferCache = new Map<string, AudioBuffer>();

/** Must be called inside a user-gesture handler (click / keydown). */
export function unlockAudio(): void {
  if (typeof window === "undefined") return;
  if (!ctx) {
    ctx = new AudioContext();
    gain = ctx.createGain();
    gain.gain.value = volume / 100;
    gain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
}

/** Fetch and cache a decoded buffer for later instant playback. */
export async function preloadSound(src: string): Promise<void> {
  if (!ctx || bufferCache.has(src)) return;
  try {
    const res = await fetch(src);
    if (!res.ok) return;
    bufferCache.set(src, await ctx.decodeAudioData(await res.arrayBuffer()));
  } catch {
    // Silently ignore unsupported formats / network errors.
  }
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
  try {
    let buf = bufferCache.get(src);
    if (!buf) {
      const res = await fetch(src);
      if (!res.ok) return;
      buf = await ctx.decodeAudioData(await res.arrayBuffer());
      bufferCache.set(src, buf);
    }
    const node = ctx.createBufferSource();
    node.buffer = buf;
    node.connect(gain);
    node.start();
  } catch {
    // Silent fail — sound is optional.
  }
}

/**
 * Try each src in order and play the first one the browser can decode.
 * Use this to provide cross-browser fallbacks, e.g. playFirst("/a.aiff", "/a.wav").
 * AIFF = Safari only; WAV/MP3 = Chrome + Firefox.
 */
export async function playFirst(...srcs: string[]): Promise<void> {
  for (const src of srcs) {
    if (!ctx || !gain) return;
    try {
      let buf = bufferCache.get(src);
      if (!buf) {
        const res = await fetch(src);
        if (!res.ok) continue;
        buf = await ctx.decodeAudioData(await res.arrayBuffer());
        bufferCache.set(src, buf);
      }
      const node = ctx.createBufferSource();
      node.buffer = buf;
      node.connect(gain);
      node.start();
      return; // played — stop trying
    } catch {
      // This format failed (e.g. AIFF in Chrome), try next.
    }
  }
}

/**
 * Fetch, decode, and loop an ambient audio file.
 * Silent no-op if the file is missing or the context isn't ready.
 */
export async function playAmbient(src: string): Promise<void> {
  if (!ctx || !gain) return;
  try {
    const res = await fetch(src);
    if (!res.ok) return;
    const decoded = await ctx.decodeAudioData(await res.arrayBuffer());
    ambientSource?.stop();
    ambientSource = ctx.createBufferSource();
    ambientSource.buffer = decoded;
    ambientSource.loop = true;
    ambientSource.connect(gain);
    ambientSource.start();
  } catch {
    // Ambient sound is optional — swallow all errors silently.
  }
}

/** Set volume (0–100). Updates the stored value even before audio is unlocked. */
export function setVolume(pct: number): void {
  volume = Math.max(0, Math.min(100, Math.round(pct)));
  if (ctx && gain && !muted) {
    gain.gain.setTargetAtTime(volume / 100, ctx.currentTime, 0.05);
  }
  volumeListeners.forEach((cb) => cb(volume));
}

export function getVolume(): number {
  return volume;
}

/** Subscribe to volume changes. Returns an unsubscribe function. */
export function onVolumeChange(cb: (volume: number) => void): () => void {
  volumeListeners.add(cb);
  return () => volumeListeners.delete(cb);
}

/** Ramp gain to 0 or current volume over ~300 ms and notify subscribers. */
export function toggleMute(): void {
  if (!ctx || !gain) return;
  muted = !muted;
  gain.gain.setTargetAtTime(muted ? 0 : volume / 100, ctx.currentTime, 0.3);
  muteListeners.forEach((cb) => cb(muted));
}

export function getMuted(): boolean {
  return muted;
}

/** Subscribe to mute-state changes. Returns an unsubscribe function. */
export function onMuteChange(cb: (muted: boolean) => void): () => void {
  muteListeners.add(cb);
  return () => muteListeners.delete(cb);
}
