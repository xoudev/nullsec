"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { HeroLookFactory } from "@/lib/hero-bg/types";
import { createTopo } from "@/lib/hero-bg/topo";
import { createParticles } from "@/lib/hero-bg/particles";
import { createNoise } from "@/lib/hero-bg/noise";
import { createGrid } from "@/lib/hero-bg/grid";

/**
 * Generative background layer for the hero. A transparent canvas sits behind the
 * hero content and renders one of several faint, monochrome, scroll-reactive
 * "looks". Preview any look with `?bg=topo|particles|noise|grid`. Respects
 * prefers-reduced-motion (renders a single static frame, no loop).
 */
const LOOKS: Record<string, HeroLookFactory> = {
  topo: createTopo,
  particles: createParticles,
  noise: createNoise,
  grid: createGrid,
};
const DEFAULT_LOOK = "topo";

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    // Pick the look from the ?bg= query param (for previewing), else the default.
    let name = DEFAULT_LOOK;
    try {
      const q = new URLSearchParams(window.location.search).get("bg");
      if (q && LOOKS[q]) name = q;
    } catch {
      /* ignore */
    }
    const look = (LOOKS[name] ?? LOOKS[DEFAULT_LOOK])(ctx);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      look.resize(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const scrollProgress = () => {
      const vh = window.innerHeight || 1;
      const y = window.scrollY || 0;
      return Math.max(0, Math.min(1, y / vh));
    };

    let raf = 0;
    const start =
      typeof performance !== "undefined" ? performance.now() : 0;

    if (prefersReduced) {
      // Reduced motion: one static frame, no animation loop.
      look.frame(0, scrollProgress());
    } else {
      const loop = (now: number) => {
        look.frame(now - start, scrollProgress());
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      look.destroy?.();
    };
  }, [prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
