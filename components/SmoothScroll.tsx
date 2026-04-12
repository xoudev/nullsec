"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// NOTE: Lenis easing mirrors the CSS ease-out-expo curve — gives the
// scroll a deliberate, editorial deceleration rather than a springy bounce.
const ease = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const prefersReduced = useReducedMotion();

  // When the user prefers reduced motion, skip Lenis entirely so the
  // browser handles scroll natively — no JS overhead, no animation.
  if (prefersReduced) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        easing: ease,
      }}
    >
      {children}
    </ReactLenis>
  );
}
