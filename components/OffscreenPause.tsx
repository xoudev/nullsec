"use client";

import { useEffect } from "react";

/**
 * Pauses every CSS animation inside a homepage section that is off screen.
 *
 * Some looping animations cannot be handed to the compositor: the pending
 * clearance pulse, for one, cost a style recalculation on every frame for as
 * long as the tab stayed open, with its section nowhere near the viewport.
 * Rather than chase them one by one, each section is marked `data-offscreen`
 * while it is out of view, and globals.css pauses all animations under that
 * attribute. They play while someone can see them and sleep otherwise.
 *
 * The attribute is only ever added by this observer, so before hydration (and
 * without JavaScript) nothing is paused and the first paint is unaffected.
 */
export function OffscreenPause() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[data-section-id]");
    if (!sections.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.removeAttribute("data-offscreen");
          else e.target.setAttribute("data-offscreen", "");
        }
      },
      { rootMargin: "200px 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return null;
}
