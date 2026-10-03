"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Genuinely interactive targets only. Note the [tabindex='-1'] exclusion: the
// page wraps <main>/<article> in tabindex=-1 for skip-link focus, and we must
// not lock the reticle onto the whole page.
const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, [tabindex]:not([tabindex='-1'])";
// What the cursor names: an interactive target, or anything carrying a
// data-cursor label of its own (a video, the layer over a YouTube frame).
const TARGET = `${INTERACTIVE}, [data-cursor]`;

/**
 * Whether the reticle may lock around a target. Not around a surface you
 * point within, whatever its size: a video player and the play button laid
 * over all of it (they carry data-cursor-free), a slider, where the point
 * is where on it you are. Nor around anything taller than a third of the
 * window: a frame that size says nothing. The dot a lock hides was the only
 * sign of where the pointer was; there the cursor keeps its small form,
 * with the label beside it. Unless the target says it is one whole
 * (data-cursor-lock): a project's card, a single link however tall, where
 * the frame says exactly that and where on it the pointer is does not
 * matter.
 */
function lockable(el: Element): boolean {
  if (!el.matches(INTERACTIVE) || el.matches("input[type='range'], [data-cursor-free]")) return false;
  if (el.matches("[data-cursor-lock]")) return true;
  return el.getBoundingClientRect().height <= window.innerHeight * 0.35;
}

