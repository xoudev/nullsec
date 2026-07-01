import type { HeroLook } from "@/lib/hero-bg/types";

/**
 * TOPOGRAPHIC CONTOUR MAP
 *
 * A stack of faint, near-horizontal contour lines spanning the width. Each line's
 * vertical position is displaced by layered value-noise so the field reads as
 * elevation contours on a survey map. The whole field breathes and drifts on tMs;
 * scroll glides it downward and adds a touch of amplitude (parallax push).
 *
 * "I map the blind spots."
 */
export function createTopo(ctx: CanvasRenderingContext2D): HeroLook {
  let w = 0;
  let h = 0;

  const LINE_COUNT = 32;      // contours in the stack
  const SEG = 44;             // horizontal samples per line (interpolated smooth)

  // Value-noise lattice: a 1D-per-row set of random control heights sampled
  // across a virtual x/y space, blended with layered sines for organic terrain.
  type Wave = { amp: number; kx: number; ky: number; phase: number; speed: number };
  let waves: Wave[] = [];

  // One faint blood highlight rides a single contour near the middle.
  const accentLine = Math.floor(LINE_COUNT * 0.58);

  const seed = () => {
    // Layered noise field: a few octaves of tilted sines. Deterministic per mount.
    const octaves = 5;
    const next: Wave[] = [];
    let amp = 34;
    for (let i = 0; i < octaves; i++) {
      next.push({
        amp,
        kx: (0.6 + Math.random() * 1.4) * (i + 1) * 0.5,
        ky: (0.4 + Math.random() * 1.1) * (i + 1) * 0.35,
        phase: Math.random() * Math.PI * 2,
        speed: 0.00004 + Math.random() * 0.00009,
      });
      amp *= 0.56;
    }
    waves = next;
  };

  seed();

  const resize = (nw: number, nh: number): void => {
    w = nw;
    h = nh;
  };

  // Terrain elevation at a normalized point, evolving with time.
  const elevation = (nx: number, ny: number, tMs: number): number => {
    let e = 0;
    for (let i = 0; i < waves.length; i++) {
      const wv = waves[i];
      e +=
        wv.amp *
        Math.sin(nx * wv.kx * Math.PI * 2 + ny * wv.ky * Math.PI * 2 + wv.phase + tMs * wv.speed);
    }
    return e;
  };

  const frame = (tMs: number, scroll: number): void => {
    ctx.clearRect(0, 0, w, h);
    if (w <= 0 || h <= 0) return;

    // Scroll parallax: glide the whole field downward and swell amplitude a touch.
    const glide = scroll * h * 0.35;
    const ampBoost = 1 + scroll * 0.55;

    // Vertical spread of contours, with a little margin bleed off top/bottom.
    const top = -h * 0.12;
    const span = h * 1.24;
    const rowGap = span / (LINE_COUNT - 1);

    ctx.lineWidth = 1;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    for (let li = 0; li < LINE_COUNT; li++) {
      const rowN = li / (LINE_COUNT - 1);
      const baseY = top + rowGap * li + glide;

      // Depth fade: contours nearer the vertical center of the hero sit faintest.
      const centerBias = 1 - Math.abs(rowN - 0.5) * 0.5;

      const isAccent = li === accentLine;

      ctx.beginPath();
      for (let s = 0; s <= SEG; s++) {
        const sx = s / SEG;
        const x = sx * w;
        const disp =
          elevation(sx * 1.6, rowN * 2.2, tMs) * ampBoost * centerBias;
        const y = baseY + disp;
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      if (isAccent) {
        // Single, extremely faint blood highlight — mostly grayscale overall.
        ctx.strokeStyle = "rgba(230,57,70,0.05)";
      } else {
        const a = 0.05 * (0.7 + centerBias * 0.5);
        ctx.strokeStyle = `rgba(242,239,232,${a.toFixed(4)})`;
      }
      ctx.stroke();
    }
  };

  return { resize, frame };
}
