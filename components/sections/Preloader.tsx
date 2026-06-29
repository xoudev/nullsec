"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { splitChars } from "@/lib/splitText";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useT } from "@/lib/i18n";
import { unlockAudio, playAmbient, playFirst, preloadSound } from "@/lib/audio";

const LOG_LINES = [
  "[ok] mounting /dev/identity",
  "[ok] verifying pgp signatures",
  "[ok] scanning attack surface",
  "[ok] loading threat model",
  "[ok] initialising asset inventory",
  "[ok] applying zero-trust policy",
  "[ok] hardening kernel parameters",
  "[ok] binding to port 443",
  "[ok] nullsec operational",
];

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const logRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const prefersReduced = useReducedMotion();
  const { tr } = useT();
  const [booting, setBooting] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Called from user gesture — unlocks AudioContext before starting the sequence.
  const triggerBoot = useCallback(() => {
    try {
      unlockAudio();
      void playFirst("/loading.mp3");
      void preloadSound("/click.wav");
    } catch {
      // Audio is optional — boot regardless of AudioContext availability.
    }
    setBooting(true);
  }, []);

  // Reduced motion keeps the STATIC intro rather than auto-skipping it: the
  // boot screen is shown without the counter tick / log stagger / title scatter,
  // and the same press-enter / tap gesture dismisses it with a soft fade (see
  // the boot effect below). Auto-skipping it entirely is what made the site feel
  // broken to reduced-motion visitors — they never saw the intro at all.

  // Global key listener — any key fires boot.
  useEffect(() => {
    if (booting) return;
    const onKey = () => triggerBoot();
    window.addEventListener("keydown", onKey);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("keydown", onKey);
    };
  }, [booting, triggerBoot]);

  // Boot animation — runs once booting becomes true.
  useEffect(() => {
    if (!booting) return;

    // Reduced motion: no animated boot sequence — the static intro simply
    // soft-fades out once the visitor presses enter / taps.
    if (prefersReduced) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (overlayRef.current) overlayRef.current.style.display = "none";
          onComplete();
        },
      });
      tl.to(overlayRef.current, { opacity: 0, duration: 0.45, ease: "power1.out" });
      return () => { tl.kill(); };
    }

    // Hard fallback — if GSAP silently fails, force completion after 6s.
    const fallback = setTimeout(() => {
      if (overlayRef.current) overlayRef.current.style.display = "none";
      onComplete();
    }, 6000);

    const complete = () => {
      clearTimeout(fallback);
      if (overlayRef.current) overlayRef.current.style.display = "none";
      void playAmbient("/sound.wav");
      onComplete();
    };

    const counter = { val: 0 };
    const tl = gsap.timeline({ onComplete: complete });

    // Phase 1 (0–2.2s): counter ticks up + log lines reveal one by one.
    tl.to(counter, {
      val: 100,
      duration: 2.2,
      ease: "power1.inOut",
      onUpdate() {
        if (counterRef.current) {
          counterRef.current.textContent = String(
            Math.round(counter.val)
          ).padStart(3, "0");
        }
      },
    });

    tl.to(
      logRefs.current.filter(Boolean),
      {
        opacity: 1,
        stagger: 2.2 / LOG_LINES.length,
        duration: 0,
        ease: "none",
      },
      0
    );

    // Phase 2 (2.2s): NULLSEC title fades in.
    tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 2.0);

    // Phase 3 (2.55s): chars scatter.
    tl.call(() => {
      if (!titleRef.current) return;
      const { chars } = splitChars(titleRef.current);
      gsap.to(chars, {
        x: () => gsap.utils.random(-300, 300) as number,
        y: () => gsap.utils.random(-200, 200) as number,
        rotation: () => gsap.utils.random(-25, 25) as number,
        opacity: 0,
        duration: 0.55,
        stagger: { each: 0.025, from: "center" },
        ease: "power2.in",
      });
    }, [], 2.55);

    // Phase 4 (3.1s): overlay fades to void.
    tl.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: "power1.in" }, 3.1);

    return () => { tl.kill(); clearTimeout(fallback); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booting, prefersReduced]);

  return (
    <div
      ref={overlayRef}
      aria-label={tr("Loading NULLSEC", "Chargement de NULLSEC")}
      role="status"
      onClick={!booting ? triggerBoot : undefined}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "var(--color-void)",
        display: "flex",
        flexDirection: "column",
        padding: "clamp(1.5rem, 4vw, 3rem)",
        overflow: "hidden",
      }}
    >
      {/* Top-left label */}
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.65rem",
          color: "var(--color-ash)",
          letterSpacing: "0.08em",
          marginBottom: "auto",
        }}
      >
        {tr("// BOOT SEQUENCE", "// SÉQUENCE DE DÉMARRAGE")}
      </div>

      {/* Waiting prompt — shown before user triggers boot */}
      {!booting && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            onClick={triggerBoot}
            aria-label={tr("Start — press Enter or click to boot", "Démarrer : appuyez sur Entrée ou cliquez")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "clamp(0.65rem, 1.2vw, 0.85rem)",
              color: "var(--color-ash)",
              letterSpacing: "0.12em",
              display: "flex",
              alignItems: "center",
              gap: "0.5em",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                animation: "preloader-blink 1s step-end infinite",
                color: "var(--color-blood)",
                display: "inline-block",
                width: "0.6em",
              }}
            >
              _
            </span>
            {isTouch
              ? tr("[ TAP TO ENTER ]", "[ TOUCHEZ POUR ENTRER ]")
              : tr("[ PRESS ENTER TO MOUNT /DEV/IDENTITY ]", "[ APPUYEZ SUR ENTRÉE POUR MONTER /DEV/IDENTITY ]")}
          </button>
        </div>
      )}

      {/* Center: counter + log lines — always in DOM so GSAP refs are stable */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "clamp(1.5rem, 4vw, 3rem)",
          transform: "translateY(-60%)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "clamp(4rem, 12vw, 10rem)",
            lineHeight: 1,
            color: "var(--color-bone)",
            opacity: 0.08,
            letterSpacing: "-0.05em",
            userSelect: "none",
          }}
        >
          <span ref={counterRef}>000</span>
        </div>

        {/* Log lines */}
        <div style={{ marginTop: "1.5rem" }}>
          {LOG_LINES.map((line, i) => (
            <div
              key={i}
              ref={(el) => { logRefs.current[i] = el; }}
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "clamp(0.6rem, 1vw, 0.75rem)",
                color: "var(--color-ash)",
                opacity: 0,
                letterSpacing: "0.04em",
                lineHeight: 1.8,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* NULLSEC big title — appears at end of counter */}
      <h1
        ref={titleRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -44%)",
          fontFamily: "var(--font-instrument-serif)",
          fontStyle: "italic",
          fontSize: "clamp(5rem, 18vw, 22rem)",
          lineHeight: 0.85,
          color: "var(--color-bone)",
          margin: 0,
          whiteSpace: "nowrap",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      >
        NULLSEC
      </h1>

      {/* Bottom-right: env label */}
      <div
        style={{
          marginTop: "auto",
          marginLeft: "auto",
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.65rem",
          color: "var(--color-ash)",
          letterSpacing: "0.08em",
        }}
      >
        {"prod.nullsec // v1.0.0"}
      </div>
    </div>
  );
}
