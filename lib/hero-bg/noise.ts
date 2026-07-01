import type { HeroLook } from "@/lib/hero-bg/types";

/**
 * ORGANIC FOG / PLASMA
 *
 * A slowly morphing value-noise field rendered as faint bone luminance, drawn
 * cheaply on a small offscreen grid and scaled up with smoothing so it reads as
 * soft, smoky fog behind the hero text. Scroll pans the field and modulates
 * intensity; the field also evolves on its own via tMs.
 */
export function createNoise(ctx: CanvasRenderingContext2D): HeroLook {
  // Small offscreen value-noise grid (kept tiny so the whole thing is cheap).
  const GRID_W = 60;
  const GRID_H = 34;

  // Offscreen buffer we paint the low-res field into, then upscale.
  const buf: HTMLCanvasElement = document.createElement("canvas");
  buf.width = GRID_W;
  buf.height = GRID_H;
  const bctx = buf.getContext("2d");
  const img: ImageData | null = bctx ? bctx.createImageData(GRID_W, GRID_H) : null;

  let w = 0;
  let h = 0;

  // Two octaves of value noise, each a lattice of random values that we sample
  // with smooth (cosine) interpolation and animate by scrolling a third axis
  // (time) through a stack of lattice "layers".
  type Lattice = {
    cols: number;
    rows: number;
    layers: number;
    data: Float32Array; // cols*rows*layers
  };

  function makeLattice(cols: number, rows: number, layers: number): Lattice {
    const data = new Float32Array(cols * rows * layers);
    for (let i = 0; i < data.length; i++) data[i] = Math.random();
    return { cols, rows, layers, data };
  }

  // Coarse octave (big blobs) + finer octave (texture within).
  const octA: Lattice = makeLattice(7, 5, 8);
  const octB: Lattice = makeLattice(13, 9, 8);

  function smooth(t: number): number {
    // cosine-ish smoothstep
    return t * t * (3 - 2 * t);
  }

  function sampleLattice(
    L: Lattice,
    x: number, // 0..1
    y: number, // 0..1
    z: number, // 0..1 (wraps)
  ): number {
    const fx = x * (L.cols - 1);
    const fy = y * (L.rows - 1);
    const fz = z * L.layers;

    let x0 = Math.floor(fx);
    let y0 = Math.floor(fy);
    let z0 = Math.floor(fz);
    const tx = smooth(fx - x0);
    const ty = smooth(fy - y0);
    const tz = fz - z0;

    x0 = ((x0 % L.cols) + L.cols) % L.cols;
    y0 = ((y0 % L.rows) + L.rows) % L.rows;
    z0 = ((z0 % L.layers) + L.layers) % L.layers;
    const x1 = (x0 + 1) % L.cols;
    const y1 = (y0 + 1) % L.rows;
    const z1 = (z0 + 1) % L.layers;

    const idx = (cx: number, cy: number, cz: number): number =>
      L.data[(cz * L.rows + cy) * L.cols + cx];

    // trilinear blend
    const c00 = idx(x0, y0, z0) * (1 - tx) + idx(x1, y0, z0) * tx;
    const c10 = idx(x0, y1, z0) * (1 - tx) + idx(x1, y1, z0) * tx;
    const c01 = idx(x0, y0, z1) * (1 - tx) + idx(x1, y0, z1) * tx;
    const c11 = idx(x0, y1, z1) * (1 - tx) + idx(x1, y1, z1) * tx;

    const c0 = c00 * (1 - ty) + c10 * ty;
    const c1 = c01 * (1 - ty) + c11 * ty;

    return c0 * (1 - tz) + c1 * tz;
  }

  function resize(nw: number, nh: number): void {
    w = nw;
    h = nh;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
  }

  function frame(tMs: number, scroll: number): void {
    ctx.clearRect(0, 0, w, h);
    if (!bctx || !img) return;

    const t = tMs * 0.001;

    // Self-evolution: slow drift through the noise's time axis.
    const zA = (t * 0.012) % 1;
    const zB = (t * 0.020) % 1;

    // Scroll pans the field horizontally/vertically (parallax) and lifts
    // intensity slightly toward mid-scroll.
    const panX = scroll * 0.55 + t * 0.008;
    const panY = scroll * 0.22;
    const drift = t * 0.006;

    // Intensity envelope: faint at rest, a touch stronger mid-scroll, always low.
    const intensity = 0.55 + 0.45 * Math.sin(scroll * Math.PI); // 0.55..1.0

    // A single, very faint blood highlight that wanders — used only on the
    // brightest sliver of fog to keep it ~95% grayscale.
    const accentPhase = (t * 0.03 + scroll * 0.4) % 1;

    const data = img.data;
    const invW = 1 / GRID_W;
    const invH = 1 / GRID_H;

    for (let gy = 0; gy < GRID_H; gy++) {
      const v = gy * invH;
      for (let gx = 0; gx < GRID_W; gx++) {
        const u = gx * invW;

        const a = sampleLattice(octA, u + panX + drift, v + panY, zA);
        const b = sampleLattice(octB, u * 1.7 - drift * 0.7, v * 1.7 + panY * 0.5, zB);

        // Combine octaves: coarse dominant, fine detail on top. Center & shape.
        let n = a * 0.68 + b * 0.32;
        // Ridge/contrast shaping so fog has soft edges rather than flat grey.
        n = Math.pow(Math.abs(n - 0.5) * 2, 1.6);
        n = 1 - n; // bright cores, dark gaps
        n = Math.max(0, n);

        // Vertical falloff: keep fog softer at the very top/bottom edges.
        const edge = Math.sin(Math.PI * v);
        n *= 0.35 + 0.65 * edge;

        // Overall alpha kept in the faint 0.03..0.10 band.
        const alpha = n * intensity * 0.10;

        const o = (gy * GRID_W + gx) * 4;

        // Base fog color = bone (242,239,232). Blend a whisper of blood into
        // only the very brightest cells near the accent phase.
        let r = 242;
        let g = 239;
        let bl = 232;
        if (n > 0.8) {
          const near = 1 - Math.min(1, Math.abs(u - accentPhase) * 3);
          const mix = near * 0.5 * (n - 0.8) * 5; // small, capped
          r = 242 + (230 - 242) * mix;
          g = 239 + (57 - 239) * mix;
          bl = 232 + (70 - 232) * mix;
        }

        data[o] = r;
        data[o + 1] = g;
        data[o + 2] = bl;
        data[o + 3] = Math.round(Math.min(0.10, alpha) * 255);
      }
    }

    bctx.putImageData(img, 0, 0);

    // Upscale the tiny field to fill the canvas; smoothing turns cells into fog.
    // A gentle scroll-driven zoom adds life without being distracting.
    const zoom = 1.06 + scroll * 0.06;
    const dw = w * zoom;
    const dh = h * zoom;
    const dx = (w - dw) * 0.5 - scroll * w * 0.04;
    const dy = (h - dh) * 0.5 - scroll * h * 0.02;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(buf, dx, dy, dw, dh);
  }

  return { resize, frame };
}
