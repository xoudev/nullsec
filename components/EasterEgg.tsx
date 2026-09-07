"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useT } from "@/lib/i18n";

/**
 * Konami code easter egg. The banner is deliberately the only place on the
 * site where this string exists in the DOM at rest: it renders nothing until
 * the sequence lands, so it never reaches a crawler, a print stylesheet or the
 * OG card.
 *
 * The terminal carries the same payload under an undocumented `twerk` command
 * (see SectionHandshake), so the egg has a second, typed way in.
 */
export const TWERK_BANNER = "🕺 TWERK PROTOCOL REMAINS ACTIVE 🕺";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

const VISIBLE_MS = 6000;

export function EasterEgg() {
  const [open, setOpen] = useState(false);
  const progress = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReduced = useReducedMotion();
  const { tr } = useT();

  const close = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setOpen(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Never swallow input meant for the terminal or a form field, and leave
      // browser shortcuts alone.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }

      if (open) {
        close();
        return;
      }

      const expected = KONAMI[progress.current];
      // Arrows are compared as-is; the b/a tail is case-insensitive so caps
      // lock does not defeat the sequence.
      const hit =
        expected.startsWith("Arrow") ? e.key === expected : e.key.toLowerCase() === expected;

      if (!hit) {
        // A miss restarts the run, but a first key that matches step 0 starts
        // the next attempt immediately rather than wasting the keystroke.
        progress.current = e.key === KONAMI[0] ? 1 : 0;
        return;
      }

      progress.current += 1;
      if (progress.current === KONAMI.length) {
        progress.current = 0;
        setOpen(true);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    timer.current = setTimeout(() => setOpen(false), VISIBLE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="easter-egg"
      role="status"
      aria-live="polite"
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15,15,18,0.86)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.7rem",
          letterSpacing: "0.28em",
          color: "var(--color-violet)",
          marginBottom: "1.25rem",
          textTransform: "uppercase",
        }}
      >
        {tr("// undocumented protocol", "// protocole non documenté")}
      </div>

      <div
        style={{
          width: "min(92vw, 60rem)",
          borderTop: "3px solid var(--color-blood)",
          borderBottom: "3px solid var(--color-blood)",
          padding: "clamp(1.25rem, 4vw, 2.5rem) 1rem",
          textAlign: "center",
        }}
      >
        <div
          className={prefersReduced ? undefined : "easter-egg-pulse"}
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontWeight: 700,
            fontSize: "clamp(1.05rem, 4.2vw, 2.75rem)",
            lineHeight: 1.25,
            letterSpacing: "0.06em",
            color: "var(--color-bone)",
            wordBreak: "break-word",
          }}
        >
          {TWERK_BANNER}
        </div>
      </div>

      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.68rem",
          letterSpacing: "0.16em",
          color: "var(--color-ash)",
          marginTop: "1.25rem",
          textTransform: "uppercase",
        }}
      >
        {tr("not listed on the cv · press any key", "absent du cv · appuyez sur une touche")}
      </div>
    </div>
  );
}
