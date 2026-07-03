"use client";

import { useEffect, useRef } from "react";
import type Lenis from "lenis";
import { useLenis } from "@/hooks/useLenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Keyboard shortcuts 1–9 jump to the matching homepage section — on-brand for
 * a terminal site. Inactive while typing in an input/textarea (the handshake
 * terminal must receive digits) and under reduced motion (native jump only).
 */
export function SectionShortcuts() {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReduced = useReducedMotion();

  useLenis((lenis) => { lenisRef.current = lenis; }, [], 0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (!/^[1-9]$/.test(e.key)) return;
      const id = e.key.padStart(2, "0");
      const section = document.querySelector<HTMLElement>(`[data-section-id="${id}"]`);
      if (!section) return;
      if (!prefersReduced && lenisRef.current) lenisRef.current.scrollTo(section, { offset: 0 });
      else section.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prefersReduced]);

  return null;
}
