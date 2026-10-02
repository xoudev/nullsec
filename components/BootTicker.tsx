"use client";

import { useEffect, useState } from "react";
import { afterCurtain } from "@/lib/curtain";

/**
 * The boot sequence, reduced to one line that never stands between a visitor
 * and the page.
 *
 * It used to be a full-screen gate: a 2.5 s wait at a prompt, then a 1.9 s
 * animation, then the hero's own reveal. The page was ready in 0.2 s and the
 * name only became readable after 5 to 6.6 s. Now the hero is painted
 * straight from the HTML, and this ticker runs over it once per session: the
 * same log lines, a hairline that fills, then nothing. It is aria-hidden,
 * ignores the pointer and takes no layout space, so it cannot cost a click,
 * a reflow or a screen-reader announcement.
 */

const LOG_LINES = [
  "[ok] mounting /dev/identity",
  "[ok] verifying pgp signatures",
  "[ok] scanning attack surface",
  "[ok] loading threat model",
  "[ok] initialising asset inventory",
  "[ok] applying zero-trust policy",
  "[ok] hardening kernel parameters",
  "[ok] binding to port 443",
  "[ok] nullsec operational",
];

const SESSION_KEY = "nullsec_booted";
const STEP_MS = 95;
const HOLD_MS = 350;

export function BootTicker() {
  const [line, setLine] = useState(-1); // -1: not running
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch { /* storage unavailable: run it, it is harmless */ }
    // Read at mount rather than through useReducedMotion: during hydration
    // that hook reports the server value (false) for one render, which would
    // start the timers for a visitor who asked for no motion.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) return;

    // Arriving through the page curtain, start once it has lifted rather
    // than run out unseen under it.
    const timers: ReturnType<typeof setTimeout>[] = [];
    const cancel = afterCurtain(() => {
      LOG_LINES.forEach((_, i) => timers.push(setTimeout(() => setLine(i), i * STEP_MS)));
      const end = LOG_LINES.length * STEP_MS + HOLD_MS;
      timers.push(setTimeout(() => setLeaving(true), end));
      timers.push(setTimeout(() => setLine(-1), end + 400));
    });
    return () => {
      cancel();
      timers.forEach(clearTimeout);
    };
  }, []);

  if (line < 0) return null;

  return (
    <div aria-hidden="true" className={`boot-ticker${leaving ? " boot-ticker--out" : ""}`}>
      <div className="boot-ticker-bar" />
      <div className="boot-ticker-line">
        <span className="boot-ticker-count">{String(Math.round(((line + 1) / LOG_LINES.length) * 100)).padStart(3, "0")}</span>
        {LOG_LINES[line]}
      </div>
    </div>
  );
}
