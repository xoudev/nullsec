"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useT } from "@/lib/i18n";
import { unlockAudio, preloadSound, playClick, playOnce } from "@/lib/audio";
import { profile } from "@/profile";

/**
 * Konami-code easter egg. The site treats an unauthorised dance as a SEV-1:
 * a fake incident card escalates through a SOC runbook, fails to contain
 * anything, and gives up. The payload renders nothing until the sequence
 * lands, so the string never reaches a crawler, a print stylesheet or the OG
 * card.
 *
 * The terminal carries the same scene under an undocumented `twerk` command
 * (see SectionHandshake), so the egg has a second, typed way in.
 */
export const TWERK_BANNER = "🕺 TWERK PROTOCOL REMAINS ACTIVE 🕺";

/** Dispatched by the terminal's `twerk` command to open the same scene. */
export const TWERK_EVENT = "nullsec:twerk";

export function fireTwerk() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(TWERK_EVENT));
}

// Compared lowercased, so caps lock and shift never defeat the tail.
const KONAMI = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
] as const;

const TICK_SRC = "/konami.wav";
const SCENE_SRC = "/twerk.mp3";
// Every correct key lifts the tick, so the sequence audibly tightens as it
// completes: one 14 KB sample resampled ten times, rather than ten files.
const TICK_STEP = 0.06;

/** Length of the longest tail of `buf` that is also a prefix of KONAMI. */
function matchLength(buf: readonly string[]): number {
  for (let k = Math.min(buf.length, KONAMI.length); k > 0; k--) {
    let ok = true;
    for (let i = 0; i < k; i++) {
      if (buf[buf.length - k + i] !== KONAMI[i]) {
        ok = false;
        break;
      }
    }
    if (ok) return k;
  }
  return 0;
}

const STEP_MS = 850;
// Long enough for the runbook to play out and still be read, then it clears
// itself. Any key, any click and Escape cut it short.
const VISIBLE_MS = 9500;

// Containment climbs, then collapses to nothing on the last beat.
const CONTAINMENT = [11, 27, 43, 58, 74, 88, 0];

