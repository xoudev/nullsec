"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useT } from "@/lib/i18n";

/**
 * The site's video player: the browser's <video>, with controls in the house
 * style instead of each browser's own.
 *
 * - Nothing plays by itself. The first frame is the poster, with one large
 *   control; after that, a mono bar: play, time, a scrubber, sound (only for
 *   a video that has any), full screen. The bar steps aside while a video
 *   plays and the pointer rests, and comes back on any move or focus.
 * - Keyboard, once the player has focus: Space or K to play and pause, the
 *   arrows to move 5 s, Home and End, M for the sound, F for full screen.
 * - It pauses when it leaves the screen: nobody watches a video they have
 *   scrolled past, and it stops decoding frames for nothing.
 * - Without JavaScript, the browser's own controls are there instead.
 * - The scrubber is two blocks and a transparent range input on top (the HUD
 *   volume control does the same): the palette has no gradients, and the
 *   input keeps the keyboard and the screen reader.
 */

const noop = () => () => {};

function clock(s: number): string {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export type VideoSource = { src: string; type: string };

export function VideoPlayer({
  sources,
  poster,
  title,
  hasAudio = false,
}: {
  /** In order of preference: WebM (VP9) first, MP4 (H.264) for Safari. */
  sources: VideoSource[];
  poster: string;
  title: string;
  /** The demo videos are silent: no sound control for them. */
  hasAudio?: boolean;
}) {
  const { tr } = useT();
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const shellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(!hasAudio);
  const [idle, setIdle] = useState(false);
  const [full, setFull] = useState(false);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) void v.play().catch(() => {});
    else v.pause();
  }, []);

  const seek = useCallback((to: number) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    v.currentTime = Math.min(v.duration, Math.max(0, to));
  }, []);

  const toggleFullscreen = useCallback(() => {
    const shell = shellRef.current;
    const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (shell?.requestFullscreen) void shell.requestFullscreen();
    else v?.webkitEnterFullscreen?.(); // iOS: the video element only
  }, []);

  // The video's own events drive the state; the fill follows every frame
  // while it plays (timeupdate alone is four steps a second).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let frame = 0;
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

  // Paused once it leaves the screen.
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) videoRef.current?.pause();
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

  const onKey = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const v = videoRef.current;
    if (!v) return;
    // The scrubber handles its own arrows; everything else is the player's.
    const onScrubber = (e.target as HTMLElement).classList.contains("vid-range");
    switch (e.key) {
      case " ":
      case "k":
      case "K":
        if ((e.target as HTMLElement).tagName === "BUTTON" && e.key === " ") return;
        toggle();
        break;
      case "ArrowLeft":
        if (onScrubber) return;
        seek(v.currentTime - 5);
        break;
      case "ArrowRight":
        if (onScrubber) return;
        seek(v.currentTime + 5);
        break;
      case "Home":
        seek(0);
        break;
      case "End":
        seek(v.duration);
        break;
      case "m":
      case "M":
        if (!hasAudio) return;
        v.muted = !v.muted;
        break;
      case "f":
      case "F":
        toggleFullscreen();
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  const label = playing ? tr("Pause", "Pause") : ended ? tr("Watch again", "Revoir") : tr("Play", "Lecture");

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
    >
      <video
        ref={videoRef}
        poster={poster}
        preload="metadata"
        playsInline
        muted={!hasAudio}
        // Without JavaScript, the browser's own controls; with it, ours.
        controls={!hydrated}
        onClick={hydrated ? toggle : undefined}
        data-cursor={playing ? "pause" : "play ▶"}
        aria-label={title}
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>

      {hydrated && !started && (
        <button
          type="button"
          className="vid-big"
          onClick={toggle}
          aria-label={
            duration > 0
              ? tr(`Play the video, ${clock(duration)}`, `Lire la vidéo, ${clock(duration)}`)
              : tr("Play the video", "Lire la vidéo")
          }
        >
          <span>
            {tr("[ ▶ PLAY ]", "[ ▶ LECTURE ]")}
            {duration > 0 && <em>{clock(duration)}</em>}
          </span>
        </button>
      )}

      {hydrated && started && (
        <div className="vid-bar">
          <button type="button" onClick={toggle} aria-label={label}>
            {playing ? "[ ❚❚ ]" : ended ? "[ ↺ ]" : "[ ▶ ]"}
          </button>
          <span className="vid-time" aria-hidden="true">
            {`${clock(time)} / ${clock(duration)}`}
          </span>
          <span className="vid-scrub">
            <span className="vid-track" aria-hidden="true">
              <span ref={fillRef} className="vid-fill" />
            </span>
            <input
              type="range"
              className="vid-range"
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
              onClick={() => {
                const v = videoRef.current;
                if (v) v.muted = !v.muted;
              }}
              aria-label={muted ? tr("Sound off, turn on", "Son coupé, activer") : tr("Sound on, mute", "Son actif, couper")}
            >
              {muted ? tr("[ SOUND OFF ]", "[ SON OFF ]") : tr("[ SOUND ON ]", "[ SON ON ]")}
            </button>
          )}
          <button type="button" onClick={toggleFullscreen} aria-label={full ? tr("Exit full screen", "Quitter le plein écran") : tr("Full screen", "Plein écran")}>
            {full ? "[ ⤡ ]" : "[ ⤢ ]"}
          </button>
        </div>
      )}
    </div>
  );
}
