import type { HeroLook } from "@/lib/hero-bg/types";

/**
 * DRIFTING MOTES / DATA DUST
 *
 * A few hundred tiny faint motes drift slowly on a gentle diagonal, wrapping at
 * the edges. Size/alpha/depth vary: a handful of nearer, slightly brighter
 * motes float over many faint, distant ones. Scroll adds a parallax vertical
 * push and gently speeds the drift. Very occasionally two motes that pass close
 * are joined by an almost-invisible bone line.
 *
 * Monochrome bone at very low alpha; a single, rarely-lit blood mote provides
 * the faintest hint of the accent. Quiet and refined — it lives behind text.
 */

const BONE = "242, 239, 232";
const BLOOD = "230, 57, 70";

type Mote = {
  x: number;
  y: number;
  depth: number; // 0 = far/faint, 1 = near/bright
  r: number; // radius in CSS px
  a: number; // base alpha
  vx: number; // per-ms base velocity
  vy: number;
  ph: number; // phase for gentle twinkle/wander
  pw: number; // twinkle speed
  blood: boolean;
};

export function createParticles(ctx: CanvasRenderingContext2D): HeroLook {
  let w = 0;
  let h = 0;
  let motes: Mote[] = [];

  // Gentle diagonal drift direction (down-right), slow.
  const DIR_X = 0.55;
  const DIR_Y = 0.32;

  function build(): void {
    // Density scales with area but stays modest for perf.
    const target = Math.round(
      Math.min(420, Math.max(140, (w * h) / 3400))
    );
    motes = new Array(target);
    for (let i = 0; i < target; i++) {
      // Bias toward far/faint motes; a minority are near/bright.
      const d = Math.pow(Math.random(), 2.2); // most values near 0 (far)
      const speed = 0.0016 + d * 0.0042; // near motes move a touch faster
      motes[i] = {
        x: Math.random() * w,
        y: Math.random() * h,
        depth: d,
        r: 0.5 + d * 1.35,
        a: 0.03 + d * 0.06, // 0.03 .. 0.09
        vx: DIR_X * speed,
        vy: DIR_Y * speed,
        ph: Math.random() * Math.PI * 2,
        pw: 0.0004 + Math.random() * 0.0009,
        blood: false,
      };
    }
    // Exactly one faint blood mote, among the nearer ones, lit sparingly.
    if (motes.length > 0) {
      let idx = 0;
      let best = -1;
      for (let i = 0; i < motes.length; i++) {
        if (motes[i].depth > best) {
          best = motes[i].depth;
          idx = i;
        }
      }
      motes[idx].blood = true;
    }
  }

  function resize(cw: number, ch: number): void {
    w = cw;
    h = ch;
    build();
  }

  function wrap(v: number, max: number): number {
    // Keep a small margin so motes don't pop exactly at the edge.
    const m = 4;
    if (v < -m) return v + (max + m * 2);
    if (v > max + m) return v - (max + m * 2);
    return v;
  }

  function frame(tMs: number, scroll: number): void {
    ctx.clearRect(0, 0, w, h);

    // Scroll gently speeds the drift and adds a downward parallax push.
    const speedMul = 1 + scroll * 0.9;
    const dt = tMs; // absolute time for deterministic wrap positions

    // For the sparse connecting lines we only test a small pool of near motes.
    const nearPool: Mote[] = [];

    for (let i = 0; i < motes.length; i++) {
      const p = motes[i];

      // Base drift (wrapped). Parallax: nearer motes react more to scroll.
      const parallax = scroll * (18 + p.depth * 64);
      const x = wrap(p.x + p.vx * dt * speedMul, w);
      const y = wrap(p.y + (p.vy * dt * speedMul + parallax), h);

      // Gentle twinkle in alpha only (no size churn) for a calm shimmer.
      const tw = 0.75 + 0.25 * Math.sin(p.ph + dt * p.pw);
      const alpha = p.a * tw;

      const color = p.blood ? BLOOD : BONE;
      // Blood mote is kept extra faint and rarely at full breath.
      const finalA = p.blood ? alpha * 0.7 : alpha;

      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${finalA})`;
      ctx.fill();

      if (p.depth > 0.62) {
        nearPool.push({ ...p, x, y });
      }
    }

    // Extremely sparse, extremely faint links between very-close near motes.
    if (nearPool.length > 1) {
      const maxDist = 46;
      const maxDist2 = maxDist * maxDist;
      for (let i = 0; i < nearPool.length; i++) {
        const a = nearPool[i];
        for (let j = i + 1; j < nearPool.length; j++) {
          const b = nearPool[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxDist2) {
            const t = 1 - Math.sqrt(d2) / maxDist; // 1 when touching
            const la = 0.035 * t * t; // fades quickly; peaks very low
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${BONE}, ${la})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }
  }

  return { resize, frame };
}
