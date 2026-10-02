"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useT } from "@/lib/i18n";
import {
  YOUTUBE_ORIGIN,
  youtubeEmbedUrl,
  youtubeThumbnail,
  youtubeWatchUrl,
  type YouTubeVideo,
} from "@/lib/youtube";

/**
 * The site's video player: the same controls in the house style, whether the
 * video is a file of the site's own or a YouTube video.
 *
 * - Nothing plays by itself. The first frame is the poster, with one large
 *   control; after that, a mono bar: play, time, a scrubber, sound (only for
 *   a video that has any), full screen. The bar steps aside while a video
 *   plays and the pointer rests, and comes back on any move or focus.
 * - Keyboard, once the player has focus: Space or K to play and pause, the
 *   arrows to move 5 s, Home and End, M for the sound, F for full screen.
 * - It pauses when it leaves the screen: nobody watches a video they have
 *   scrolled past, and it stops decoding frames for nothing.
 * - Without JavaScript: the browser's own controls for a file, a link to
 *   YouTube for a YouTube video.
 * - The scrubber is two blocks and a transparent range input on top (the HUD
 *   volume control does the same): the palette has no gradients, and the
 *   input keeps the keyboard and the screen reader.
 *
 * A YouTube video asks nothing of YouTube before play is pressed: the poster
 * is the site's own, or YouTube's thumbnail fetched by the site's image
 * optimizer. Then the privacy-enhanced player comes in (youtube-nocookie.com),
 * its own controls off, under a transparent layer that keeps the clicks on
 * this page; the bar drives it with the postMessage protocol YouTube's IFrame
 * API speaks, without loading that API's script here. A browser that will not
 * let a video start from a click outside its frame (Safari) gets the frame
 * itself to tap, once; the bar takes over from there. At the end the poster
 * comes back, over YouTube's suggestions.
 */

const noop = () => () => {};
/** ms after YouTube is ready with the video still not started: the browser said no. */
const BLOCKED_AFTER = 2500;
/** "listening" every 250 ms until YouTube answers; past this many, it never will. */
const HANDSHAKE_TRIES = 40;

