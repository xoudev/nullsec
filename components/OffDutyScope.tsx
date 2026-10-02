"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playClick } from "@/lib/audio";

/**
 * "Same focus, different targets", taken at its word: the interests are a
 * list of targets, and a scope acquires the one picked.
 *
 * Picking one (pointer, tap, keys) plays the acquisition: the image comes in
 * at a few dozen pixels, a scan line sweeps it sharp, the reticle travels to
 * its subject and closes on it, and the telemetry decodes to LOCKED. The
 * first target is acquired by itself the first time the scope comes into
 * view. The images are set in two of the four colours, void to blood, like
 * a thermal optic: the section stays inside the palette with no grey filter.
 *
 * Cost: nothing at rest. An acquisition is a CSS animation and two short
 * text effects; the sharp image of a target loads when it is first picked
 * (the scan waits for it, under the pixels), the pixel versions are a few
 * hundred bytes each. Under reduced motion a pick simply shows the target.
 *
 * A tab list: arrows, Home and End move the pick, which follows the focus;
 * the panel holds the subtitle and the tags as text, the scope itself is
 * decoration. Without JavaScript, the first target shows, locked.
 */

export type ScopeTarget = {
  title: string;
  subtitle: string;
  tags: string[];
  /** What the reticle closes on, named beside it once locked. */
  subject: string;
  image: string;
  /** The subject's place in the image, in % of its width and height. */
  focus: { x: number; y: number };
};

export type ScopeLabels = {
  list: string;
  standby: string;
  acquiring: string;
  scanning: string;
  locked: string;
  subject: string;
};

type Phase = "standby" | "acquire" | "scan" | "locked";

const GLYPHS = "#%&*+-/<=>?@[]_{}|~0123456789";
const HOVER_DWELL = 90; // ms a pointer rests on a target before it is picked
const TRAVEL = 600; // ms, the reticle's move (globals.css: .ods-lock, .ods-cross)
const PIXELS_FOR = 380; // ms the pixels hold before the scan, the sharp image cached or not

const pad = (n: number) => String(n).padStart(2, "0");
const coords = (x: number, y: number) => `X ${String(Math.round(x)).padStart(3, "0")} · Y ${String(Math.round(y)).padStart(3, "0")}`;

