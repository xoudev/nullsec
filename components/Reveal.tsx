"use client";

import { useEffect } from "react";

/**
 * One scroll-reveal for every server-rendered section.
 *
 * The homepage sections used to be client components whose only client code
 * was a GSAP reveal: each hid its own elements at hydration and animated them
 * in on scroll. They are server components now, mark what should reveal with
 * `data-reveal` (and optional --reveal-y / --reveal-delay / --reveal-duration),
 * and this island does the rest with CSS transitions (globals.css).
 *
 * Nothing is hidden before this runs, so without JavaScript, or before
 * hydration, the page is fully visible. Elements already on screen when it
 * runs are marked revealed first, so they never flash out and back in.
 */
export function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])")];
    if (!els.length || !("IntersectionObserver" in window)) return;

    const vh = window.innerHeight;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.setAttribute("data-revealed", "");
    }
    // Arm first, enable the transitions two frames later. Both at once and
    // the browser animates every below-the-fold element from visible to
    // hidden on load: 0.6 s of style recalcs for nothing anyone can see.
    root.classList.add("reveal-armed");
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => root.classList.add("reveal-ready"));
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-revealed", "");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    for (const el of els) if (!el.hasAttribute("data-revealed")) io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      // Off the homepage, nothing must stay armed: a later visit renders the
      // sections fresh and must paint them visible until this runs again.
      root.classList.remove("reveal-armed", "reveal-ready");
    };
  }, []);

  return null;
}
