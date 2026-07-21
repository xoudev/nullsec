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
  const titleRef = useRef<HTMLDivElement>(null);
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
      void preloadSound("/click.mp3");
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

  // Global key listener — Enter or Space fires boot. Deliberately NOT every
  // key: Tab must keep reaching the skip link, and modifier combos must not
  // hijack the keyboard.
  useEffect(() => {
    if (booting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key !== "Enter" && e.key !== " ") return;
      triggerBoot();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [booting, triggerBoot]);

  // Never strand a passive visitor at the prompt: auto-boot quickly. A
  // recruiter must reach the identity in ~4s without touching anything.
  // Returning visitors (localStorage flag) get a near-immediate boot — the
  // ritual is first-visit theatre, not a recurring toll.
  useEffect(() => {
    if (booting) return;
    let returning = false;
    try {
      returning = localStorage.getItem("nullsec_returning") === "1";
    } catch { /* storage unavailable */ }
    const t = setTimeout(triggerBoot, returning ? 600 : 2500);
    return () => clearTimeout(t);
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

    // Hard fallback — if GSAP silently fails, force completion after 4s.
    const fallback = setTimeout(() => {
      if (overlayRef.current) overlayRef.current.style.display = "none";
      onComplete();
    }, 4000);

    const complete = () => {
      clearTimeout(fallback);
      if (overlayRef.current) overlayRef.current.style.display = "none";
      void playAmbient("/sound.mp3");
      onComplete();
    };

    const counter = { val: 0 };
    const tl = gsap.timeline({ onComplete: complete });

    // Deliberately brief (~1.9s total): the ritual sets the tone, it must
    // never gate a recruiter. Phase 1 (0–1.2s): counter + log lines.
    tl.to(counter, {
      val: 100,
      duration: 1.2,
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
        stagger: 1.2 / LOG_LINES.length,
        duration: 0,
        ease: "none",
      },
      0
    );

    // Phase 2 (1.1s): NULLSEC title fades in.
    tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 1.1);

    // Phase 3 (1.45s): chars scatter.
    tl.call(() => {
      if (!titleRef.current) return;
      const { chars } = splitChars(titleRef.current);
      gsap.to(chars, {
        x: () => gsap.utils.random(-300, 300) as number,
        y: () => gsap.utils.random(-200, 200) as number,
        rotation: () => gsap.utils.random(-25, 25) as number,
        opacity: 0,
        duration: 0.45,
        stagger: { each: 0.02, from: "center" },
        ease: "power2.in",
      });
    }, [], 1.45);

    // Phase 4 (1.85s): overlay fades to void.
    tl.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: "power1.in" }, 1.85);

    // Impatient visitors skip the animation entirely: any Enter/Space/click
    // during the boot jumps straight to the end state.
    const skip = () => tl.progress(1);
    const onSkipKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") skip();
    };
    window.addEventListener("keydown", onSkipKey);
    window.addEventListener("pointerdown", skip);

    return () => {
      tl.kill();
      clearTimeout(fallback);
      window.removeEventListener("keydown", onSkipKey);
      window.removeEventListener("pointerdown", skip);
    };
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
        {tr("// BOOT SEQUENCE", "// SÉQUENCE D'AMORÇAGE")}
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
            aria-label={tr("Start — press Enter or click to boot", "Lancer le démarrage : appuyez sur Entrée ou cliquez")}
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
              : tr("[ PRESS ENTER TO MOUNT /DEV/IDENTITY ]", "[ ENTRÉE POUR MONTER /DEV/IDENTITY ]")}
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

      {/* NULLSEC big title — decorative wordmark (the hero owns the page h1) */}
      <div
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
      </div>

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