export function CustomCursor() {
  const frameRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    // Touch/stylus devices: no custom cursor.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const frame = frameRef.current!;
    const dot = dotRef.current!;
    const label = labelRef.current!;
    const BASE = 26;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let lastX = mouse.x;
    let lastY = mouse.y;
    let speed = 0;
    let revealed = false;
    let pressed = false;
    let locked: Element | null = null; // what the reticle frames
    let hovered: Element | null = null; // what the label names
    // Full screen draws one element above the page, and this cursor is not
    // in it: the system pointer stands in there (globals.css).
    let fullscreen = false;

    // Animated state, lerped each frame.
    const cur = {
      x: mouse.x, y: mouse.y, w: BASE, h: BASE,
      dx: mouse.x, dy: mouse.y, dotScale: 1, press: 1, opacity: 0,
    };

    const kindLabel = (el: Element): string => {
      const custom = (el as HTMLElement).dataset?.cursor;
      if (custom) return custom;
      const tag = el.tagName.toLowerCase();
      if (tag === "a") return (el as HTMLAnchorElement).target === "_blank" ? "open ↗" : "view →";
      if (tag === "button" || el.getAttribute("role") === "button") return "click";
      if (tag === "input" || tag === "textarea" || tag === "select") return "type";
      return ""; // a focusable box (the video player): nothing to say about it
    };
    const showLabel = (el: Element | null) => {
      const text = el ? kindLabel(el) : "";
      if (label.textContent !== text) label.textContent = text;
      const opacity = text ? "1" : "0";
      if (label.style.opacity !== opacity) label.style.opacity = opacity;
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      speed = Math.min(Math.hypot(mouse.x - lastX, mouse.y - lastY), 70);
      lastX = mouse.x;
      lastY = mouse.y;
      revealed = true;
      wake();
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element | null;
      // A frame (YouTube's) draws its own pointer, and this page gets no move
      // while the mouse is in it: step aside rather than freeze at its edge.
      // The next move out here brings the cursor back.
      if (el?.tagName === "IFRAME") {
        revealed = false;
        wake();
        return;
      }
      const hit = el?.closest(TARGET) ?? null;
      if (hit === hovered) return;
      hovered = hit;
      locked = hit && lockable(hit) ? hit : null;
      showLabel(hit);
      wake();
    };

    const onDown = () => { pressed = true; wake(); };
    const onUp = () => { pressed = false; wake(); };
    const onDocLeave = () => { revealed = false; wake(); };
    // A locked reticle follows its element through smooth scroll, and
    // through a scroller's own (the project cards' row, on a narrow window):
    // scroll does not bubble, hence the capture.
    const onScroll = () => { if (locked) wake(); };
    const onFullscreen = () => {
      fullscreen = document.fullscreenElement !== null;
      hovered = locked = null;
      showLabel(null);
      wake();
    };

    let raf = 0;
    const tick = () => {
      // The label follows its element's own words as they change (a video's
      // "play ▶" turns "pause" once it plays); a target taken out of the
      // page lets the cursor go.
      if (hovered && !hovered.isConnected) {
        hovered = locked = null;
        showLabel(null);
      } else if (hovered) showLabel(hovered);
      let tx: number, ty: number, tw: number, th: number;
      if (locked) {
        // Re-measure every frame so the lock stays glued during smooth scroll.
        const r = locked.getBoundingClientRect();
        const pad = 8;
        tx = r.left + r.width / 2;
        ty = r.top + r.height / 2;
        tw = r.width + pad * 2;
        th = r.height + pad * 2;
      } else {
        const grow = 1 + speed * 0.01; // subtle reaction to pointer speed
        tx = mouse.x;
        ty = mouse.y;
        tw = BASE * grow;
        th = BASE * grow;
      }
      speed *= 0.9;

      const ease = locked ? 0.2 : 0.24;
      cur.x = lerp(cur.x, tx, ease);
      cur.y = lerp(cur.y, ty, ease);
      cur.w = lerp(cur.w, tw, 0.2);
      cur.h = lerp(cur.h, th, 0.2);
      cur.press = lerp(cur.press, pressed ? 0.82 : 1, 0.25);
      cur.dotScale = lerp(cur.dotScale, locked ? 0 : 1, 0.25);
      cur.dx = lerp(cur.dx, mouse.x, 0.4);
      cur.dy = lerp(cur.dy, mouse.y, 0.4);
      const shown = revealed && !fullscreen;
      cur.opacity = lerp(cur.opacity, shown ? 1 : 0, 0.15);

      frame.style.transform =
        `translate(${cur.x}px, ${cur.y}px) translate(-50%, -50%) scale(${cur.press})`;
      frame.style.width = `${cur.w}px`;
      frame.style.height = `${cur.h}px`;
      frame.style.opacity = `${cur.opacity}`;

      dot.style.transform =
        `translate(${cur.dx}px, ${cur.dy}px) translate(-50%, -50%) scale(${cur.dotScale})`;
      dot.style.opacity = `${cur.opacity}`;

      // Sleep once everything has caught up with its target. The loop used to
      // run every frame for the life of the tab, rewriting the same styles on
      // a pointer that had not moved; any input or scroll wakes it again.
      const settled =
        Math.abs(cur.x - tx) < 0.1 && Math.abs(cur.y - ty) < 0.1 &&
        Math.abs(cur.w - tw) < 0.1 && Math.abs(cur.h - th) < 0.1 &&
        Math.abs(cur.dx - mouse.x) < 0.1 && Math.abs(cur.dy - mouse.y) < 0.1 &&
        Math.abs(cur.press - (pressed ? 0.82 : 1)) < 0.001 &&
        Math.abs(cur.dotScale - (locked ? 0 : 1)) < 0.001 &&
        Math.abs(cur.opacity - (shown ? 1 : 0)) < 0.002 &&
        speed < 0.05;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onDocLeave);
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    document.addEventListener("fullscreenchange", onFullscreen);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onDocLeave);
      document.removeEventListener("scroll", onScroll, { capture: true });
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  // Corner-bracket reticle: a transparent box whose only marks are 4 blood
  // corners. Small = a tight crosshair; expanded = a target lock framing the
  // hovered element.
  const corner: React.CSSProperties = {
    position: "absolute",
    width: 9,
    height: 9,
    borderColor: "var(--color-blood)",
    borderStyle: "solid",
    borderWidth: 0,
  };

  return (
    <>
      <div
        ref={frameRef}
        aria-hidden="true"
        className="custom-cursor"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          width: 26,
          height: 26,
          pointerEvents: "none",
          willChange: "transform, width, height, opacity",
          opacity: 0,
        }}
      >
        <span style={{ ...corner, top: 0, left: 0, borderTopWidth: 1.5, borderLeftWidth: 1.5 }} />
        <span style={{ ...corner, top: 0, right: 0, borderTopWidth: 1.5, borderRightWidth: 1.5 }} />
        <span style={{ ...corner, bottom: 0, left: 0, borderBottomWidth: 1.5, borderLeftWidth: 1.5 }} />
        <span style={{ ...corner, bottom: 0, right: 0, borderBottomWidth: 1.5, borderRightWidth: 1.5 }} />
        <span
          ref={labelRef}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "0.5rem",
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.55rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-blood)",
            whiteSpace: "nowrap",
            opacity: 0,
            transition: "opacity 0.2s ease",
          }}
        />
      </div>

      {/* Inner dot — brand accent, always blood-red. */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="custom-cursor"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "var(--color-blood)",
          pointerEvents: "none",
          willChange: "transform, opacity",
          opacity: 0,
        }}
      />
    </>
  );
}
