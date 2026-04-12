"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useLenis } from "lenis/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, label, [tabindex]";

export function CustomCursor() {
  const el = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Velocity-driven scaleY stretch — fires on every Lenis scroll tick.
  // useLenis must be called unconditionally (Rules of Hooks), so the
  // prefersReduced guard lives inside the callback.
  useLenis((lenis) => {
    if (!el.current || prefersReduced) return;
    const stretch = 1 + Math.min(Math.abs(lenis.velocity) * 0.04, 0.6);
    gsap.to(el.current, { scaleY: stretch, duration: 0.15, overwrite: "auto" });
  });

  useEffect(() => {
    if (prefersReduced) return;
    // Touch/stylus devices: skip custom cursor entirely.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = el.current!;
    // xPercent/yPercent centering auto-adjusts when width/height animate.
    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });

    const moveX = gsap.quickTo(cursor, "x", { duration: 0.08, ease: "none" });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.08, ease: "none" });

    const onMove = (e: MouseEvent) => {
      // Reveal on first move so it doesn't flash at (0,0) on load.
      gsap.set(cursor, { opacity: 1 });
      moveX(e.clientX);
      moveY(e.clientY);
    };

    const onEnter = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(INTERACTIVE)) {
        gsap.to(cursor, {
          width: 28,
          height: 28,
          backgroundColor: "transparent",
          border: "1px solid var(--color-blood)",
          duration: 0.25,
          overwrite: "auto",
        });
      }
    };

    const onLeave = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(INTERACTIVE)) {
        gsap.to(cursor, {
          width: 8,
          height: 8,
          backgroundColor: "var(--color-blood)",
          border: "1px solid transparent",
          duration: 0.25,
          overwrite: "auto",
        });
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      ref={el}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "var(--color-blood)",
        border: "1px solid transparent",
        pointerEvents: "none",
        willChange: "transform",
        opacity: 0,
      }}
    />
  );
}