function clock(s: number): string {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export type VideoSource = { src: string; type: string };

/** What the player plays: files of the site's own, or a YouTube video. */
export type VideoMedia =
  | {
      kind: "file";
      /** In order of preference: WebM (VP9) first, MP4 (H.264) for Safari. */
      sources: VideoSource[];
      poster: string;
      /** The demo videos are silent: no sound control for them. */
      audio?: boolean;
    }
  | { kind: "youtube"; video: YouTubeVideo; poster?: string };

/** What the bar and the keys drive, whichever the video. */
type Engine = {
  play(): void;
  pause(): void;
  playing(): boolean;
  /** Where the video is, to the frame (the state lags a quarter second). */
  now(): number;
  seek(to: number): void;
  mute(muted: boolean): void;
};
const NO_ENGINE: Engine = { play() {}, pause() {}, playing: () => false, now: () => 0, seek() {}, mute() {} };

export function VideoPlayer({ media, title }: { media: VideoMedia; title: string }) {
  const { tr, locale } = useT();
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  // An iPhone has full screen for a <video> only: none for a YouTube frame.
  const elementFullscreen = useSyncExternalStore(noop, () => document.fullscreenEnabled === true, () => false);
  const shellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const engine = useRef<Engine>(NO_ENGINE);
  const yt = media.kind === "youtube" ? media.video : null;
  const hasAudio = media.kind === "youtube" || media.audio === true;
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(!hasAudio);
  const [idle, setIdle] = useState(false);
  const [full, setFull] = useState(false);
  // YouTube only: the frame's address, set by the first press; "blocked"
  // while the visitor has to start the video in the frame; "failed" when
  // YouTube will not play it here (or never answers).
  const [frameSrc, setFrameSrc] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);

  const toggle = useCallback(() => {
    if (yt && !frameSrc) {
      // The first press brings the player in; it starts by itself.
      setFrameSrc(youtubeEmbedUrl(yt, window.location.origin, locale));
      return;
    }
    const e = engine.current;
    if (e.playing()) e.pause();
    else e.play();
  }, [yt, frameSrc, locale]);

  const seek = useCallback((to: number) => engine.current.seek(to), []);

  const toggleFullscreen = useCallback(() => {
    const shell = shellRef.current;
    const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (shell?.requestFullscreen) void shell.requestFullscreen();
    else v?.webkitEnterFullscreen?.(); // iOS: the video element only
  }, []);

  // A file: the video's own events drive the state; the fill follows every
  // frame while it plays (timeupdate alone is four steps a second).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let frame = 0;
    engine.current = {
      play: () => void v.play().catch(() => {}),
      pause: () => v.pause(),
      playing: () => !v.paused && !v.ended,
      now: () => v.currentTime,
      seek: (to) => {
        if (Number.isFinite(v.duration)) v.currentTime = Math.min(v.duration, Math.max(0, to));
      },
      mute: (m) => {
        v.muted = m;
      },
    };
    const draw = () => {
      if (fillRef.current && v.duration) fillRef.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
    };
    const loop = () => {
      draw();
      frame = requestAnimationFrame(loop);
    };
    const onPlay = () => {
      setPlaying(true);
      setStarted(true);
      setEnded(false);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(loop);
    };
    const onPause = () => {
      setPlaying(false);
      cancelAnimationFrame(frame);
      draw();
    };
    const onTime = () => {
      setTime(v.currentTime);
      draw(); // a seek while paused
    };
    const onMeta = () => setDuration(v.duration);
    const onEnded = () => setEnded(true);
    const onWaiting = () => setWaiting(true);
    const onPlaying = () => setWaiting(false);
    const onVolume = () => setMuted(v.muted);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("durationchange", onMeta);
    v.addEventListener("ended", onEnded);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("volumechange", onVolume);
    if (v.readyState >= 1) onMeta();
    return () => {
      cancelAnimationFrame(frame);
      engine.current = NO_ENGINE;
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("durationchange", onMeta);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("volumechange", onVolume);
    };
  }, []);

  // YouTube: once the frame is in, the handshake, then YouTube's messages
  // drive the state. They carry the position about four times a second; in
  // between, it is extrapolated from the clock, so the fill still moves
  // every frame.
  const ytStart = yt?.start ?? 0;
  useEffect(() => {
    const frame = frameRef.current;
    if (!frameSrc || !frame) return;
    // YouTube's states: -1 not started, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued.
    let state = -1;
    let length = 0;
    let at = { t: ytStart, when: performance.now() }; // the last position YouTube gave, and when
    let raf = 0;
    let handshake = 0;
    let tries = 0;
    let blockTimer = 0;
    const post = (message: object) =>
      frame.contentWindow?.postMessage(JSON.stringify({ ...message, id: 1, channel: "widget" }), YOUTUBE_ORIGIN);
    const send = (func: string, args: unknown[] = []) => post({ event: "command", func, args });
    const now = () =>
      state === 1 ? Math.min(length || Infinity, at.t + (performance.now() - at.when) / 1000) : at.t;
    const draw = () => {
      if (fillRef.current && length) fillRef.current.style.transform = `scaleX(${now() / length})`;
    };
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    engine.current = {
      play: () => {
        if (state === 0) send("seekTo", [0, true]);
        send("playVideo");
      },
      pause: () => send("pauseVideo"),
      playing: () => state === 1 || state === 3,
      now,
      seek: (to) => {
        const t = Math.max(0, length ? Math.min(length, to) : to);
        at = { t, when: performance.now() };
        send("seekTo", [t, true]);
        setTime(t);
        draw();
      },
      mute: (m) => {
        send(m ? "mute" : "unMute");
        setMuted(m);
      },
    };
    const onState = (next: number) => {
      if (next === state) return;
      at = { t: now(), when: performance.now() };
      state = next;
      cancelAnimationFrame(raf);
      if (next === 1 || next === 3) {
        // It started, so the browser let it: no tap needed in the frame.
        window.clearTimeout(blockTimer);
        setBlocked(false);
      }
      if (next === 1) {
        setPlaying(true);
        setStarted(true);
        setEnded(false);
        setWaiting(false);
        raf = requestAnimationFrame(loop);
      } else if (next === 3) {
        setWaiting(true); // buffering: still playing, as far as the bar goes
      } else {
        setPlaying(false);
        setWaiting(false);
        if (next === 0) setEnded(true);
        draw();
      }
    };
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== YOUTUBE_ORIGIN || e.source !== frame.contentWindow) return;
      let data: unknown;
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (!data || typeof data !== "object") return;
      const { event, info } = data as { event?: unknown; info?: unknown };
      window.clearInterval(handshake); // it answers: it is listening
      if (event === "onReady") {
        // What the IFrame API subscribes to, then play: autoplay=1 asked
        // already, and where it was ignored, this asks again.
        send("addEventListener", ["onStateChange"]);
        send("addEventListener", ["onError"]);
        send("playVideo");
        blockTimer = window.setTimeout(() => {
          if (state !== 1 && state !== 3) setBlocked(true);
        }, BLOCKED_AFTER);
      } else if (event === "onError") {
        window.clearTimeout(blockTimer);
        setFailed(true);
      } else if (event === "onStateChange" && typeof info === "number") {
        onState(info);
      } else if ((event === "infoDelivery" || event === "initialDelivery") && info && typeof info === "object") {
        const i = info as Record<string, unknown>;
        if (typeof i.duration === "number" && i.duration > 0 && i.duration !== length) {
          length = i.duration;
          setDuration(length);
        }
        if (typeof i.currentTime === "number") {
          at = { t: i.currentTime, when: performance.now() };
          setTime(i.currentTime);
        }
        if (typeof i.muted === "boolean") setMuted(i.muted);
        if (typeof i.playerState === "number") onState(i.playerState);
        if (state !== 1) draw();
      }
    };
    // "listening" until YouTube answers, from now: until the frame has
    // loaded, the browser drops a message meant for YouTube's origin. The
    // count runs from the load, so a slow network is not a refusal.
    const listen = () => {
      if (++tries > HANDSHAKE_TRIES) {
        window.clearInterval(handshake);
        setFailed(true);
        return;
      }
      post({ event: "listening" });
    };
    const onLoad = () => {
      tries = 0;
    };
    handshake = window.setInterval(listen, 250);
    frame.addEventListener("load", onLoad);
    window.addEventListener("message", onMessage);
    return () => {
      frame.removeEventListener("load", onLoad);
      window.removeEventListener("message", onMessage);
      window.clearInterval(handshake);
      window.clearTimeout(blockTimer);
      cancelAnimationFrame(raf);
      engine.current = NO_ENGINE;
    };
  }, [frameSrc, ytStart]);

  // Paused once it leaves the screen.
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting && engine.current.playing()) engine.current.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(shell);
    return () => io.disconnect();
  }, []);

  // The bar steps aside 2.2 s after the pointer rests, while playing.
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || !playing) return;
    let timer = window.setTimeout(() => setIdle(true), 2200);
    const wake = () => {
      setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), 2200);
    };
    shell.addEventListener("pointermove", wake);
    shell.addEventListener("pointerdown", wake);
    return () => {
      window.clearTimeout(timer);
      shell.removeEventListener("pointermove", wake);
      shell.removeEventListener("pointerdown", wake);
      setIdle(false);
    };
  }, [playing]);

  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === shellRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const canFullscreen = !yt || elementFullscreen;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const target = e.target as HTMLElement;
    // The scrubber handles its own arrows; everything else is the player's.
    const onScrubber = target.classList.contains("vid-range");
    const en = engine.current;
    switch (e.key) {
      case " ":
      case "k":
      case "K":
        if (target.tagName === "BUTTON" && e.key === " ") return;
        toggle();
        break;
      case "ArrowLeft":
        if (onScrubber) return;
        seek(en.now() - 5);
        break;
      case "ArrowRight":
        if (onScrubber) return;
        seek(en.now() + 5);
        break;
      case "Home":
        seek(0);
        break;
      case "End":
        seek(duration);
        break;
      case "m":
      case "M":
        if (!hasAudio) return;
        en.mute(!muted);
        break;
      case "f":
      case "F":
        if (!canFullscreen) return;
        toggleFullscreen();
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  const label = playing ? tr("Pause", "Pause") : ended ? tr("Watch again", "Revoir") : tr("Play", "Lecture");
  // YouTube: the poster covers the frame until the video plays, and again
  // once it ends; not while the visitor has to start it in the frame.
  const covered = !!yt && (!started || ended) && !blocked;
  const youtube = yt ? youtubeWatchUrl(yt) : "";

  return (
    <div
      ref={shellRef}
      className="vid"
      role="group"
      aria-label={tr(`Video: ${title}`, `Vidéo : ${title}`)}
      tabIndex={hydrated ? 0 : undefined}
      onKeyDown={hydrated ? onKey : undefined}
      data-idle={idle ? "" : undefined}
      data-playing={playing ? "" : undefined}
      data-vertical={yt?.vertical ? "" : undefined}
      // Pointed within, not at: the cursor never locks around the player.
      data-cursor-free=""
    >
      {media.kind === "file" ? (
        <video
          ref={videoRef}
          poster={media.poster}
          preload="metadata"
          playsInline
          muted={!hasAudio}
          // Without JavaScript, the browser's own controls; with it, ours.
          controls={!hydrated}
          onClick={hydrated ? toggle : undefined}
          data-cursor={playing ? "pause" : "play ▶"}
          aria-label={title}
        >
          {media.sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      ) : (
        <>
          {frameSrc && (
            <iframe
              ref={frameRef}
              className="vid-frame"
              src={frameSrc}
              title={title}
              allow="autoplay; encrypted-media"
            />
          )}
          {covered && (
            <Image
              className="vid-poster"
              src={media.poster ?? youtubeThumbnail(media.video)}
              alt=""
              fill
              sizes="100vw"
            />
          )}
          {/* Over the frame: the clicks stay on this page, for the bar. */}
          {frameSrc && !blocked && !failed && (
            <div
              className="vid-capture"
              aria-hidden="true"
              onClick={toggle}
              data-cursor={playing ? "pause" : "play ▶"}
            />
          )}
          {!hydrated && (
            <a className="vid-big" href={youtube} target="_blank" rel="noopener">
              <span>{tr("[ ▶ WATCH ON YOUTUBE ↗ ]", "[ ▶ VOIR SUR YOUTUBE ↗ ]")}</span>
            </a>
          )}
        </>
      )}

      {hydrated && !started && !blocked && !failed && (
        <button
          type="button"
          className="vid-big"
          onClick={toggle}
          data-cursor="play ▶"
          data-cursor-free=""
          aria-label={
            yt
              ? tr("Play the video, from YouTube", "Lire la vidéo, depuis YouTube")
              : duration > 0
                ? tr(`Play the video, ${clock(duration)}`, `Lire la vidéo, ${clock(duration)}`)
                : tr("Play the video", "Lire la vidéo")
          }
        >
          <span>
            {tr("[ ▶ PLAY ]", "[ ▶ LECTURE ]")}
            {yt ? (
              <em>{frameSrc ? tr("// loading", "// chargement") : "YOUTUBE"}</em>
            ) : (
              duration > 0 && <em>{clock(duration)}</em>
            )}
          </span>
        </button>
      )}

      {/* YouTube's notes over the poster and the frame; none takes a click. */}
      {yt && hydrated && !frameSrc && (
        <span className="vid-note" aria-hidden="true">
          {tr("// YouTube player, loaded on play", "// lecteur YouTube, chargé à la lecture")}
        </span>
      )}
      {blocked && (
        <span className="vid-tap" role="status">
          <span className="vid-tap-touch">{tr("// tap the video to start it", "// touchez la vidéo pour la lancer")}</span>
          <span className="vid-tap-mouse">{tr("// click the video to start it", "// cliquez la vidéo pour la lancer")}</span>
        </span>
      )}
      {failed && (
        <div className="vid-error" role="status">
          <span>{tr("// this video will not play here", "// cette vidéo ne se lit pas ici")}</span>
          <a href={youtube} target="_blank" rel="noopener">
            {tr("[ watch on YouTube ↗ ]", "[ voir sur YouTube ↗ ]")}
          </a>
        </div>
      )}

      {hydrated && started && !failed && (
        <div className="vid-bar">
          <button type="button" onClick={toggle} aria-label={label}>
            {playing ? "[ ❚❚ ]" : ended ? "[ ↺ ]" : "[ ▶ ]"}
          </button>
          <span className="vid-time" aria-hidden="true">
            {clock(time)}
            <span className="vid-total">{` / ${clock(duration)}`}</span>
          </span>
          <span className="vid-scrub">
            <span className="vid-track" aria-hidden="true">
              <span ref={fillRef} className="vid-fill" />
            </span>
            <input
              type="range"
              className="vid-range"
              data-cursor="seek"
              min={0}
              max={duration || 0}
              step={0.1}
              value={time}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label={tr("Position", "Position")}
              aria-valuetext={tr(`${clock(time)} of ${clock(duration)}`, `${clock(time)} sur ${clock(duration)}`)}
            />
          </span>
          {waiting && <span className="vid-wait">{tr("// loading", "// chargement")}</span>}
          {hasAudio && (
            <button
              type="button"
              className="vid-sound"
              onClick={() => engine.current.mute(!muted)}
              aria-label={muted ? tr("Sound off, turn on", "Son coupé, activer") : tr("Sound on, mute", "Son actif, couper")}
            >
              {muted ? tr("[ SOUND OFF ]", "[ SON OFF ]") : tr("[ SOUND ON ]", "[ SON ON ]")}
            </button>
          )}
          {canFullscreen && (
            <button type="button" onClick={toggleFullscreen} aria-label={full ? tr("Exit full screen", "Quitter le plein écran") : tr("Full screen", "Plein écran")}>
              {full ? "[ ⤡ ]" : "[ ⤢ ]"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