/** The status line resolving letter by letter, the way the curtain's title does. */
function decode(el: HTMLElement, text: string, ms = 420): () => void {
  const start = performance.now();
  let frame = 0;
  const step = (now: number) => {
    const done = Math.min(1, (now - start) / ms);
    const fixed = Math.floor(done * text.length);
    let out = text.slice(0, fixed);
    for (let i = fixed; i < text.length; i++) {
      out += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }
    el.textContent = out;
    if (done < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
  return () => {
    cancelAnimationFrame(frame);
    el.textContent = text;
  };
}

export function OffDutyScope({ targets, labels }: { targets: ScopeTarget[]; labels: ScopeLabels }) {
  const uid = useId();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const hoverTimer = useRef(0);
  const scanTimer = useRef(0);
  const acquiredAt = useRef(0);
  // Server and first paint: the first target, locked (what a page without
  // JavaScript keeps). The scope stands by once it is known to be out of view.
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>("locked");
  // The same two, for the handlers, which run between renders.
  const activeRef = useRef(0);
  const phaseRef = useRef<Phase>("locked");
  // Whether the pick came from a click or a key: the lock then ticks.
  const deliberate = useRef(false);
  const target = targets[active];
  const standby = phase === "standby";
  const fx = standby ? 50 : target.focus.x;
  const fy = standby ? 50 : target.focus.y;

  const go = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const select = useCallback(
    (i: number, how: "pointer" | "deliberate" | "auto") => {
      if (i === activeRef.current && phaseRef.current !== "standby") return;
      deliberate.current = how === "deliberate";
      activeRef.current = i;
      acquiredAt.current = performance.now();
      window.clearTimeout(scanTimer.current);
      setActive(i);
      go(reduced ? "locked" : "acquire");
    },
    [reduced, go],
  );

  // The first sight of the scope acquires the target in it; until then it
  // stands by. Out of view at hydration (the usual case, this far down the
  // page), the switch to standby is never seen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.35) {
          if (phaseRef.current === "standby") select(activeRef.current, "auto");
          io.disconnect();
        } else if (phaseRef.current === "locked" && !e.isIntersecting) {
          go("standby");
        }
      },
      { threshold: [0, 0.35] },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [reduced, select, go]);

  // The telemetry is written here, not rendered: the coordinates count to the
  // new subject while the reticle travels, and the status decodes once it
  // locks. Both are decoration (the view is aria-hidden).
  const shown = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const el = coordRef.current;
    if (!el) return;
    const to = { x: fx, y: fy };
    const from = shown.current ?? to;
    if (reduced || (from.x === to.x && from.y === to.y)) {
      shown.current = to;
      el.textContent = coords(to.x, to.y);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / TRAVEL);
      const k = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // in-out, as the CSS
      shown.current = { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k };
      el.textContent = coords(shown.current.x, shown.current.y);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [fx, fy, reduced]);

  const status =
    phase === "standby" ? labels.standby : phase === "acquire" ? labels.acquiring : phase === "scan" ? labels.scanning : labels.locked;
  useEffect(() => {
    const el = statusRef.current;
    if (!el) return;
    if (phase === "locked" && deliberate.current) {
      deliberate.current = false;
      playClick("/click.mp3", 2.2);
    }
    if (phase !== "locked" || reduced) {
      el.textContent = status;
      return;
    }
    return decode(el, status);
  }, [phase, status, reduced]);

  useEffect(
    () => () => {
      window.clearTimeout(hoverTimer.current);
      window.clearTimeout(scanTimer.current);
    },
    [],
  );

  // The sharp image is in: the scan starts once the pixels have held a beat.
  const onSharp = () => {
    if (phaseRef.current !== "acquire") return;
    const wait = Math.max(0, PIXELS_FOR - (performance.now() - acquiredAt.current));
    window.clearTimeout(scanTimer.current);
    scanTimer.current = window.setTimeout(() => {
      if (phaseRef.current === "acquire") go("scan");
    }, wait);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const n = targets.length;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (active + 1) % n
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (active - 1 + n) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    select(next, "deliberate");
    tabsRef.current[next]?.focus();
  };

  return (
    <div ref={rootRef} className="ods">
      <div className="ods-list" role="tablist" aria-orientation="vertical" aria-label={labels.list} onKeyDown={onKey}>
        {targets.map((t, i) => (
          <button
            key={t.image}
            ref={(el) => {
              tabsRef.current[i] = el;
            }}
            id={`${uid}-tab-${i}`}
            type="button"
            role="tab"
            className="ods-tab"
            aria-selected={i === active}
            aria-controls={`${uid}-panel`}
            tabIndex={i === active ? 0 : -1}
            data-cursor="target"
            onClick={() => select(i, "deliberate")}
            onPointerEnter={(e) => {
              if (e.pointerType !== "mouse") return;
              window.clearTimeout(hoverTimer.current);
              hoverTimer.current = window.setTimeout(() => select(i, "pointer"), HOVER_DWELL);
            }}
            onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
          >
            <span className="ods-num" aria-hidden="true">
              {pad(i + 1)}
            </span>
            <span className="ods-title">{t.title}</span>
            <span className="ods-mark" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="ods-scope" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${active}`}>
        <div
          className="ods-view"
          data-phase={phase}
          aria-hidden="true"
          style={{ "--fx": fx, "--fy": fy } as React.CSSProperties}
        >
          {/* Every target at a few dozen pixels, the active one shown: the
              acquisition starts from them, at once. */}
          {targets.map((t, i) => (
            <div key={t.image} className="ods-img ods-low" data-on={i === active ? "" : undefined}>
              <Image
                src={t.image}
                alt=""
                fill
                sizes="40px"
                quality={40}
                style={{ objectFit: "cover", objectPosition: `${t.focus.x}% ${t.focus.y}%` }}
              />
            </div>
          ))}
          {!standby && (
            <div
              key={active}
              className="ods-img ods-high"
              onAnimationEnd={(e) => {
                if (e.animationName === "ods-scan") go("locked");
              }}
            >
              <Image
                src={target.image}
                alt=""
                fill
                sizes="(min-width: 900px) 60vw, 100vw"
                quality={60}
                // Mounted only once picked, and wholly clipped until the scan:
                // lazy loading would wait for it to be "visible", forever.
                loading="eager"
                // The scan waits for the sharp image, under the pixels; one
                // that will not load is shown as far as it got.
                onLoad={onSharp}
                onError={() => go("locked")}
                style={{ objectFit: "cover", objectPosition: `${target.focus.x}% ${target.focus.y}%` }}
              />
            </div>
          )}
          <span className="ods-lines" />
          <span className="ods-scanline" />
          <span className="ods-cross ods-cross-x" />
          <span className="ods-cross ods-cross-y" />
          <span className="ods-lock" data-flip={target.focus.x > 60 ? "" : undefined}>
            <i />
            <i />
            <i />
            <i />
            <b className="ods-subject">{`${labels.subject} · ${target.subject}`}</b>
          </span>
          <span className="ods-hud ods-tl">{`TGT ${pad(active + 1)} / ${pad(targets.length)}`}</span>
          <span className="ods-hud ods-tr">{target.title}</span>
          <span className="ods-hud ods-bl" ref={statusRef} />
          <span className="ods-hud ods-br" ref={coordRef} />
        </div>
        <p className="ods-subtitle">{target.subtitle}</p>
        <p className="ods-tags">{target.tags.join("  ·  ")}</p>
      </div>
    </div>
  );
}
