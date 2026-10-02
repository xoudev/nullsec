"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { curtainUp } from "@/lib/curtain";

// template.tsx re-mounts on every route change (unlike layout.tsx which
// persists across navigations). This gives each page a clean fade entrance.
//
// NOTE: Do NOT animate y/x/transform on this wrapper. CSS spec §9.6.2: a
// `position: fixed` descendant is positioned relative to its nearest
// transformed ancestor. GSAP ScrollTrigger pins via `position: fixed`, so
// any transform here shifts the pinned section off-screen during the tween.
// Opacity-only avoids this entirely.
//
// The fade runs on client-side navigations only, never on the document's
// first load. Fading the first load in from opacity 0 hid server-rendered
// content that was already painted, which a visitor sees as a flash and the
// browser records as a later LCP. A module-level flag is exactly the right
// lifetime: it survives client navigations and resets on every full load.
let hasMountedOnce = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!hasMountedOnce) {
      hasMountedOnce = true;
      return;
    }
    if (!ref.current) return;
    // Under the full-screen curtain (components/PageTransition.tsx) the new
    // page is revealed by the curtain itself: fading it in from 0 underneath
    // would show it half transparent as the strips lift. The fade stays for
    // every navigation the curtain leaves alone (back and forward, the
    // language toggle, reduced motion).
    if (curtainUp()) return;
    // Reduced motion still gets a soft, quicker cross-fade — opacity-only is
    // vestibular-safe, so route transitions feel intentional rather than abrupt.
    gsap.fromTo(
      ref.current,
      { opacity: 0 },
      { opacity: 1, duration: prefersReduced ? 0.3 : 0.55, ease: "power2.out" }
    );
    // prefersReduced is read at mount; a change mid-page must not replay the fade.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref}>{children}</div>;
}
