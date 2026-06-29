"use client";

import { useEffect, useRef, useMemo } from "react";
import { gsap } from "@/lib/gsap";
import { useT } from "@/lib/i18n";
import { radarAxes } from "@/content/clearances";
import type { Clearance, RadarValues, RadarAxis } from "@/content/clearances";

// ── French axis labels (visible text only; data keys stay English) ──
const AXIS_LABELS_FR: Record<RadarAxis, string> = {
  GOVERNANCE: "GOUVERNANCE",
  NETWORK:    "RÉSEAU",
  DEFENSE:    "DÉFENSE",
  RISK:       "RISQUE",
  AUDIT:      "AUDIT",
  COMPLIANCE: "CONFORMITÉ",
};

// ── Geometry constants ──────────────────────────────────────────
const CX = 250;         // viewBox centre x
const CY = 250;         // viewBox centre y
const R  = 138;         // max data-polygon radius
const LR = 183;         // axis-label radius (outside hex)
const RINGS = [1 / 3, 2 / 3, 1] as const;

// ── Polar helpers ───────────────────────────────────────────────

/** Angle in radians for axis i — starts at top (−π/2), clockwise. */
function ang(i: number) {
  return -Math.PI / 2 + (i * 2 * Math.PI) / 6;
}

/** Convert a 0–100 value on axis i to an SVG {x, y}. */
function valToXY(value: number, i: number) {
  const r = (value / 100) * R;
  const a = ang(i);
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

/** Ring vertex (fixed fraction of R) on axis i. */
function ringXY(frac: number, i: number) {
  const a = ang(i);
  return { x: CX + frac * R * Math.cos(a), y: CY + frac * R * Math.sin(a) };
}

/** Serialise vertices to SVG `points` attribute string. */
function pts(verts: Array<{ x: number; y: number }>) {
  return verts.map(v => `${v.x.toFixed(2)},${v.y.toFixed(2)}`).join(" ");
}

/** Compute polygon vertices from a RadarValues map. */
function computeVerts(values: RadarValues) {
  return radarAxes.map((ax, i) => valToXY(values[ax], i));
}

/** Average all certs into a single RadarValues for the "aggregate" state. */
function computeAggregate(clearances: Clearance[]): RadarValues {
  const acc = Object.fromEntries(radarAxes.map(ax => [ax, 0])) as RadarValues;
  clearances.forEach(c => radarAxes.forEach(ax => { acc[ax] += c.radar[ax]; }));
  return Object.fromEntries(
    radarAxes.map(ax => [ax, acc[ax] / clearances.length])
  ) as RadarValues;
}

/** SVG text-anchor for axis i based on its horizontal position. */
function textAnchor(i: number): "middle" | "start" | "end" {
  const dx = Math.cos(ang(i));
  if (dx > 0.2)  return "start";
  if (dx < -0.2) return "end";
  return "middle";
}

// ── Component ───────────────────────────────────────────────────

interface Props {
  clearances:      Clearance[];
  activeCertIndex: number | null;
  prefersReduced:  boolean;
}

export function ClearanceRadar({ clearances, activeCertIndex, prefersReduced }: Props) {
  const { tr } = useT();
  const polygonRef = useRef<SVGPolygonElement>(null);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const labelRef   = useRef<HTMLDivElement>(null);

  /**
   * Flat mutable object tweened by GSAP:
   *   { x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5 }
   * One tween → one onUpdate per frame → minimal DOM writes.
   */
  const st = useRef<Record<string, number>>({});

  const aggValues = useMemo(() => computeAggregate(clearances), [clearances]);
  const aggVerts  = useMemo(() => computeVerts(aggValues),      [aggValues]);

  // ── Write current `st` values to SVG DOM (no React re-render) ──
  function flush() {
    const pointStr = radarAxes.map((_, i) =>
      `${(st.current[`x${i}`] ?? CX).toFixed(2)},${(st.current[`y${i}`] ?? CY).toFixed(2)}`
    ).join(" ");
    polygonRef.current?.setAttribute("points", pointStr);
    circleRefs.current.forEach((c, i) => {
      if (!c) return;
      c.setAttribute("cx", (st.current[`x${i}`] ?? CX).toFixed(2));
      c.setAttribute("cy", (st.current[`y${i}`] ?? CY).toFixed(2));
    });
  }

  // ── Seed `st` to aggregate on first paint ──────────────────────
  useEffect(() => {
    aggVerts.forEach((v, i) => {
      st.current[`x${i}`] = v.x;
      st.current[`y${i}`] = v.y;
    });
    flush();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Morph polygon when active cert changes ──────────────────────
  useEffect(() => {
    const targetVerts = activeCertIndex !== null
      ? computeVerts(clearances[activeCertIndex].radar)
      : aggVerts;

    const newLabel = activeCertIndex !== null
      ? `// ${clearances[activeCertIndex].title.toLowerCase()}`
      : "// aggregate profile";

    // Build flat target for GSAP
    const target: Record<string, number> = {};
    targetVerts.forEach((v, i) => { target[`x${i}`] = v.x; target[`y${i}`] = v.y; });

    if (prefersReduced) {
      Object.assign(st.current, target);
      flush();
      if (labelRef.current) labelRef.current.textContent = newLabel;
      return;
    }

    const duration = activeCertIndex !== null ? 0.6 : 0.4;

    gsap.killTweensOf(st.current);
    gsap.to(st.current, {
      ...target,
      duration,
      ease: "power3.inOut",
      overwrite: "auto",
      onUpdate: flush,
    });

    // Fade label out → swap text → fade in
    const el = labelRef.current;
    if (el) {
      gsap.to(el, {
        opacity: 0,
        duration: 0.12,
        onComplete: () => {
          el.textContent = newLabel;
          gsap.to(el, { opacity: 1, duration: 0.2 });
        },
      });
    }

    return () => { gsap.killTweensOf(st.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCertIndex, prefersReduced]);

  // ── Static SVG geometry (never changes) ────────────────────────

  const gridRings = RINGS.map((frac, ri) => {
    const ringPts = radarAxes.map((_, i) => {
      const p = ringXY(frac, i);
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    }).join(" ");
    return (
      <polygon key={ri} points={ringPts}
        fill="none" stroke="rgba(107,107,107,0.20)" strokeWidth="0.5" />
    );
  });

  const axisLines = radarAxes.map((_, i) => {
    const p = ringXY(1, i);
    return (
      <line key={i} x1={CX} y1={CY}
        x2={p.x.toFixed(2)} y2={p.y.toFixed(2)}
        stroke="rgba(107,107,107,0.10)" strokeWidth="0.5" />
    );
  });

  const axisLabels = radarAxes.map((ax, i) => {
    const a = ang(i);
    const x = (CX + LR * Math.cos(a)).toFixed(2);
    const y = (CY + LR * Math.sin(a)).toFixed(2);
    return (
      <text key={i} x={x} y={y}
        textAnchor={textAnchor(i)} dominantBaseline="middle"
        style={{
          fontFamily:    "var(--font-jetbrains-mono)",
          fontSize:      "12px",
          fill:          "var(--color-bone)",
          letterSpacing: "0.1em",
        }}
      >
        {tr(ax, AXIS_LABELS_FR[ax])}
      </text>
    );
  });

  const initPtsStr = pts(aggVerts);

  return (
    <div style={{
      width:          "100%",
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      gap:            "0.65rem",
    }}>
      <svg
        viewBox="0 0 500 500"
        aria-hidden="true"
        style={{ width: "100%", maxWidth: "420px", overflow: "visible" }}
      >
        {/* Grid rings */}
        {gridRings}

        {/* Axis spokes */}
        {axisLines}

        {/* Axis labels */}
        {axisLabels}

        {/* Live data polygon — GSAP writes directly to DOM */}
        <polygon
          ref={polygonRef}
          points={initPtsStr}
          style={{
            fill:          "var(--color-blood)",
            fillOpacity:   0.12,
            stroke:        "var(--color-blood)",
            strokeOpacity: 0.80,
            strokeWidth:   "1.5",
            strokeLinejoin: "round",
          }}
        />

        {/* Vertex dots — GSAP moves cx/cy via setAttribute */}
        {aggVerts.map((v, i) => (
          <circle
            key={i}
            ref={(el) => { circleRefs.current[i] = el; }}
            cx={v.x.toFixed(2)}
            cy={v.y.toFixed(2)}
            r="4"
            style={{ fill: "var(--color-blood)" }}
          />
        ))}
      </svg>

      {/* Label below radar */}
      <div
        ref={labelRef}
        aria-live="polite"
        style={{
          fontFamily:    "var(--font-jetbrains-mono)",
          fontSize:      "0.875rem",
          color:         "var(--color-ash)",
          letterSpacing: "0.08em",
          textAlign:     "center",
        }}
      >
        // aggregate profile
      </div>
    </div>
  );
}
