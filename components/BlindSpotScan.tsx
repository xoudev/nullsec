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
  // On a phone, rows are measured at run time instead (placePhoneNotes).
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

const ROW = 44; // a phone note: two lines of 12 px mono and a gap

/**
 * Phones vary too much for fixed positions: on a 360 × 640 screen the name
 * sits right under the section label. The free space is measured instead,
 * above the name and between the display line and the footer row, and the
 * notes take its rows in turn, alternating sides; a note with no row left
 * stays hidden (none at all on the shortest screens: a scan then reveals the
 * grid alone).
 */
function placePhoneNotes(layer: HTMLElement, hero: HTMLElement) {
  if (window.innerWidth >= 768) return;
  const hr = hero.getBoundingClientRect();
  const box = (sel: string) => hero.querySelector(sel)?.getBoundingClientRect();
  const labelBottom = box("[data-hero-label]")?.bottom ?? hr.top + 48;
  const nameTop = box("h1")?.top ?? hr.top + 200;
  const lineBottom = box("h1 + p")?.bottom ?? nameTop;
  const footTop = box("[data-hero-foot]")?.top ?? hr.bottom;
  const rows: number[] = [];
  for (const [from, to] of [
    [labelBottom + 14, nameTop - 14],
    [lineBottom + 18, footTop - 14],
  ]) {
    for (let y = from; y + ROW - 8 <= to; y += ROW) rows.push(y - hr.top);
  }
  layer.querySelectorAll<HTMLElement>(".blindspot-note").forEach((n, i) => {
    if (i < rows.length) {
      n.style.setProperty("--my", `${rows[i]}px`);
      n.dataset.phone = i % 2 ? "right" : "left";
    } else {
      n.dataset.phone = "off";
    }
  });
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
    const play = (mode: "sweep" | "ping") => {
      layer.dataset.mode = "off";
      void layer.offsetWidth;
      placePhoneNotes(layer, hero);
      layer.dataset.mode = mode;
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
    const onResize = () => {
      measure();
      layout();
    };

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
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelSweep();
      hero.removeEventListener("pointerdown", onDown);
      hero.removeEventListener("click", onClick);
      hero.removeEventListener("pointerenter", onEnter);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      layer.removeEventListener("animationend", onEnd);
      window.removeEventListener("resize", onResize);
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
