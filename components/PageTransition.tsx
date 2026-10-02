"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "@/hooks/useLenis";
import { playClick } from "@/lib/audio";
import { CURTAIN_LIFTED, type CurtainLabel, type CurtainLabels } from "@/lib/curtain";

/**
 * The page transition: a full-screen curtain between two pages.
 *
 * A click on a link to another page of the site is held back. Strips rise
 * across the screen in a wave that starts under the pointer, orange first,
 * bone over it, and carry the destination's poster: its section line, its
 * title in very large type, decoding from noise, and the request itself,
 * GET /fr/work/toron, then 200 · 14 ms once the page is there. The figure is
 * measured: the time from router.push to the new route being on screen.
 * It is often a few milliseconds, because Next fetched the page as soon as
 * its link scrolled into view. Then the strips leave through the top, wave
 * first, and take the title with them, sliced.
 *
 * Only for pages the server listed (lib/curtain-labels.ts) and plain clicks:
 * a modified click, a new tab, a download, the CV, the feed, an anchor on the
 * same page, the back button, all navigate exactly as before. So does
 * everything under prefers-reduced-motion. While the curtain is up,
 * data-curtain="on" sits on <html>: template.tsx skips its fade, and one-shot
 * intros wait for it to lift (lib/curtain.ts, afterCurtain).
 */

type Col = { left: number; width: number };
type Run = {
  href: string;
  path: string;
  label: CurtainLabel;
  width: number;
  cols: Col[];
  origin: number;
};

const SLIDE = 400; // one strip crossing the screen, ms
const LAYER_GAP = 60; // bone behind blood on the way in, blood behind bone on the way out
const SPREAD = 130; // the wave, from the clicked column to the farthest one
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const DECODE_AT = 240; // the title starts settling while the strips land
const HOLD = 150; // the title, fully set, before the curtain lifts
const GIVE_UP = 8000; // no new page by then: lift the curtain anyway
const NOISE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+/<=>?@[]{}";

function columnsFor(width: number): Col[] {
  const n = width < 640 ? 4 : width < 1100 ? 6 : 8;
  return Array.from({ length: n }, (_, i) => {
    const left = Math.round((i * width) / n);
    const right = Math.round(((i + 1) * width) / n);
    // One pixel of overlap, so no seam opens between two strips in motion.
    return { left, width: right - left + (i < n - 1 ? 1 : 0) };
  });
}

function sizeOf(title: string): "xl" | "l" | "m" {
  return title.length <= 8 ? "xl" : title.length <= 18 ? "l" : "m";
}

/** Words of characters, each numbered: the decoder addresses them by number. */
function splitTitle(title: string) {
  let k = 0;
  return title.split(" ").map((word) => Array.from(word, (ch) => ({ ch, k: k++ })));
}

/**
 * Noise that settles into the title, left to right and a little out of order:
 * a decoder, not a typewriter. Every copy of a character (one per strip)
 * shows the same glyph, so the slices of the title line up while it decodes.
 */
