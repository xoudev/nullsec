"use client";

import { useEffect, useRef } from "react";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import { loadScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/hooks/useLenis";

/**
 * Mounts once in page.tsx to:
 * 1. Keep GSAP ScrollTrigger in sync with Lenis smooth scroll.
 * 2. Refresh ScrollTrigger after fonts are fully loaded.
 *
 * ScrollTrigger is loaded lazily (browser-only) to avoid SSR breakage.
 */
export function GSAPInit() {
  const stRef = useRef<typeof ScrollTriggerType | null>(null);

  useEffect(() => {
    loadScrollTrigger().then((ST) => {
      stRef.current = ST;
      document.fonts.ready.then(() => ST.refresh());
    });

    return () => {
      stRef.current?.killAll();
    };
  }, []);

  // On every Lenis scroll tick, tell ScrollTrigger to re-read window.scrollY.
  useLenis(() => {
    stRef.current?.update();
  }, []);

  return null;
}
