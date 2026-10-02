"use client";

import { useEffect, useRef } from "react";
import { afterCurtain } from "@/lib/curtain";
import { useT } from "@/lib/i18n";

/**
 * The hero says "I map the blind spots"; this makes it literal.
 *
 * Under the headline sits a map that is invisible until scanned: a faint
 * grid and a handful of annotations, the kind of gaps a GRC review turns up
 * anywhere (generic examples, not findings from any real organisation).
 *
 * The scanner is whatever the visitor actually has. With a mouse, the pointer
 * is the scanner: a CSS mask, centred on it, reveals what lies under the
 * beam. With a finger, each tap sends a ping: a disc of map grows from where
 * the finger landed, holds, then fades (and one radar sweep plays by itself
 * when the page opens, once per session). The hint under it says which.
 *
 * Which one is decided by the device and then by what it does, never by
 * media queries alone: some phones report a fine, hovering pointer (a stylus
 * digitiser, for one), and used to get the cursor hint and a beam that no
 * finger can move, so their visitors saw an invitation and no map. A touch
 * screen starts in touch mode; the first mouse that moves over the hero
 * switches it to the beam, the next tap switches it back.
 *
 * Cost: none at rest. The pointer path writes two custom properties at most
 * once per animation frame, and only while the pointer moves over the hero;
 * a sweep or a ping is a single CSS animation. Under reduced motion nothing
 * renders. Everything here is decorative and aria-hidden.
 */

type Note = {
  asset: { en: string; fr: string };
  gap: { en: string; fr: string };
  // Desktop position: two staggered columns in the space right of the
  // headline. Column "a" starts where the headline's ink ends (measured, see
  // fitColumns); column "b" is set from the right edge, so a note can never
  // run off the screen or into the vertical hint. y is in % of the hero.
  // On a phone, positions are fitted at run time instead (placePhoneNotes).
  col: "a" | "b";
  y: string;
};

const NOTES: Note[] = [
  { asset: { en: "critical supplier", fr: "fournisseur critique" }, gap: { en: "never assessed", fr: "jamais évalué" }, col: "a", y: "31%" },
  { asset: { en: "privileged account", fr: "compte à privilèges" }, gap: { en: "no owner", fr: "sans propriétaire" }, col: "b", y: "41%" },
  { asset: { en: "accepted risk", fr: "risque accepté" }, gap: { en: "never signed", fr: "jamais signé" }, col: "a", y: "52%" },
  { asset: { en: "backup", fr: "sauvegarde" }, gap: { en: "never restored", fr: "jamais restaurée" }, col: "b", y: "62%" },
  { asset: { en: "MFA exception", fr: "exception MFA" }, gap: { en: "now permanent", fr: "devenue permanente" }, col: "a", y: "72%" },
  { asset: { en: "application", fr: "application" }, gap: { en: "not in the register", fr: "hors registre" }, col: "b", y: "82%" },
];

const SWEEP_KEY = "nullsec_swept";
const GAP = 28; // clearance between the headline's ink and a note, px

/** Right edge of the hero's title text, in px from the hero's left. Text
 *  boxes, not element boxes: the headline lines are full-width blocks. */
function inkRight(hero: HTMLElement): number {
  const left = hero.getBoundingClientRect().left;
  let right = 0;
  for (const root of hero.querySelectorAll("h1, h1 + p")) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (!walker.currentNode.textContent?.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(walker.currentNode);
      for (const r of range.getClientRects()) right = Math.max(right, r.right - left);
    }
  }
  return right;
}

/**
 * Places the two desktop columns after the headline, and hides a column
 * that has no room (a French headline on a portrait tablet leaves none: the
 * scan then reveals the grid alone). Layout is read here, once at start, once
 * the fonts are in, and on resize: never per frame.
 */
