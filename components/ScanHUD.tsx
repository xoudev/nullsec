"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
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
 * Every readout is real: NODE tracks the active section (or the section a
 * detail page belongs to), TTFB is the measured navigation timing, ENV and
 * BUILD come from the actual build. No fake telemetry — this is a security
 * portfolio, and its most technical visitors will check.
 *
 * The NODE row doubles as navigation: hovering the HUD reveals a clickable
 * section index (01–09) that smooth-scrolls via Lenis.
 *
 * Respects prefers-reduced-motion: returns null when set (the standalone
 * AudioControl covers the mute affordance in that case).
 */

// Audio-module state, subscribed the React-idiomatic way.
const subscribeMute = (cb: () => void) => onMuteChange(() => cb());
const subscribeVolume = (cb: () => void) => onVolumeChange(() => cb());

const SECTIONS: { id: string; label: string; fr: string }[] = [
  { id: "01", label: "IDENTITY", fr: "IDENTITÉ" },
  { id: "02", label: "FIELDWORK", fr: "TERRAIN" },
  { id: "03", label: "TOOLKIT", fr: "OUTILLAGE" },
  { id: "04", label: "CLEARANCE", fr: "HABILITATIONS" },
  { id: "05", label: "ABOUT", fr: "À PROPOS" },
  { id: "06", label: "EXPERIENCE", fr: "EXPÉRIENCE" },
  { id: "07", label: "DISPATCHES", fr: "DÉPÊCHES" },
  { id: "08", label: "OFF-DUTY", fr: "HORS SERVICE" },
  { id: "09", label: "HANDSHAKE", fr: "CONTACT" },
];

export function ScanHUD() {
  const prefersReduced = useReducedMotion();
  const { tr } = useT();
  const pathname = usePathname();
  const muted = useSyncExternalStore(subscribeMute, getMuted, () => false);
  const vol = useSyncExternalStore(subscribeVolume, getVolume, () => 20);
  const [navOpen, setNavOpen] = useState(false);

  const nodeRef = useRef<HTMLSpanElement>(null);
  const ttfbRef = useRef<HTMLSpanElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const isHome = pathname === "/";

  // Global click sound — fires on any interactive element click.
  useEffect(() => {
    const INTERACTIVE = "a, button, [role='button'], input, label";
    const handler = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(INTERACTIVE)) {
        playClick("/click.mp3");
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Real TTFB from navigation timing — measured, not invented.
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav && ttfbRef.current) {
      ttfbRef.current.textContent = `${Math.max(0, Math.round(nav.responseStart - nav.requestStart))}ms`;
    }
  }, []);

  // Track which section is in the active viewport band (homepage), or pin the
  // section the current detail route belongs to.
  useEffect(() => {
    if (prefersReduced) return;

    if (!isHome) {
      if (nodeRef.current) {
        nodeRef.current.textContent = pathname.startsWith("/work")
          ? "0x02"
          : pathname.startsWith("/dispatches")
            ? "0x07"
            : "0x00";
      }
      return;
    }

    const sections = document.querySelectorAll("[data-section-id]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && nodeRef.current) {
            const id = (entry.target as HTMLElement).dataset.sectionId ?? "??";
            nodeRef.current.textContent = `0x${id}`;
          }
        }
      },
      { rootMargin: "-40% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [prefersReduced, isHome, pathname]);

  // Capture the Lenis instance for scrollTo navigation.
  useLenis(
    (lenis) => { lenisRef.current = lenis; },
    [],
    0
  );

  const scrollToSection = (id: string) => {
    const target = document.querySelector<HTMLElement>(`[data-section-id="${id}"]`);
    if (!target) return;
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: 0 });
    else target.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  if (prefersReduced) return null;

  const SEGMENTS = 14;
  const filled = muted ? 0 : Math.round((vol / 100) * SEGMENTS);

  return (
    <div
      className="scan-hud"
      role="complementary"
      aria-label={tr("Status HUD", "HUD d'état")}
      onMouseEnter={() => setNavOpen(true)}
      onMouseLeave={() => setNavOpen(false)}
      onFocus={() => setNavOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setNavOpen(false);
      }}
      style={{
        position: "fixed",
        top: "1.5rem",
        right: "1.5rem",
        zIndex: 50,
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: "0.65rem",
        lineHeight: "1.6",
        color: "var(--color-ash)",
        pointerEvents: "auto",
        userSelect: "none",
        letterSpacing: "0.05em",
        // Solid-enough veil so scrolling content never renders through the HUD.
        backgroundColor: "rgba(15,15,18,0.9)",
        padding: "0.5rem 0.75rem",
        margin: "-0.5rem -0.75rem",
      }}
    >
      <div aria-hidden="true">{tr("// SCAN   ACTIVE", "// SCAN   ACTIF")}</div>
      <div aria-hidden="true">
        {"// NODE   "}
        <span ref={nodeRef}>{isHome ? "0x01" : "0x00"}</span>
      </div>
      <div aria-hidden="true">
        {"// TTFB   "}
        <span ref={ttfbRef}>{"—"}</span>
      </div>
      <div aria-hidden="true">
        {"// ENV    "}
        {process.env.NODE_ENV === "production" ? "prod.nullsec" : "dev.nullsec"}
      </div>
      <div aria-hidden="true">
        {"// BUILD  "}
        {process.env.NEXT_PUBLIC_BUILD_ID ?? "local"}
      </div>

      {/* Persistent CV link — pointer convenience; also keyboard-reachable. */}
      <a
        href={profile.cvUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="open ↗"
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
        <span aria-hidden="true">{"// VOL   "}</span>
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
            aria-label={tr(`Volume: ${vol}%`, `Volume : ${vol}%`)}
            data-cursor="vol"
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
        aria-pressed={muted}
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

      {/* Section index — revealed on hover/focus; the HUD is also a nav. */}
      {isHome && (
        <nav
          aria-label={tr("Section index", "Index des sections")}
          style={{
            maxHeight: navOpen ? `${SECTIONS.length * 1.6}em` : 0,
            overflow: "hidden",
            transition: "max-height 0.25s ease, opacity 0.2s ease",
            opacity: navOpen ? 1 : 0,
            marginTop: navOpen ? "0.45em" : 0,
            borderTop: navOpen ? "1px solid rgba(107,107,107,0.25)" : "none",
            pointerEvents: navOpen ? "auto" : "none",
          }}
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              data-cursor="jump"
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
                textAlign: "left",
                width: "100%",
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = "var(--color-bone)"; }}
              onMouseOut={(e) => { e.currentTarget.style.color = "var(--color-ash)"; }}
            >
              {`// ${s.id}     ${tr(s.label, s.fr)}`}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
