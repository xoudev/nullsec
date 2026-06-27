"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useLenis } from "lenis/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, label, [tabindex]";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Velocity-driven scaleY stretch on the trailing ring — fires on every Lenis tick.
  // useLenis must be called unconditionally (Rules of Hooks); guard inside.
  useLenis((lenis) => {
    if (!ringRef.current || prefersReduced) return;
    const stretch = 1 + Math.min(Math.abs(lenis.velocity) * 0.035, 0.5);
    gsap.to(ringRef.current, { scaleY: stretch, duration: 0.2, overwrite: "auto" });
  });

  useEffect(() => {
    if (prefersReduced) return;
    // Touch/stylus devices: skip the custom cursor entirely.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const ring = ringRef.current!;
    const dot = dotRef.current!;
    gsap.set([ring, dot], { xPercent: -50, yPercent: -50, opacity: 0 });

    // The dot tracks tightly; the ring lags behind for the trailing feel.
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3" });

    let revealed = false;
    const onMove = (e: MouseEvent) => {
      if (!revealed) {
        revealed = true;
        gsap.to([ring, dot], { opacity: 1, duration: 0.3, overwrite: "auto" });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(INTERACTIVE)) {
        gsap.to(ring, { width: 54, height: 54, borderWidth: 1, duration: 0.3, overwrite: "auto" });
        gsap.to(dot, { scale: 0, duration: 0.25, overwrite: "auto" });
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(INTERACTIVE)) {
        gsap.to(ring, { width: 30, height: 30, borderWidth: 1.5, duration: 0.3, overwrite: "auto" });
        gsap.to(dot, { scale: 1, duration: 0.25, overwrite: "auto" });
      }
    };

    // Click feedback — pull the ring in, release on mouseup.
    const onDown = () => gsap.to(ring, { width: 22, height: 22, duration: 0.18, overwrite: "auto" });
    const onUp = () => gsap.to(ring, { width: 30, height: 30, duration: 0.3, overwrite: "auto" });

    // Fade out when the pointer leaves the window, back in on return.
    const onDocLeave = () => gsap.to([ring, dot], { opacity: 0, duration: 0.2, overwrite: "auto" });
    const onDocEnter = () => gsap.to([ring, dot], { opacity: 1, duration: 0.2, overwrite: "auto" });

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onDocLeave);
    document.documentElement.addEventListener("mouseenter", onDocEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onDocLeave);
      document.documentElement.removeEventListener("mouseenter", onDocEnter);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <>
      {/* Trailing ring — inverts against whatever is behind it (works on void AND bone). */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          width: 30,
          height: 30,
          borderRadius: "50%",
          border: "1.5px solid var(--color-bone)",
          mixBlendMode: "difference",
          pointerEvents: "none",
          willChange: "transform, width, height",
          opacity: 0,
        }}
      />
      {/* Inner dot — brand accent, no blend so it stays blood-red. */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "var(--color-blood)",
          pointerEvents: "none",
          willChange: "transform",
          opacity: 0,
        }}
      />
    </>
  );
}
