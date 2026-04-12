"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// template.tsx re-mounts on every route change (unlike layout.tsx which
// persists across navigations). This gives each page a clean fade entrance.
//
// NOTE: Do NOT animate y/x/transform on this wrapper. CSS spec §9.6.2: a
// `position: fixed` descendant is positioned relative to its nearest
// transformed ancestor. GSAP ScrollTrigger pins via `position: fixed`, so
// any transform here shifts the pinned section off-screen during the tween.
// Opacity-only avoids this entirely.
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced || !ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.55, ease: "power2.out" }
    );
  }, [prefersReduced]);

  return <div ref={ref}>{children}</div>;
}
