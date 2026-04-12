// GSAP core is SSR-safe — import at module level is fine.
export { gsap } from "gsap";

// ScrollTrigger touches browser globals (matchMedia, ResizeObserver…) at
// module-init time. Importing it at module level breaks Next.js SSR.
// Use loadScrollTrigger() inside useEffect only.
let _st: typeof import("gsap/ScrollTrigger").ScrollTrigger | null = null;

export async function loadScrollTrigger() {
  if (_st) return _st;
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  _st = ScrollTrigger;
  return ScrollTrigger;
}
