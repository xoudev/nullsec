"use client";

import { useEffect, useRef } from "react";
import { afterCurtain } from "@/lib/curtain";
import { useT } from "@/lib/i18n";

/**
 * The hero says "I map the blind spots"; this makes it literal.
 *
 * Under the headline sits a map that is invisible until scanned: a faint
 * grid and a handful of annotations, the kind of gaps a GRC review turns up
 * anywhere (generic examples, not findings from any real organisation). On a
 * desktop the pointer is the scanner: a CSS mask, centred on it, reveals
 * whatever lies under the beam. On a touch screen there is no pointer to
 * follow, so the map gets one radar sweep when the page opens (once per
 * session), then fades.
 *
 * Cost: none at rest. The pointer path writes two custom properties at most
 * once per animation frame, and only while the pointer moves over the hero;
 * the sweep is a single CSS animation. Under reduced motion nothing renders.
 * Everything here is decorative and aria-hidden.
 */

type Note = {
  asset: { en: string; fr: string };
  gap: { en: string; fr: string };
  // Desktop position: two staggered columns in the space right of the
  // headline. Column "a" starts where the headline's ink ends (measured, see
  // fitColumns); column "b" is set from the right edge, so a note can never
  // run off the screen or into the vertical hint. y is in % of the hero.
  col: "a" | "b";
  y: string;
  // Phone position (offset from the left or right edge). The vertical
  // position on a phone is measured at run time, see the sweep branch.
  // No phone position = desktop only.
  mx?: string;
  mside?: "left" | "right";
};

const NOTES: Note[] = [
  { asset: { en: "critical supplier", fr: "fournisseur critique" }, gap: { en: "never assessed", fr: "jamais évalué" }, col: "a", y: "31%", mx: "6%" },
  { asset: { en: "privileged account", fr: "compte à privilèges" }, gap: { en: "no owner", fr: "sans propriétaire" }, col: "b", y: "41%", mx: "6%", mside: "right" },
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

export function BlindSpotScan() {
  const { tr } = useT();
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const hero = layer?.parentElement;
    if (!layer || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      layer.dataset.mode = "off";
      return;
    }

    // Touch screens: one sweep per session, then the map fades.
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
      let swept = false;
      try {
        swept = sessionStorage.getItem(SWEEP_KEY) === "1";
        sessionStorage.setItem(SWEEP_KEY, "1");
      } catch { /* storage unavailable: sweep anyway, it is harmless */ }
      if (swept) {
        layer.dataset.mode = "off";
        return;
      }
      // Phones vary too much for fixed positions: on a 360 × 640 screen the
      // name sits right under the section label. Measure the free band once
      // and keep only the notes that fit in it (none on the shortest screens:
      // the sweep then reveals the grid alone).
      const hr = hero.getBoundingClientRect();
      const labelBottom = hero.querySelector("[data-hero-label]")?.getBoundingClientRect().bottom ?? hr.top + 48;
      const nameTop = hero.querySelector("h1")?.getBoundingClientRect().top ?? hr.top + 200;
      const bandTop = labelBottom - hr.top + 14;
      const room = nameTop - hr.top - 14 - bandTop;
      const ROW = 44; // two lines of 12 px mono and a gap
      layer.querySelectorAll<HTMLElement>('.blindspot-note:not([data-phone="off"])').forEach((n, i) => {
        if ((i + 1) * ROW <= room) n.style.setProperty("--my", `${bandTop + i * ROW}px`);
        else n.dataset.phone = "off";
      });
      fitColumns(layer, hero);
      // Two animations run (the sweep, then the fade): wait for the last.
      const done = (e: AnimationEvent) => {
        if (e.animationName === "blindspot-fade") layer.dataset.mode = "off";
      };
      layer.addEventListener("animationend", done);
      // Arriving through the page curtain, sweep once it has lifted.
      const cancel = afterCurtain(() => {
        layer.dataset.mode = "sweep";
      });
      return () => {
        cancel();
        layer.removeEventListener("animationend", done);
      };
    }

    // Pointer: the beam follows it, one write per frame at most.
    layer.dataset.mode = "beam";
    const refit = () => fitColumns(layer, hero);
    refit();
    void document.fonts?.ready.then(refit);
    let frame = 0;
    let x = 0;
    let y = 0;
    // The hero's position in the page, read once per entry rather than on
    // every move (a layout read per pointer event is a forced reflow).
    let originX = 0;
    let originY = 0;
    const measure = () => {
      const r = hero.getBoundingClientRect();
      originX = r.left + window.scrollX;
      originY = r.top + window.scrollY;
    };
    const onResize = () => { measure(); refit(); };
    const paint = () => {
      frame = 0;
      layer.style.setProperty("--beam-x", `${x}px`);
      layer.style.setProperty("--beam-y", `${y}px`);
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      measure();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x = e.pageX - originX;
      y = e.pageY - originY;
      if (!("active" in layer.dataset)) layer.dataset.active = "";
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onLeave = () => { delete layer.dataset.active; };
    measure();
    hero.addEventListener("pointerenter", onEnter);
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      hero.removeEventListener("pointerenter", onEnter);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
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
            data-phone={n.mx ? n.mside ?? "left" : "off"}
            data-col={n.col}
            style={{
              "--ny": n.y,
              "--mx": n.mx ?? "6%",
            } as React.CSSProperties}
          >
            <span className="blindspot-asset">{tr(n.asset.en, n.asset.fr)}</span>
            <span className="blindspot-gap">{tr(n.gap.en, n.gap.fr)}</span>
          </span>
        ))}
      </div>
      <span aria-hidden="true" className="blindspot-hint">
        {tr("// move the cursor to scan", "// déplacez le curseur pour scanner")}
      </span>
    </>
  );
}