function fitColumns(layer: HTMLElement, hero: HTMLElement) {
  if (window.innerWidth < 768) return;
  const width = hero.getBoundingClientRect().width;
  const ink = inkRight(hero) + GAP;
  const notes = (col: "a" | "b") =>
    [...layer.querySelectorAll<HTMLElement>(`.blindspot-note[data-col="${col}"]`)];
  const widest = (els: HTMLElement[]) => Math.max(0, ...els.map((n) => n.offsetWidth));
  const colA = Math.max(width * 0.64, ink);
  layer.style.setProperty("--col-a", `${colA}px`);
  layer.toggleAttribute("data-no-a", colA + widest(notes("a")) > width * 0.93);
  layer.toggleAttribute("data-no-b", width * 0.91 - widest(notes("b")) < ink);
}

const CLEAR_X = 14; // px between a phone note and the ink beside it
const CLEAR_Y = 10; // and above or below it
const CLEAR_UI = 12; // around the label, the hint and the fixed controls
const SPACING = 12; // px between two notes
const EDGE = 0.06; // phone notes keep to the hero's side margins (6%)
const OFF_SIDE = 48; // px a note would rather move than change sides

type Box = { l: number; t: number; r: number; b: number };
const overlaps = (a: Box, b: Box) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;

/**
 * What a phone note must stay clear of, in px from the hero's top-left and
 * with the clearance added: the name and the display line line by line
 * (text boxes, so the room right of a short line counts as free), the rule,
 * the footer row whole (a note among the buttons would read as one), and,
 * with more room, the label, the scan hint under it and the fixed controls.
 */
function inkBoxes(hero: HTMLElement, hr: DOMRect): Box[] {
  const boxes: Box[] = [];
  const add = (r: DOMRect, cx: number, cy: number) => {
    if (r.width <= 0 || r.height <= 0) return;
    boxes.push({ l: r.left - hr.left - cx, t: r.top - hr.top - cy, r: r.right - hr.left + cx, b: r.bottom - hr.top + cy });
  };
  const text = (root: Element, cx: number, cy: number) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.textContent?.trim() || node.parentElement?.closest(".sr-only")) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) add(r, cx, cy);
    }
  };
  for (const el of hero.querySelectorAll("h1, h1 + p")) text(el, CLEAR_X, CLEAR_Y);
  for (const el of hero.querySelectorAll("[data-hero-foot], .hero-rule")) add(el.getBoundingClientRect(), CLEAR_X, CLEAR_Y);
  for (const el of hero.querySelectorAll("[data-hero-label], .blindspot-hint")) text(el, CLEAR_UI, CLEAR_UI);
  for (const el of document.querySelectorAll(".audio-control, .language-toggle")) add(el.getBoundingClientRect(), CLEAR_UI, CLEAR_UI);
  return boxes;
}

/**
 * Phones vary too much for fixed positions, and their free space is in
 * pieces: the room right of the display line's shorter lines (and of the
 * name), a band above the footer row, a strip above the name. So each note
 * is fitted where it lands clear of everything (inkBoxes, and the notes
 * already placed), flush with one side margin, as near as it can to its
 * share of the height, sides alternating: the staggered desktop columns,
 * folded around the headline.
 *
 * Around the headline first, from the name down: the strip above the name
 * only takes the notes left over (a note up there reads as the label's, far
 * from the map). Only the hero's part on screen counts (a scan shows what the
 * visitor is looking at); a note with no room at all stays hidden.
 *
 * The notes are measured, so this runs while the map is shown: play() calls
 * it as each scan starts, and the hero's ResizeObserver mid-scan.
 */
