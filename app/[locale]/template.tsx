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
    // Where the View Transitions API exists, the route change is already
    // animated by the browser (a cross-fade, and the title morph; see
    // next.config.ts). Fading the new page in from 0 on top of that would
    // show it twice as faint for a moment. The GSAP fade stays the fallback.
    if (typeof document.startViewTransition === "function") return;
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
