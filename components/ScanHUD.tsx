"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "@/hooks/useLenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useT } from "@/lib/i18n";
import { profile } from "@/profile";
import {
  getMuted, onMuteChange, toggleMute,
  getVolume, onVolumeChange, setVolume,
  playClick,
} from "@/lib/audio";

/**
 * ScanHUD — persistent top-right monospace terminal overlay.
 *
 * Sections opt-in to tracking by adding data-section-id="XX" to their
 * root element. The HUD updates via direct DOM mutation (no React state)
 * so it runs at 60 fps without triggering re-renders.
 *
 * Respects prefers-reduced-motion: returns null when set.
 */
export function ScanHUD() {
  const prefersReduced = useReducedMotion();
  const { tr } = useT();
  const [muted, setMuted] = useState(getMuted);
  const [vol, setVol] = useState(getVolume);

  const nodeRef = useRef<HTMLSpanElement>(null);
  const latRef = useRef<HTMLSpanElement>(null);

  // Subscribe to audio state changes.
  useEffect(() => {
    const unsubMute = onMuteChange(setMuted);
    const unsubVol = onVolumeChange(setVol);
    return () => { unsubMute(); unsubVol(); };
  }, []);

  // Global click sound — fires on any interactive element click.
  useEffect(() => {
    const INTERACTIVE = "a, button, [role='button'], input, label";
    const handler = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(INTERACTIVE)) {
        playClick("/click.wav");
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Track which section is in the active viewport band.
  useEffect(() => {
    if (prefersReduced) return;

    const observe = () => {
      const sections = document.querySelectorAll("[data-section-id]");
      if (!sections.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && nodeRef.current) {
              const id =
                (entry.target as HTMLElement).dataset.sectionId ?? "????";
              nodeRef.current.textContent = `0x${id}`;
            }
          }
        },
        { rootMargin: "-40% 0px -60% 0px", threshold: 0 }
      );

      sections.forEach((s) => observer.observe(s));
      return () => observer.disconnect();
    };

    const cleanup = observe();
    return cleanup;
  }, [prefersReduced]);

  // Update velocity label on every Lenis scroll tick via direct DOM write.
  useLenis(
    (lenis) => {
      if (latRef.current) {
        const v = Math.abs(Math.round(lenis.velocity * 10));
        latRef.current.textContent = `${v}ms`;
      }
    },
    [],
    0
  );

  if (prefersReduced) return null;

  const SEGMENTS = 14;
  const filled = muted ? 0 : Math.round((vol / 100) * SEGMENTS);

  return (
    <div
      aria-hidden="true"
      className="scan-hud"
      style={{
        position: "fixed",
        top: "1.5rem",
        right: "1.5rem",
        zIndex: 50,
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: "0.65rem",
        lineHeight: "1.6",
        color: "var(--color-ash)",
        pointerEvents: "none",
        userSelect: "none",
        letterSpacing: "0.05em",
      }}
    >
      <div>{tr("// SCAN   ACTIVE", "// SCAN   ACTIF")}</div>
      <div>
        {"// NODE   "}
        <span ref={nodeRef}>{"0x0000"}</span>
      </div>
      <div>
        {"// LAT    "}
        <span ref={latRef}>{"0ms"}</span>
      </div>
      <div>{"// ENV    prod.nullsec"}</div>

      {/* Persistent CV link — mouse convenience; the hero CV link is the
          keyboard/AT-accessible one (this HUD is aria-hidden). */}
      <a
        href={profile.cvUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="open ↗"
        tabIndex={-1}
        style={{
          display: "block",
          color: "var(--color-bone)",
          textDecoration: "none",
          letterSpacing: "inherit",
          pointerEvents: "auto",
        }}
      >
        {tr("// CV     [ OPEN ↗ ]", "// CV     [ OUVRIR ↗ ]")}
      </a>

      {/* Volume row — ASCII bar with a transparent range input on top for interaction */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.3em",
          pointerEvents: "auto",
          marginTop: "0.2em",
        }}
      >
        <span>{"// VOL   "}</span>
        {/* Wrapper positions the hidden input over the visual bar */}
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
          {/* Visual: ASCII bar */}
          <span aria-hidden="true">
            <span style={{ color: "var(--color-ash)" }}>{"["}</span>
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <span
                key={i}
                style={{
                  color: i < filled ? "var(--color-blood)" : "rgba(107,107,107,0.4)",
                  transition: "color 0.08s ease",
                }}
              >
                {i < filled ? "=" : "-"}
              </span>
            ))}
            <span style={{ color: "var(--color-ash)" }}>{"]"}</span>
          </span>
          {/* Invisible native range input — handles all interaction (click, drag, keyboard) */}
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={vol}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label={`Volume: ${vol}%`}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              margin: 0,
              padding: 0,
            }}
          />
        </div>
      </div>

      {/* Mute toggle */}
      <button
        onClick={toggleMute}
        aria-label={muted ? tr("Unmute ambient sound", "Rétablir le son ambiant") : tr("Mute ambient sound", "Couper le son ambiant")}
        style={{
          display: "block",
          background: "none",
          border: "none",
          padding: 0,
          fontFamily: "inherit",
          fontSize: "inherit",
          letterSpacing: "inherit",
          lineHeight: "inherit",
          color: "var(--color-ash)",
          pointerEvents: "auto",
          textAlign: "left",
        }}
      >
        {`// SND    [ ${muted ? tr("UNMUTE", "ACTIVER") : tr("MUTE", "COUPER")} ]`}
      </button>
    </div>
  );
}