function placePhoneNotes(layer: HTMLElement, hero: HTMLElement) {
  if (window.innerWidth >= 768 || layer.dataset.mode === "off") return;
  const notes = [...layer.querySelectorAll<HTMLElement>(".blindspot-note")];
  for (const n of notes) n.dataset.phone = "left"; // shown, to be measured
  const hr = hero.getBoundingClientRect();
  const taken = inkBoxes(hero, hr);
  const edge = hr.width * EDGE;
  const top = Math.max(0, -hr.top);
  const bottom = Math.min(hr.height, window.innerHeight - hr.top);
  const nameTop = (hero.querySelector("h1")?.getBoundingClientRect().top ?? hr.top) - hr.top - CLEAR_Y;
  const unplaced = new Set(notes);

  const fit = (n: HTMLElement, i: number, from: number) => {
    const w = n.offsetWidth;
    const h = n.offsetHeight;
    const target = from + ((i + 0.5) * (bottom - from)) / notes.length;
    const prefer = i % 2 ? "left" : "right";
    let best: { x: number; y: number; side: "left" | "right"; cost: number } | null = null;
    // The nearest free spot to the target is the target itself or flush
    // with an edge of something taken: those are the only heights to try.
    const ys = [from, target - h / 2];
    for (const o of taken) ys.push(o.b, o.t - h);
    for (const side of ["left", "right"] as const) {
      const x = side === "left" ? edge : hr.width - edge - w;
      for (const y of ys) {
        if (y < from || y + h > bottom) continue;
        const box = { l: x, t: y, r: x + w, b: y + h };
        if (taken.some((o) => overlaps(box, o))) continue;
        const cost = Math.abs(y + h / 2 - target) + (side === prefer ? 0 : OFF_SIDE);
        if (!best || cost < best.cost) best = { x, y, side, cost };
      }
    }
    if (!best) return;
    taken.push({ l: best.x - SPACING, t: best.y - SPACING, r: best.x + w + SPACING, b: best.y + h + SPACING });
    n.style.setProperty("--my", `${best.y}px`);
    n.dataset.phone = best.side;
    unplaced.delete(n);
  };

  notes.forEach((n, i) => fit(n, i, Math.max(top, nameTop)));
  notes.forEach((n, i) => unplaced.has(n) && fit(n, i, top));
  for (const n of unplaced) n.dataset.phone = "off";
}

