"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask, TextLayer } from "pdfjs-dist";
import { useT } from "@/lib/i18n";

/**
 * The in-site reader for the site's PDFs (the CV, the case-study
 * specifications), drawn by PDF.js in the house style.
 *
 * - Loaded only here, on demand: PDF.js and its worker never reach the
 *   other pages.
 * - Pages are drawn as they come near the screen, at the screen's pixel
 *   density (capped, so a zoomed page stays inside what a phone can hold).
 *   A zoom or a resize redraws the visible pages; until it is done, the old
 *   bitmap stays up, stretched, rather than a blank.
 * - Each page carries PDF.js's text layer: the text can be selected, copied
 *   and read by a screen reader, like the PDF itself.
 * - CSP-clean: the worker comes from the site's own origin, and PDF.js 6
 *   evaluates no code at all (the policy allows no eval).
 * - The way out is always there: the page around this offers the PDF itself
 *   to download or open, with or without JavaScript.
 */

const ZOOMS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3]; // × the width that fits
const FIT = 2; // ZOOMS[FIT] === 1
const FIT_MAX = 860; // css px: past this, a page is wider than anyone reads; zoom still goes on
const MAX_PIXELS = 4096 * 4096; // per canvas; past it, mobile browsers drop the bitmap

type Pdfjs = typeof import("pdfjs-dist");
type Loaded = { pdf: PDFDocumentProxy; pdfjs: Pdfjs; sizes: { w: number; h: number }[] };

// The "legacy" build: PDF.js 6's modern one calls Map.getOrInsertComputed,
// which only the newest browsers have (no Safari, no Chrome older than a few
// months); this one carries the polyfills, in the library and in the worker.
let pdfjsReady: Promise<Pdfjs> | null = null;
function loadPdfjs(): Promise<Pdfjs> {
  pdfjsReady ??= (import("pdfjs-dist/legacy/build/pdf.mjs") as Promise<Pdfjs>).then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerPort = new Worker(
      new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url),
      { type: "module" },
    );
    return pdfjs;
  });
  return pdfjsReady;
}

const noop = () => () => {};
const pad = (n: number) => String(n).padStart(2, "0");