export function EasterEgg() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const openRef = useRef(false);
  const buffer = useRef<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReduced = useReducedMotion();
  const { tr } = useT();

  const close = useCallback(() => {
    openRef.current = false;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setOpen(false);
  }, []);

  const launch = useCallback(() => {
    openRef.current = true;
    buffer.current = [];
    setStep(0);
    setOpen(true);
    try {
      // Both entrances (the sequence and the terminal command) reach here from
      // inside a real gesture, so the context is allowed to resume.
      unlockAudio();
      void playOnce(SCENE_SRC);
    } catch {
      // Sound is optional — never let it hold up the scene.
    }
  }, []);

  // Bound once for the life of the component: `open` lives in a ref so the
  // listener is never torn down and re-added in the middle of a sequence.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Leave browser and OS shortcuts alone.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

      if (openRef.current) {
        // Auto-repeat from the key that opened the scene must not dismiss it:
        // that would cut the visuals and leave the sound playing over nothing.
        if (e.repeat) return;
        // Any key dismisses — except while typing, so the terminal underneath
        // stays usable. Escape always works.
        if (!typing || e.key === "Escape") close();
        return;
      }

      // Matched on a rolling window rather than a strict cursor: a stray
      // keystroke mid-run no longer voids the attempt. It runs inside the
      // terminal too — no real command ends in this exact tail.
      const buf = buffer.current;
      buf.push(e.key.toLowerCase());
      if (buf.length > KONAMI.length) buf.shift();

      const hit = matchLength(buf);
      if (hit === KONAMI.length) {
        launch();
        return;
      }
      if (hit === 1) {
        // The first key of the sequence is a genuine gesture, and the only
        // moment we know someone is attempting the code: nothing is fetched
        // for the visitors who never try it, which is nearly all of them.
        try {
          unlockAudio();
          void preloadSound(TICK_SRC);
          void preloadSound(SCENE_SRC);
        } catch {
          // Sound is optional.
        }
      }
      // Silent on the very first attempt of a session, since the sample is
      // still in flight; playClick no-ops on a cold cache rather than lagging.
      if (hit >= 1) playClick(TICK_SRC, 1 + (hit - 1) * TICK_STEP);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener(TWERK_EVENT, launch);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(TWERK_EVENT, launch);
    };
  }, [close, launch]);

  const log = useMemo(
    () => [
      tr("escalating to tier 2…", "escalade au niveau 2…"),
      tr("tier 2 has joined the dance", "le niveau 2 a rejoint la piste"),
      tr("paging the ciso…", "réveil du RSSI…"),
      tr("the ciso is twerking too", "le RSSI twerke aussi"),
      tr("isolating the host…", "isolation de l'hôte…"),
      tr("host declines. host is vibing.", "l'hôte refuse. l'hôte est dans l'ambiance."),
      tr("containment failed · protocol persists", "confinement échoué · le protocole persiste"),
    ],
    [tr],
  );

  // Advance the runbook, and clear the whole thing once it has played out.
  useEffect(() => {
    if (!open) return;
    timer.current = setTimeout(close, VISIBLE_MS);
    const tick = setInterval(() => {
      setStep((s) => (s >= log.length - 1 ? s : s + 1));
    }, STEP_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      clearInterval(tick);
    };
  }, [open, close, log.length]);

  // Deterministic confetti: same field every time, no hydration surprises.
  const dancers = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        glyph: i % 2 ? "💃" : "🕺",
        left: `${(i * 5.4 + ((i * 37) % 11)) % 96}%`,
        delay: `${((i * 13) % 40) / 10}s`,
        duration: `${3.4 + ((i * 7) % 6) * 0.4}s`,
        size: `${1.1 + ((i * 5) % 4) * 0.4}rem`,
      })),
    [],
  );

  if (!open) return null;

  const last = step >= log.length - 1;
  const pct = CONTAINMENT[Math.min(step, CONTAINMENT.length - 1)];
  const mono = "var(--font-jetbrains-mono)";

  const row = (label: string, value: React.ReactNode) => (
    <div style={{ display: "flex", gap: "0.9rem", lineHeight: 2 }}>
      <span
        style={{
          color: "var(--color-ash)",
          flex: "0 0 clamp(5.5rem, 24vw, 8.5rem)",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </span>
      <span style={{ color: "var(--color-bone)", minWidth: 0, wordBreak: "break-word" }}>
        {value}
      </span>
    </div>
  );

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
        gap: "clamp(0.9rem, 2vw, 1.5rem)",
        padding: "1.25rem",
        overflow: "hidden",
        background: "rgba(15,15,18,0.9)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      {/* Dance floor. Decorative, non-interactive, and gone under reduced motion. */}
      {!prefersReduced && (
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {dancers.map((d, i) => (
            <span
              key={i}
              className="twerk-fall"
              style={{
                position: "absolute",
                top: 0,
                left: d.left,
                fontSize: d.size,
                animationDelay: d.delay,
                animationDuration: d.duration,
              }}
            >
              {d.glyph}
            </span>
          ))}
        </div>
      )}

      {/* ── Incident card ── */}
      <div
        style={{
          position: "relative",
          width: "min(94vw, 44rem)",
          border: "1px solid rgba(107,107,107,0.35)",
          background: "var(--color-void)",
          fontFamily: mono,
          fontSize: "clamp(0.62rem, 1.5vw, 0.78rem)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            padding: "0.55rem 1rem",
            borderBottom: "1px solid rgba(107,107,107,0.28)",
            backgroundColor: "rgba(107,107,107,0.06)",
            letterSpacing: "0.12em",
          }}
        >
          <span style={{ color: "var(--color-ash)" }}>{"// INCIDENT 0xDA7CE"}</span>
          <span
            className={prefersReduced ? undefined : "twerk-blink"}
            style={{ color: "var(--color-blood)", whiteSpace: "nowrap" }}
          >
            {tr("SEV-1 · CRITICAL", "SEV-1 · CRITIQUE")}
          </span>
        </div>

        <div style={{ padding: "0.85rem 1rem 1rem" }}>
          {row(tr("VECTOR", "VECTEUR"), "konami://UUDDLRLRBA")}
          {row(
            tr("TECHNIQUE", "TECHNIQUE"),
            tr("T1337 · rhythmic lateral movement", "T1337 · déplacement latéral rythmé"),
          )}
          {row(tr("ASSET", "ACTIF"), profile.siteUrl.replace(/^https?:\/\//, ""))}
          {row(
            tr("CONTAINMENT", "CONFINEMENT"),
            <span style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
              <span
                aria-hidden="true"
                style={{
                  display: "block",
                  width: "min(34vw, 12rem)",
                  height: "0.5rem",
                  border: "1px solid rgba(107,107,107,0.45)",
                }}
              >
                <span
                  style={{
                    display: "block",
                    height: "100%",
                    width: `${pct}%`,
                    background: last ? "var(--color-blood)" : "var(--color-bone)",
                    transition: prefersReduced ? undefined : "width 0.4s linear",
                  }}
                />
              </span>
              <span
                style={{
                  color: last ? "var(--color-blood)" : "var(--color-bone)",
                  whiteSpace: "nowrap",
                }}
              >
                {last ? tr("FAILED", "ÉCHEC") : `${pct}%`}
              </span>
            </span>,
          )}
        </div>
      </div>

      {/* ── The payload ── */}
      <div
        className={prefersReduced ? undefined : "twerk-shake"}
        style={{
          position: "relative",
          width: "min(94vw, 44rem)",
          borderTop: "3px solid var(--color-blood)",
          borderBottom: "3px solid var(--color-blood)",
          padding: "clamp(0.9rem, 3vw, 1.6rem) 0.75rem",
          textAlign: "center",
          fontFamily: mono,
          fontWeight: 700,
          fontSize: "clamp(0.95rem, 3.6vw, 2.1rem)",
          lineHeight: 1.3,
          letterSpacing: "0.05em",
          color: "var(--color-bone)",
          wordBreak: "break-word",
          background: "var(--color-void)",
        }}
      >
        {TWERK_BANNER}
      </div>

      {/* ── Runbook. Theatre: announced once via the banner above, not line by line. ── */}
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          width: "min(94vw, 44rem)",
          minHeight: "clamp(6rem, 14vw, 8.5rem)",
          fontFamily: mono,
          fontSize: "clamp(0.62rem, 1.5vw, 0.76rem)",
          lineHeight: 1.95,
          color: "var(--color-ash)",
        }}
      >
        {log.slice(0, step + 1).map((line, i) => (
          <div key={i} style={{ color: i === log.length - 1 ? "var(--color-blood)" : undefined }}>
            <span style={{ color: "var(--color-blood)" }}>{"> "}</span>
            {line}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "relative",
          fontFamily: mono,
          fontSize: "0.66rem",
          letterSpacing: "0.16em",
          color: "var(--color-ash)",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {tr(
          "not on the cv · not in the runbook · press any key",
          "absent du cv · absent du runbook · appuyez sur une touche",
        )}
      </div>
    </div>
  );
}