export function BlindSpotScan() {
  const { tr } = useT();
  const layerRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const hint = hintRef.current;
    const ring = ringRef.current;
    const hero = layer?.parentElement;
    if (!layer || !hint || !ring || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      layer.dataset.mode = "off";
      return;
    }

    const layout = () => {
      fitColumns(layer, hero);
      placePhoneNotes(layer, hero);
    };

    // The beam: one write per frame at most. The hero's position in the
    // page is read once per entry rather than on every move (a layout read
    // per pointer event is a forced reflow).
    let frame = 0;
    let x = 0;
    let y = 0;
    let originX = 0;
    let originY = 0;
    const measure = () => {
      const r = hero.getBoundingClientRect();
      originX = r.left + window.scrollX;
      originY = r.top + window.scrollY;
    };
    const paint = () => {
      frame = 0;
      layer.style.setProperty("--beam-x", `${x}px`);
      layer.style.setProperty("--beam-y", `${y}px`);
    };
    const toBeam = () => {
      hint.dataset.input = "mouse";
      layer.dataset.mode = "beam";
      measure();
      fitColumns(layer, hero);
    };

    // A sweep or a ping: a CSS animation, restarted from its first frame.
    // The notes are laid out once the map is shown, in the same frame.
    const play = (mode: "sweep" | "ping") => {
      layer.dataset.mode = "off";
      void layer.offsetWidth;
      layer.dataset.mode = mode;
      layout();
    };
    const ping = (clientX: number, clientY: number) => {
      const r = hero.getBoundingClientRect();
      const px = `${clientX - r.left}px`;
      const py = `${clientY - r.top}px`;
      layer.style.setProperty("--px", px);
      layer.style.setProperty("--py", py);
      ring.style.left = px;
      ring.style.top = py;
      delete ring.dataset.on;
      void ring.offsetWidth;
      ring.dataset.on = "";
      play("ping");
    };

    let lastPointer = "";
    const onDown = (e: PointerEvent) => {
      lastPointer = e.pointerType;
    };
    const onClick = (e: MouseEvent) => {
      if (lastPointer !== "touch" && lastPointer !== "pen") return;
      // A tap on the hero's links and buttons does what it says, nothing more.
      if ((e.target as Element | null)?.closest("a, button, input, label, [role='button']")) return;
      hint.dataset.input = "touch";
      ping(e.clientX, e.clientY);
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") measure();
    };
    const onMove = (e: PointerEvent) => {
      // A finger, or a stylus touching the glass, is not a cursor; a stylus
      // hovering above it is.
      if (e.pointerType === "touch" || (e.pointerType === "pen" && e.buttons)) return;
      if (layer.dataset.mode !== "beam") toBeam();
      x = e.pageX - originX;
      y = e.pageY - originY;
      if (!("active" in layer.dataset)) layer.dataset.active = "";
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      delete layer.dataset.active;
    };
    // A sweep or a ping ends on its fade; then the map is put away.
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName === "blindspot-fade") layer.dataset.mode = "off";
    };
    // The hero's size, not the window's: it also changes when the fonts
    // arrive or the text wraps anew, and a phone's address bar folding away
    // resizes the window without touching the hero (100svh).
    let sizeFrame = 0;
    const resized = new ResizeObserver(() => {
      cancelAnimationFrame(sizeFrame);
      sizeFrame = requestAnimationFrame(() => {
        measure();
        layout();
      });
    });

    // Where to start: a touch screen in touch mode, anything else on the beam.
    let cancelSweep = () => {};
    const touchFirst =
      navigator.maxTouchPoints > 0 || window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (touchFirst) {
      hint.dataset.input = "touch";
      layout();
      void document.fonts?.ready.then(layout);
      let swept = false;
      try {
        swept = sessionStorage.getItem(SWEEP_KEY) === "1";
        sessionStorage.setItem(SWEEP_KEY, "1");
      } catch { /* storage unavailable: sweep anyway, it is harmless */ }
      // The opening sweep, once per session; arriving through the page
      // curtain, once it has lifted.
      if (!swept) cancelSweep = afterCurtain(() => play("sweep"));
    } else {
      toBeam();
      void document.fonts?.ready.then(layout);
    }

    hero.addEventListener("pointerdown", onDown, { passive: true });
    hero.addEventListener("click", onClick);
    hero.addEventListener("pointerenter", onEnter);
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    layer.addEventListener("animationend", onEnd);
    resized.observe(hero);
    return () => {
      cancelSweep();
      hero.removeEventListener("pointerdown", onDown);
      hero.removeEventListener("click", onClick);
      hero.removeEventListener("pointerenter", onEnter);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      layer.removeEventListener("animationend", onEnd);
      resized.disconnect();
      cancelAnimationFrame(sizeFrame);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={layerRef} aria-hidden="true" className="blindspot-layer" data-mode="off">
        <span className="blindspot-legend">{tr("// common blind spots", "// angles morts courants")}</span>
        {NOTES.map((n) => (
          <span
            key={n.asset.en}
            className="blindspot-note"
            data-phone="off"
            data-col={n.col}
            style={{ "--ny": n.y } as React.CSSProperties}
          >
            <span className="blindspot-asset">{tr(n.asset.en, n.asset.fr)}</span>
            <span className="blindspot-gap">{tr(n.gap.en, n.gap.fr)}</span>
          </span>
        ))}
      </div>
      {/* Where a finger landed: a survey mark that opens out, like the
          cursor's reticle. */}
      <span ref={ringRef} aria-hidden="true" className="blindspot-ring" />
      {/* Both hints ship; data-input (set once the scanner is known) shows
          the one that matches it. */}
      <span ref={hintRef} aria-hidden="true" className="blindspot-hint">
        <span className="blindspot-hint-mouse">{tr("// move the cursor to scan", "// déplacez le curseur pour scanner")}</span>
        <span className="blindspot-hint-touch">{tr("// tap to scan", "// touchez pour scanner")}</span>
      </span>
    </>
  );
}
