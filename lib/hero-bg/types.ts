/**
 * A generative hero background "look".
 *
 * Each look draws faint, monochrome, scroll-reactive motion onto a transparent
 * 2D canvas layered over the dark void, behind the hero content. Looks are
 * self-contained (no external assets) and implement this interface.
 */
export type HeroLook = {
  /** Called on mount and on every resize. w/h are CSS pixels; the context is
   *  already scaled by devicePixelRatio, so draw in CSS pixel coordinates. */
  resize(w: number, h: number): void;
  /** Draw one frame. `tMs` is elapsed milliseconds since start; `scroll` is the
   *  hero scroll progress in [0, 1] (0 = top, 1 = one viewport scrolled). */
  frame(tMs: number, scroll: number): void;
  /** Optional teardown (clear timers, release buffers). */
  destroy?(): void;
};

export type HeroLookFactory = (ctx: CanvasRenderingContext2D) => HeroLook;
