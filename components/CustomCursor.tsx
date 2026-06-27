"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Genuinely interactive targets only. Note the [tabindex='-1'] exclusion: the
// page wraps <main>/<article> in tabindex=-1 for skip-link focus, and we must
// not lock the reticle onto the whole page.
const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, [tabindex]:not([tabindex='-1'])";

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
    let locked: Element | null = null;

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
      return "→";
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      speed = Math.min(Math.hypot(mouse.x - lastX, mouse.y - lastY), 70);
      lastX = mouse.x;
      lastY = mouse.y;
      revealed = true;
    };

    const onOver = (e: MouseEvent) => {
      const hit = (e.target as Element)?.closest(INTERACTIVE) ?? null;
      if (hit === locked) return;
      locked = hit;
      if (hit) {
        label.textContent = kindLabel(hit);
        label.style.opacity = "1";
      } else {
        label.style.opacity = "0";
      }
    };

    const onDown = () => { pressed = true; };
    const onUp = () => { pressed = false; };
    const onDocLeave = () => { revealed = false; };

    let raf = 0;
    const tick = () => {
      let tx: number, ty: number, tw: number, th: number;
      if (locked && locked.isConnected) {
        // Re-measure every frame so the lock stays glued during smooth scroll.
        const r = locked.getBoundingClientRect();
        const pad = 8;
        tx = r.left + r.width / 2;
        ty = r.top + r.height / 2;
        tw = r.width + pad * 2;
        th = r.height + pad * 2;
      } else {
        if (locked) { locked = null; label.style.opacity = "0"; }
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
      cur.opacity = lerp(cur.opacity, revealed ? 1 : 0, 0.15);

      frame.style.transform =
        `translate(${cur.x}px, ${cur.y}px) translate(-50%, -50%) scale(${cur.press})`;
      frame.style.width = `${cur.w}px`;
      frame.style.height = `${cur.h}px`;
      frame.style.opacity = `${cur.opacity}`;

      dot.style.transform =
        `translate(${cur.dx}px, ${cur.dy}px) translate(-50%, -50%) scale(${cur.dotScale})`;
      dot.style.opacity = `${cur.opacity}`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onDocLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onDocLeave);
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
