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
// IMPORTANT: When the Preloader is showing (first visit in session), we must
// NOT run this fade-in. Setting opacity: 0 on this wrapper also hides all
// position:fixed descendants (including the Preloader itself) because CSS
// opacity composites the entire subtree — there is no way around this via
// z-index or position:fixed. We detect the preloader state via sessionStorage
// (same key the Preloader sets on complete) so the animation only runs on
// subsequent navigations where no Preloader is shown.
const SESSION_KEY = "nullsec_booted";

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;
    // Skip the fade when the boot sequence hasn't run yet — the Preloader is
    // covering the page and handles its own entrance. After first boot this key
    // is set to "1", so navigations between routes get the fade.
    if (sessionStorage.getItem(SESSION_KEY) !== "1") return;
    // Reduced motion still gets a soft, quicker cross-fade — opacity-only is
    // vestibular-safe, so route transitions feel intentional rather than abrupt.
    gsap.fromTo(
      ref.current,
      { opacity: 0 },
      { opacity: 1, duration: prefersReduced ? 0.3 : 0.55, ease: "power2.out" }
    );
  }, [prefersReduced]);

  return <div ref={ref}>{children}</div>;
}
