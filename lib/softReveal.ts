import { gsap } from "@/lib/gsap";

/**
 * Reduced-motion-friendly entrance.
 *
 * A pure opacity cross-fade as each element scrolls into view — no movement,
 * scaling, parallax, or travel. Cross-fades carry no vestibular trigger, so
 * reduced-motion visitors still get a gentle, intentional reveal instead of
 * content snapping in all at once, while honouring `prefers-reduced-motion`.
 *
 * Mirrors the IntersectionObserver pattern the sections use for their full
 * animations, so the only difference under reduced motion is "fade, don't move".
 *
 * @returns cleanup function that disconnects the observer.
 */
export function softReveal(
  elements: (HTMLElement | null | undefined)[],
  { duration = 0.3 }: { duration?: number } = {},
): () => void {
  const els = elements.filter(Boolean) as HTMLElement[];
  if (!els.length) return () => {};

  els.forEach((el) => gsap.set(el, { opacity: 0 }));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        gsap.to(entry.target, { opacity: 1, duration, ease: "power1.out" });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );

  els.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}
