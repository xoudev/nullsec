import type { HeroLook } from "@/lib/hero-bg/types";

/**
 * PERSPECTIVE WIREFRAME
 *
 * A faint perspective grid receding to a vanishing point near the vertical
 * centre. Horizontal lines compress toward the horizon; vertical lines fan
 * out from the vanishing point. Everything waves subtly via a slow sine over
 * time. Scroll pushes the field "through" the viewer for a gentle fly-through.
 *
 * Monochrome bone at very low alpha over the transparent void. One barely-there
 * blood highlight sits on the horizon line.
 */
export function createGrid(ctx: CanvasRenderingContext2D): HeroLook {
  let w = 0;
  let h = 0;
  let horizonY = 0;

  // Vanishing point X (fixed, near centre; parallaxed slightly by scroll).
  let vpX = 0;

  // Number of vertical rays fanning out from the vanishing point.
  const RAY_COUNT = 26;
  // Number of receding horizontal rows (loops via a moving phase).
  const ROW_COUNT = 22;

  // Precomputed per-ray horizontal offsets at the bottom edge (fan spread).
  let raySpread: number[] = [];

  const BONE = "242,239,232";
  const BLOOD = "230,57,70";

  function build(): void {
    // Horizon sits a touch above vertical centre for a grounded, editorial feel.
    horizonY = h * 0.46;
    vpX = w * 0.5;

    // Spread the rays across a width wider than the canvas so the fan feels
    // expansive; symmetric around the vanishing point.
    raySpread = [];
    const half = (RAY_COUNT - 1) / 2;
    const bottomHalfWidth = w * 0.95; // half-width of the fan at the bottom edge
    for (let i = 0; i < RAY_COUNT; i++) {
      const t = (i - half) / half; // -1 .. 1
      // Ease the spacing so rays bunch a little toward the centre.
      const eased = Math.sign(t) * Math.pow(Math.abs(t), 1.15);
      raySpread.push(eased * bottomHalfWidth);
    }
  }

  function resize(cw: number, ch: number): void {
    w = cw;
    h = ch;
    build();
  }

  function frame(tMs: number, scroll: number): void {
    ctx.clearRect(0, 0, w, h);

    const t = tMs * 0.001;

    // Depth of the floor beneath the horizon.
    const floorH = h - horizonY;
    if (floorH <= 0) return;

    // Gentle self-motion plus scroll-driven push. `flow` is a continuously
    // increasing phase in [0,1) that scrolls rows outward (toward viewer).
    const baseSpeed = 0.045; // slow ambient drift even at scroll 0
    const scrollSpeed = 0.9; // extra push from scroll position
    const flow = ((t * baseSpeed) + scroll * scrollSpeed) % 1;

    // Parallax the vanishing point subtly with scroll + a slow lateral sway.
    const sway = Math.sin(t * 0.15) * (w * 0.012);
    const vp = vpX + sway + (scroll - 0.5) * (w * 0.03);

    // Waving: a slow sine displacement applied to the whole field.
    const waveAmp = Math.min(h, w) * 0.010;

    ctx.lineWidth = 1;
    ctx.lineJoin = "round";

    // --- Horizontal receding rows -----------------------------------------
    // Each row's depth d in (0,1]: d->0 at horizon, d->1 at bottom edge.
    // We use a perspective mapping so rows compress toward the horizon, and a
    // moving fractional offset (flow) so the whole set streams outward.
    for (let i = 0; i < ROW_COUNT; i++) {
      // Fractional index that flows outward and wraps.
      const fi = (i + flow) / ROW_COUNT; // 0..1
      // Perspective: small fi (near horizon) -> tiny screen offset.
      // pow > 1 concentrates rows near the horizon.
      const depth = Math.pow(fi, 2.2);
      const y = horizonY + depth * floorH;

      // Fade in from the horizon and out at the very front.
      const fadeHorizon = Math.min(1, fi * 6.0);
      const fadeFront = 1 - Math.pow(fi, 3.5) * 0.9;
      const rowAlpha = 0.075 * fadeHorizon * fadeFront;
      if (rowAlpha <= 0.002) continue;

      // Subtle vertical wave that increases with depth (nearer = more sway).
      const wy = Math.sin(fi * 5.0 + t * 0.6) * waveAmp * depth;

      ctx.beginPath();
      ctx.moveTo(0, y + wy);
      ctx.lineTo(w, y + wy);
      ctx.strokeStyle = `rgba(${BONE},${rowAlpha.toFixed(4)})`;
      ctx.stroke();
    }

    // --- Vertical fanning rays --------------------------------------------
    // Each ray runs from the vanishing point (on the horizon) down to a spread
    // position at the bottom edge, with a slight horizontal wave.
    for (let i = 0; i < RAY_COUNT; i++) {
      const spread = raySpread[i];
      const bottomX = vp + spread;

      // Waving: lateral displacement that grows toward the front.
      const phase = spread * 0.004 + t * 0.5;
      const waveX = Math.sin(phase) * waveAmp * 1.4;

      // Fade rays toward the outer edges so the fan dissolves at the sides.
      const edge = Math.abs(spread) / (w * 0.95);
      const rayAlpha = 0.06 * (1 - edge * 0.7);
      if (rayAlpha <= 0.002) continue;

      // Mild curve: sample a few points so the wave reads as a subtle bend.
      ctx.beginPath();
      const SEG = 6;
      for (let s = 0; s <= SEG; s++) {
        const f = s / SEG; // 0 at horizon, 1 at bottom
        const yy = horizonY + f * floorH;
        // Interpolate x from vanishing point to bottom spread, add depth-scaled wave.
        const xx = vp + spread * f + waveX * f * f;
        if (s === 0) ctx.moveTo(xx, yy);
        else ctx.lineTo(xx, yy);
      }
      ctx.strokeStyle = `rgba(${BONE},${rayAlpha.toFixed(4)})`;
      ctx.stroke();
    }

    // --- Horizon glow: one faint blood highlight --------------------------
    // A single low-contrast red line-glow on the horizon, breathing slowly.
    const breath = 0.5 + 0.5 * Math.sin(t * 0.4);
    const bloodAlpha = 0.018 + 0.014 * breath;
    const glowHalf = w * 0.28;
    const grad = ctx.createLinearGradient(vp - glowHalf, 0, vp + glowHalf, 0);
    grad.addColorStop(0, `rgba(${BLOOD},0)`);
    grad.addColorStop(0.5, `rgba(${BLOOD},${bloodAlpha.toFixed(4)})`);
    grad.addColorStop(1, `rgba(${BLOOD},0)`);
    ctx.beginPath();
    ctx.moveTo(vp - glowHalf, horizonY);
    ctx.lineTo(vp + glowHalf, horizonY);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // A faint bone horizon line beneath it for structure.
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(w, horizonY);
    ctx.strokeStyle = `rgba(${BONE},0.05)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  return { resize, frame };
}
