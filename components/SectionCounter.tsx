"use client";

import { useEffect, useRef, useState } from "react";
import type Lenis from "lenis";
import { useLenis } from "@/hooks/useLenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useT } from "@/lib/i18n";
import { SECTION_LIST } from "@/lib/sections";

/**
 * One fixed section counter ("03 / 09 · TERRAIN") that opens into the
 * section index: the navigation phones never had.
 *
 * It replaces the nine oversized ghost numerals, which slid under the HUD and
 * the sound button in every section and were the page's only contrast
 * failures. The desktop HUD already carries a section index, so the counter
 * shows where the HUD does not: under 768px, and under reduced motion (the
 * HUD is not rendered then). Same rule as the standalone AudioControl.
 *
 * It stays out of the way of the hero, whose own buttons sit bottom-left, and
 * appears once the visitor has left it.
 */
export function SectionCounter() {
  const prefersReduced = useReducedMotion();
  const { tr } = useT();
  const [active, setActive] = useState("01");
  const [open, setOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useLenis((lenis) => { lenisRef.current = lenis; }, [], 0);

  // Which section owns the band 40 % down the viewport (the HUD's rule too).
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[data-section-id]");
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.sectionId ?? "01");
        }
      },
      { rootMargin: "-40% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Close on Escape (focus back on the button) and on any outside press.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const go = (id: string) => {
    const target = document.querySelector<HTMLElement>(`section[data-section-id="${id}"]`);
    setOpen(false);
    if (!target) return;
    if (!prefersReduced && lenisRef.current) lenisRef.current.scrollTo(target, { offset: 0 });
    else target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    // Move focus with the view, so the next Tab continues from the section
    // the visitor asked for rather than from the menu they left.
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };

  const current = SECTION_LIST.find((s) => s.id === active) ?? SECTION_LIST[0];
  const total = String(SECTION_LIST.length).padStart(2, "0");
  const hidden = active === SECTION_LIST[0].id && !open;

  return (
    <div
      ref={rootRef}
      className={`section-counter${prefersReduced ? " section-counter--force" : ""}`}
      data-hidden={hidden ? "" : undefined}
    >
      <nav
        id="section-index"
        aria-label={tr("Sections", "Sections")}
        className="section-counter-menu"
        data-open={open ? "" : undefined}
      >
        <ol>
          {SECTION_LIST.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => go(s.id)}
                aria-current={s.id === active ? "location" : undefined}
                tabIndex={open ? 0 : -1}
              >
                <span aria-hidden="true">{s.id}</span> {tr(s.en, s.fr)}
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <button
        ref={buttonRef}
        type="button"
        className="section-counter-button"
        aria-expanded={open}
        aria-controls="section-index"
        onClick={() => setOpen((o) => !o)}
      >
        {/* The visible text stays inside the accessible name, in order, so a
            voice user can say what they see (WCAG 2.5.3). */}
        <span className="sr-only">{"Section "}</span>
        <span className="section-counter-num">{current.id}</span>
        <span className="section-counter-total">{`/ ${total}`}</span>
        <span className="section-counter-name">{tr(current.en, current.fr)}</span>
        <span className="sr-only">{tr(", section index", ", index des sections")}</span>
        <span aria-hidden="true" className="section-counter-caret">{open ? "▾" : "▴"}</span>
      </button>
    </div>
  );
}