export function DocumentViewer({ src, title }: { src: string; title: string }) {
  const { tr } = useT();
  // False on the server and during hydration, then true: the loading line
  // never shows on a page that has no JavaScript to finish it.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const canFullscreen = useSyncExternalStore(noop, () => !!document.fullscreenEnabled, () => false);

  const shellRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<Loaded | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [width, setWidth] = useState(0);
  const [zoom, setZoom] = useState(FIT);
  const [current, setCurrent] = useState(1);
  const [full, setFull] = useState(false);

  // Load the document (and PDF.js, the first time).
  useEffect(() => {
    let cancelled = false;
    let task: PDFDocumentLoadingTask | null = null;
    (async () => {
      const pdfjs = await loadPdfjs();
      if (cancelled) return;
      task = pdfjs.getDocument({ url: src, enableXfa: false });
      task.onProgress = ({ loaded, total }: { loaded: number; total: number }) => {
        if (total) setProgress(Math.min(1, loaded / total));
      };
      const pdf = await task.promise;
      const sizes: Loaded["sizes"] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const v = (await pdf.getPage(i)).getViewport({ scale: 1 });
        sizes.push({ w: v.width, h: v.height });
      }
      if (!cancelled) setDoc({ pdf, pdfjs, sizes });
    })().catch((err: unknown) => {
      if (cancelled) return;
      console.warn("[document]", err);
      setFailed(true);
    });
    return () => {
      cancelled = true;
      void task?.destroy();
    };
  }, [src]);

  // The width the pages fit, settled: a window being dragged wider does not
  // redraw every page on every frame.
  useEffect(() => {
    const el = pagesRef.current;
    if (!el) return;
    let timer = 0;
    const ro = new ResizeObserver(([entry]) => {
      window.clearTimeout(timer);
      const w = Math.floor(entry.contentRect.width);
      timer = window.setTimeout(() => setWidth(w), 120);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
    };
  }, [hydrated]);

  const widest = doc ? Math.max(...doc.sizes.map((s) => s.w)) : 0;
  const scale = doc && width ? (Math.min(width, FIT_MAX) / widest) * ZOOMS[zoom] : 0;

  // Draw the pages near the screen, at this scale.
  useEffect(() => {
    const root = pagesRef.current;
    if (!doc || !scale || !root) return;
    const els = [...root.querySelectorAll<HTMLElement>(".doc-page")];
    const drawing = new Map<number, RenderTask>();
    const texts = new Map<number, TextLayer>();
    const drawn = new Set<number>();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let alive = true;

    const draw = async (i: number) => {
      if (drawn.has(i) || drawing.has(i)) return;
      drawn.add(i);
      const el = els[i];
      const page = await doc.pdf.getPage(i + 1);
      if (!alive) return;
      const viewport = page.getViewport({ scale });
      const out = Math.min(dpr, Math.sqrt(MAX_PIXELS / (viewport.width * viewport.height)));
      // A fresh canvas, swapped in when complete: the previous bitmap stays
      // up meanwhile.
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width * out);
      canvas.height = Math.floor(viewport.height * out);
      const task = page.render({
        canvas,
        viewport,
        transform: out !== 1 ? [out, 0, 0, out, 0, 0] : undefined,
      });
      drawing.set(i, task);
      try {
        await task.promise;
      } catch {
        drawn.delete(i); // cancelled: draw again if it comes back
        return;
      } finally {
        drawing.delete(i);
      }
      if (!alive) return;
      el.querySelector(".doc-art")?.replaceChildren(canvas);
      const layer = el.querySelector<HTMLElement>(".textLayer");
      if (!layer) return;
      layer.replaceChildren();
      const text = new doc.pdfjs.TextLayer({
        textContentSource: page.streamTextContent(),
        container: layer,
        viewport,
      });
      texts.set(i, text);
      await text.render().catch(() => {});
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) void draw(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "120% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      alive = false;
      io.disconnect();
      drawing.forEach((t) => t.cancel());
      texts.forEach((t) => t.cancel());
    };
  }, [doc, scale]);

  // The page under the middle of the screen.
  useEffect(() => {
    const root = pagesRef.current;
    if (!doc || !root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCurrent(Number((e.target as HTMLElement).dataset.index) + 1);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    root.querySelectorAll(".doc-page").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [doc]);

  // + / − / 0, as in every reader. Never with a modifier: Ctrl + is the
  // browser's own zoom.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if ((e.target as HTMLElement | null)?.closest("input, textarea, [contenteditable]")) return;
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(ZOOMS.length - 1, z + 1));
      else if (e.key === "-") setZoom((z) => Math.max(0, z - 1));
      else if (e.key === "0") setZoom(FIT);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === shellRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void shellRef.current?.requestFullscreen();
  };

  const total = doc?.sizes.length ?? 0;
  const pct = Math.round(ZOOMS[zoom] * 100);

  return (
    <div
      ref={shellRef}
      className="doc-shell"
      role="region"
      aria-label={tr(`Document: ${title}`, `Document : ${title}`)}
      // The reader scrolls natively: smooth scroll would fight a full-screen
      // reader and the sideways scroll of a zoomed page.
      data-lenis-prevent=""
    >
      <div className="doc-toolbar" role="toolbar" aria-label={tr("Document controls", "Commandes du document")}>
        <span className="doc-count">{doc ? `P. ${pad(current)}/${pad(total)}` : "P. --/--"}</span>
        <div className="doc-group">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0, z - 1))}
            disabled={!doc || zoom === 0}
            aria-label={tr("Zoom out", "Dézoomer")}
          >
            [ − ]
          </button>
          {/* The level doubles as "back to the width that fits". */}
          <button
            type="button"
            className="doc-zoom"
            onClick={() => setZoom(FIT)}
            disabled={!doc || zoom === FIT}
            aria-label={tr(`${pct} %, fit the width`, `${pct} %, ajuster à la largeur`)}
          >
            {`${pct} %`}
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(ZOOMS.length - 1, z + 1))}
            disabled={!doc || zoom === ZOOMS.length - 1}
            aria-label={tr("Zoom in", "Zoomer")}
          >
            [ + ]
          </button>
          <button type="button" className="doc-wide" onClick={() => setZoom(FIT)} disabled={!doc || zoom === FIT}>
            {tr("[ fit ]", "[ ajuster ]")}
          </button>
        </div>
        <div className="doc-group">
          {canFullscreen && (
            <button type="button" className="doc-wide" onClick={toggleFullscreen} disabled={!doc}>
              {full ? tr("[ exit full screen ]", "[ quitter le plein écran ]") : tr("[ full screen ]", "[ plein écran ]")}
            </button>
          )}
          <a href={src} download>
            <span className="doc-wide">{tr("[ download ↓ ]", "[ télécharger ↓ ]")}</span>
            <span className="doc-narrow">{"[ pdf ↓ ]"}</span>
          </a>
        </div>
      </div>

      <div ref={pagesRef} className="doc-pages">
        {hydrated && !doc && !failed && (
          <div className="doc-status">
            <span>
              {tr("// loading the document", "// chargement du document")}
              {progress !== null ? ` · ${Math.round(progress * 100)} %` : ""}
            </span>
            <span className="doc-bar" style={{ transform: `scaleX(${progress ?? 0.04})` }} />
          </div>
        )}
        {failed && (
          <p className="doc-status" role="alert">
            {tr("// the document could not be displayed here. ", "// le document n'a pas pu s'afficher ici. ")}
            <a href={src}>{tr("open the PDF ↗", "ouvrir le PDF ↗")}</a>
          </p>
        )}
        {doc && scale > 0 && (
          <div className="doc-stack">
            {doc.sizes.map((s, i) => (
              <figure key={i} className="doc-sheet">
                <div
                  className="doc-page"
                  data-index={i}
                  style={{
                    width: Math.floor(s.w * scale),
                    height: Math.floor(s.h * scale),
                    "--total-scale-factor": scale,
                  } as React.CSSProperties}
                >
                  {/* Both filled by hand, never by React: the drawing and
                      PDF.js's text runs. */}
                  <div className="doc-art" aria-hidden="true" />
                  <div className="textLayer" />
                </div>
                <figcaption aria-hidden="true">{`// P. ${pad(i + 1)}`}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
