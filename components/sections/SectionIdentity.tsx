"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { splitChars } from "@/lib/splitText";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { profile } from "@/profile";

interface SectionIdentityProps {
  booted: boolean;
}

export function SectionIdentity({ booted }: SectionIdentityProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref   = useRef<HTMLDivElement>(null);
  const line2Ref   = useRef<HTMLDivElement>(null);
  const metaRef    = useRef<HTMLDivElement>(null);
  const arrowRef   = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const animated = useRef(false);

  useEffect(() => {
    if (!booted || animated.current) return;
    if (!line1Ref.current || !line2Ref.current) return;
    animated.current = true;

    // ── Reduced motion: immediate reveal ──────────────────────────
    if (prefersReduced) {
      gsap.set(
        [line1Ref.current, line2Ref.current, metaRef.current, arrowRef.current],
        { opacity: 1, y: 0 },
      );
      return;
    }

    // ── Main entrance timeline ─────────────────────────────────────
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      const { chars: chars1, restore: r1 } = splitChars(line1Ref.current!);
      const { chars: chars2, restore: r2 } = splitChars(line2Ref.current!);

      gsap.set([...chars1, ...chars2], { y: 80, opacity: 0 });

      tl.to(chars1, {
        y: 0, opacity: 1,
        duration: 0.8, stagger: 0.022, ease: "power3.out",
        onComplete: r1,
      });
      tl.to(chars2, {
        y: 0, opacity: 1,
        duration: 0.8, stagger: 0.022, ease: "power3.out",
        onComplete: r2,
      }, "-=0.55");
      tl.to(metaRef.current,  { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3");
      tl.to(arrowRef.current, { opacity: 1, duration: 0.4 }, "-=0.2");
      tl.to(arrowRef.current, {
        y: 10, duration: 0.8, ease: "power1.inOut", yoyo: true, repeat: -1,
      });
    });

    return () => { ctx.revert(); animated.current = false; };
  }, [booted, prefersReduced]);

  return (
    <section
      ref={sectionRef}
      data-section-id="01"
      aria-label="Identity"
      style={{
        minHeight:       "100dvh",
        backgroundColor: "var(--color-void)",
        display:         "flex",
        flexDirection:   "column",
        justifyContent:  "center",
        padding:         "clamp(1.5rem, 4vw, 3rem)",
        position:        "relative",
        overflow:        "hidden",
      }}
    >
      {/* Section number */}
      <div
        aria-hidden="true"
        style={{
          position:      "absolute",
          top:           "clamp(1.5rem, 4vw, 3rem)",
          left:          "clamp(1.5rem, 4vw, 3rem)",
          fontFamily:    "var(--font-jetbrains-mono)",
          fontSize:      "0.65rem",
          color:         "var(--color-blood)",
          letterSpacing: "0.1em",
          zIndex:        2,
        }}
      >
        01 // IDENTITY
      </div>

      {/* Title */}
      <div
        style={{ overflow: "hidden", position: "relative", zIndex: 2 }}
        aria-label="I map the blind spots."
      >
        <div
          ref={line1Ref}
          aria-hidden="true"
          style={{
            fontFamily:    "var(--font-instrument-serif)",
            fontStyle:     "italic",
            fontSize:      "clamp(4rem, 11vw, 18rem)",
            lineHeight:    0.85,
            color:         "var(--color-bone)",
            letterSpacing: "-0.02em",
            willChange:    "transform",
          }}
        >
          I map the
        </div>
        <div
          ref={line2Ref}
          aria-hidden="true"
          style={{
            fontFamily:    "var(--font-instrument-serif)",
            fontStyle:     "italic",
            fontSize:      "clamp(4rem, 11vw, 18rem)",
            lineHeight:    0.85,
            color:         "var(--color-bone)",
            letterSpacing: "-0.02em",
            willChange:    "transform",
          }}
        >
          blind spots.
        </div>
      </div>

      {/* Bottom row: metadata + scroll arrow */}
      <div
        style={{
          position:       "absolute",
          bottom:         "clamp(1.5rem, 4vw, 3rem)",
          left:           "clamp(1.5rem, 4vw, 3rem)",
          right:          "clamp(1.5rem, 4vw, 3rem)",
          display:        "flex",
          alignItems:     "flex-end",
          justifyContent: "space-between",
          zIndex:         2,
        }}
      >
        <div
          ref={metaRef}
          style={{
            position:      "relative",
            zIndex:        1,
            fontFamily:    "var(--font-jetbrains-mono)",
            fontSize:      "clamp(0.6rem, 0.9vw, 0.75rem)",
            color:         "var(--color-ash)",
            letterSpacing: "0.06em",
            lineHeight:    1.8,
            opacity:       0,
            transform:     "translateY(10px)",
          }}
        >
          <div>
            {"// "}{profile.handle}
            {" · "}{profile.age}
            {" · "}{profile.city.toLowerCase()}
            {" · open sept 2026"}
          </div>
          <div>{"// GRC · BLUE TEAM · DEVSECOPS"}</div>
          <div style={{ marginTop: "0.4rem", opacity: 0.6 }}>
            {"// "}{profile.tagline}
          </div>
        </div>

        <div
          ref={arrowRef}
          aria-hidden="true"
          style={{
            fontFamily:    "var(--font-jetbrains-mono)",
            fontSize:      "clamp(1rem, 2vw, 1.5rem)",
            color:         "var(--color-ash)",
            opacity:       0,
            willChange:    "transform",
            paddingBottom: "0.25rem",
          }}
        >
          ↓
        </div>
      </div>
    </section>
  );
}
