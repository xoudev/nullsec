/**
 * The full-screen page transition (components/PageTransition.tsx), the parts
 * other modules share: the label type, and the signal that the curtain is up.
 *
 * Kept free of content imports on purpose. Client components import from here,
 * and a value import of the case studies would ship their full text to the
 * browser again. The labels themselves are built on the server, in
 * lib/curtain-labels.ts.
 */

/** What the curtain shows on its way to a page. */
export type CurtainLabel = { eyebrow: string; title: string };

/** Pathname ("/fr/work/toron") to label: every page the curtain can lead to. */
export type CurtainLabels = Record<string, CurtainLabel>;

/** Fired on window once the curtain has gone and the new page is visible. */
export const CURTAIN_LIFTED = "nullsec:curtain-lifted";

/** True while the curtain covers the screen (data-curtain on <html>). */
export function curtainUp(): boolean {
  return document.documentElement.dataset.curtain === "on";
}

/**
 * Run `fn` now, or once the curtain has lifted if it is covering the screen.
 * For one-shot intros (the boot ticker, the phone sweep), which would
 * otherwise play out unseen under it. Returns a cleanup for the listener.
 */
export function afterCurtain(fn: () => void): () => void {
  if (!curtainUp()) {
    fn();
    return () => {};
  }
  window.addEventListener(CURTAIN_LIFTED, fn, { once: true });
  return () => window.removeEventListener(CURTAIN_LIFTED, fn);
}