function scramble(root: HTMLElement, at: number, span: number) {
  const groups: HTMLElement[][] = [];
  root.querySelectorAll<HTMLElement>("[data-ch]").forEach((el) => {
    (groups[Number(el.dataset.ch)] ??= []).push(el);
  });
  const n = groups.length;
  const settle = groups.map(
    (_, k) => at + (n > 1 ? (k / (n - 1)) * span * 0.75 : 0) + Math.random() * span * 0.25,
  );
  const settled = groups.map(() => false);
  const t0 = performance.now();
  let frame = 0;
  let last = -Infinity;
  let finish = () => {};
  const done = new Promise<void>((resolve) => {
    finish = resolve;
  });
  const tick = (now: number) => {
    const flick = now - last >= 55;
    if (flick) last = now;
    let left = 0;
    for (let k = 0; k < n; k++) {
      if (settled[k]) continue;
      if (now - t0 >= settle[k]) {
        settled[k] = true;
        for (const el of groups[k]) el.dataset.set = "";
        continue;
      }
      left++;
      if (flick) {
        const glyph = NOISE[Math.floor(Math.random() * NOISE.length)];
        for (const el of groups[k]) {
          if (el.lastElementChild) el.lastElementChild.textContent = glyph;
        }
      }
    }
    if (left) frame = requestAnimationFrame(tick);
    else finish();
  };
  if (n) frame = requestAnimationFrame(tick);
  else finish();
  return { done, stop: () => cancelAnimationFrame(frame) };
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

export function PageTransition({ labels }: { labels: CurtainLabels }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const [run, setRun] = useState<Run | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const lenisRef = useRef(lenis);
  // Called with each new pathname while a navigation is in flight.
  const onPath = useRef<((path: string | null) => void) | null>(null);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    onPath.current?.(pathname);
  }, [pathname]);

  // Capture phase on window: this runs before React dispatches the click to
  // the <Link>, which leaves a click whose default was prevented alone.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      if (busy.current) {
        // A second link (Enter on a focused one) while the curtain runs.
        e.preventDefault();
        return;
      }
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      const path = url.pathname.replace(/\/+$/, "") || "/";
      const label = labels[path];
      if (!label) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (typeof a.animate !== "function") return;

      e.preventDefault();
      busy.current = true;
      const width = document.documentElement.clientWidth;
      const cols = columnsFor(width);
      // A keyboard "click" has no position: start from the link itself.
      let x = e.clientX;
      if (e.detail === 0) {
        const r = a.getBoundingClientRect();
        x = r.left + r.width / 2;
      }
      const origin = Math.min(cols.length - 1, Math.max(0, Math.floor((x / width) * cols.length)));
      const href = url.pathname + url.search + url.hash;
      router.prefetch(url.pathname + url.search);
      setRun({ href, path, label, width, cols, origin });
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [labels, router]);

  useEffect(() => {
    if (!run) return;
    const root = rootRef.current;
    if (!root) {
      busy.current = false;
      return;
    }
    busy.current = true;
    const html = document.documentElement;
    html.dataset.curtain = "on";
    lenisRef.current?.stop();

    let alive = true;
    let aborted = false;
    let pushed = false;
    const anims: Animation[] = [];
    const blood = Array.from(root.querySelectorAll<HTMLElement>("[data-pt-blood]"));
    const bone = Array.from(root.querySelectorAll<HTMLElement>("[data-pt-bone]"));
    const far = Math.max(run.origin, run.cols.length - 1 - run.origin, 1);
    const lag = (i: number) => (Math.abs(i - run.origin) / far) * SPREAD;
    const slide = (el: HTMLElement, i: number, from: string, to: string, extra: number) => {
      const anim = el.animate(
        [{ transform: `translate3d(0, ${from}, 0)` }, { transform: `translate3d(0, ${to}, 0)` }],
        { duration: SLIDE, delay: lag(i) + extra, easing: EASE, fill: "both" },
      );
      anims.push(anim);
      // Cancelled by the cleanup before anyone awaits it: not an error.
      anim.finished.catch(() => {});
      return anim.finished;
    };
    const setStatus = (text: string) => {
      root.querySelectorAll("[data-pt-status]").forEach((el) => {
        el.textContent = text;
      });
    };

    // Back or forward mid-curtain: do not push over it, just lift.
    const onPop = () => {
      aborted = true;
      onPath.current?.(null);
    };
    // Restored from the back/forward cache with the curtain still drawn.
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setRun(null);
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("pageshow", onShow);

    const chars = run.label.title.replace(/\s/g, "").length;
    const decoder = scramble(root, DECODE_AT, Math.min(600, 240 + chars * 10));

    (async () => {
      try {
        const covered = Promise.all(blood.map((el, i) => slide(el, i, "100%", "0%", 0)));
        const sheeted = Promise.all(bone.map((el, i) => slide(el, i, "100%", "0%", LAYER_GAP)));
        await covered;
        if (!alive) return;

        if (!aborted) {
          const landed = new Promise<boolean>((resolve) => {
            const timer = setTimeout(() => resolve(false), GIVE_UP);
            onPath.current = (p) => {
              clearTimeout(timer);
              onPath.current = null;
              resolve(p === run.path);
            };
          });
          const t0 = performance.now();
          router.push(run.href);
          pushed = true;
          const ok = await landed;
          if (!alive) return;
          if (ok) {
            setStatus(`200 · ${Math.max(1, Math.round(performance.now() - t0))}\u00A0ms`);
            playClick("/click.mp3", 1.6);
          }
        }

        await Promise.all([sheeted, decoder.done]);
        await wait(HOLD);
        await nextFrame();
        await nextFrame();
        if (!alive) return;
        await Promise.all([
          ...bone.map((el, i) => slide(el, i, "0%", "-100%", 0)),
          ...blood.map((el, i) => slide(el, i, "0%", "-100%", LAYER_GAP)),
        ]);
      } catch {
        // An animation was cancelled (the cleanup takes it from here), or the
        // router failed before navigating: then go the plain way, so the
        // click still leads where it said.
        if (alive && !pushed && !aborted) window.location.assign(run.href);
      }
      if (alive) setRun(null);
    })();

    return () => {
      alive = false;
      decoder.stop();
      anims.forEach((a) => a.cancel());
      onPath.current = null;
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("pageshow", onShow);
      delete html.dataset.curtain;
      lenisRef.current?.start();
      busy.current = false;
      window.dispatchEvent(new Event(CURTAIN_LIFTED));
    };
    // router is stable; the run object is the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  if (!run) return null;

  const words = splitTitle(run.label.title);
  const size = sizeOf(run.label.title);
  const sheet = (
    <>
      <div className="pt-top">
        <span className="pt-brand">NULLSEC</span>
        <span>{run.label.eyebrow}</span>
      </div>
      <p className="pt-title" data-size={size}>
        {words.map((word, wi) => (
          <Fragment key={wi}>
            {wi > 0 && " "}
            <span className="pt-word">
              {word.map(({ ch, k }) => (
                <span key={k} className="pt-ch" data-ch={k}>
                  <span className="pt-ch-final">{ch}</span>
                  <span className="pt-ch-noise">{NOISE[(k * 7) % NOISE.length]}</span>
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </p>
      <div className="pt-foot">
        <span className="pt-path">GET {run.path}</span>
        <span className="pt-status" data-pt-status="" />
      </div>
    </>
  );

  return (
    <div ref={rootRef} className="pt" aria-hidden="true">
      {run.cols.map((c, i) => (
        <div key={i} className="pt-col" style={{ left: c.left, width: c.width }}>
          <div className="pt-strip pt-strip-blood" data-pt-blood="" />
          <div className="pt-strip pt-strip-bone" data-pt-bone="">
            <div className="pt-sheet" style={{ left: -c.left, width: run.width }}>
              {sheet}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
