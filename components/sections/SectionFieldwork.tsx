"use client";

import { useEffect, useRef, ViewTransition } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { softReveal } from "@/lib/softReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useT } from "@/lib/i18n";
import { workTitleTransition } from "@/lib/transitions";
import { section, sectionLabel } from "@/lib/sections";
import { orderedWork } from "@/content/work";

// Summary colour at rest: bone at 68 % (8.6:1 on the void).
const EXCERPT_REST = "rgba(242,239,232,0.68)";

export function SectionFieldwork() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const titleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const indexRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const yearRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const excerptRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prefersReduced = useReducedMotion();
  const { t, tr, lp } = useT();

  // Lock initial GSAP state so killTweensOf always has a clean baseline
  useEffect(() => {
    if (prefersReduced) return;
    bgRefs.current.forEach((bg) => {
      if (bg) gsap.set(bg, { clipPath: "inset(0 100% 0 0)" });
    });
    titleRefs.current.forEach((el) => { if (el) gsap.set(el, { color: "var(--color-bone)" }); });
    indexRefs.current.forEach((el) => { if (el) gsap.set(el, { color: "var(--color-ash)" }); });
    yearRefs.current.forEach((el) => { if (el) gsap.set(el, { color: "var(--color-ash)" }); });
    tagRefs.current.forEach((el) => { if (el) gsap.set(el, { color: "var(--color-ash)" }); });
    excerptRefs.current.forEach((el) => { if (el) gsap.set(el, { color: EXCERPT_REST }); });
  }, [prefersReduced]);

  // Staggered scroll-entrance
  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean) as HTMLElement[];
    // Reduced motion (including a runtime flip to "reduce"): no slide/stagger —
    // just a soft opacity fade-in as each row scrolls into view.
    if (prefersReduced) {
      rows.forEach((el) => gsap.set(el, { y: 0 }));
      return softReveal(rows);
    }
    rows.forEach((el) => gsap.set(el, { opacity: 0, y: 48 }));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const i = rows.indexOf(el);
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            delay: i * 0.09,
          });
          observer.unobserve(el);
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -60px 0px" }
    );

    rows.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [prefersReduced]);

  const handleRowEnter = (i: number) => {
    if (prefersReduced) return;
    const bg = bgRefs.current[i];
    const title = titleRefs.current[i];
    const idx = indexRefs.current[i];
    const year = yearRefs.current[i];
    const tag = tagRefs.current[i];

    // Kill any in-flight tweens before starting new ones
    const excerpt = excerptRefs.current[i];

    // Kill any in-flight tweens before starting new ones
    if (bg) {
      gsap.killTweensOf(bg);
      gsap.set(bg, { visibility: "visible" });
      gsap.to(bg, { clipPath: "inset(0 0% 0 0)", duration: 0.55, ease: "expo.inOut" });
    }
    if (title) { gsap.killTweensOf(title); gsap.to(title, { color: "var(--color-void)", duration: 0.28, ease: "power2.out" }); }
    if (year) { gsap.killTweensOf(year); gsap.to(year, { color: "rgba(10,10,11,0.7)", duration: 0.28, ease: "power2.out" }); }
    if (tag) { gsap.killTweensOf(tag); gsap.to(tag, { color: "rgba(10,10,11,0.7)", duration: 0.28, ease: "power2.out" }); }
    if (excerpt) { gsap.killTweensOf(excerpt); gsap.to(excerpt, { color: "rgba(10,10,11,0.75)", duration: 0.28, ease: "power2.out" }); }
    // The bright orange is 2.5:1 on bone; this darker one clears 5:1.
    if (idx) { gsap.killTweensOf(idx); gsap.to(idx, { color: "#B23E00", duration: 0.18, ease: "power2.out" }); }
  };

  const handleRowLeave = (i: number) => {
    if (prefersReduced) return;
    const bg = bgRefs.current[i];
    const title = titleRefs.current[i];
    const idx = indexRefs.current[i];
    const year = yearRefs.current[i];
    const tag = tagRefs.current[i];

    const excerpt = excerptRefs.current[i];

    if (bg) {
      gsap.killTweensOf(bg);
      gsap.to(bg, {
        clipPath: "inset(0 100% 0 0)",
        duration: 0.45,
        ease: "expo.inOut",
        onComplete: () => { gsap.set(bg, { visibility: "hidden" }); },
      });
    }
    if (title) { gsap.killTweensOf(title); gsap.to(title, { color: "var(--color-bone)", duration: 0.28, ease: "power2.out" }); }
    if (year) { gsap.killTweensOf(year); gsap.to(year, { color: "var(--color-ash)", duration: 0.28, ease: "power2.out" }); }
    if (tag) { gsap.killTweensOf(tag); gsap.to(tag, { color: "var(--color-ash)", duration: 0.28, ease: "power2.out" }); }
    if (excerpt) { gsap.killTweensOf(excerpt); gsap.to(excerpt, { color: EXCERPT_REST, duration: 0.28, ease: "power2.out" }); }
    if (idx) { gsap.killTweensOf(idx); gsap.to(idx, { color: "var(--color-ash)", duration: 0.18, ease: "power2.out" }); }
  };

  return (
    <section
      ref={sectionRef}
      id="fieldwork"
      data-section-id={section("fieldwork").id}
      aria-label={tr("Fieldwork", "Travaux de terrain")}
      style={{
        backgroundColor: "var(--color-void)",
        padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 4vw, 3rem)",
        position: "relative",
      }}
    >
      {/* Section label */}
      <div
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.75rem",
          color: "var(--color-blood)",
          letterSpacing: "0.1em",
          marginBottom: "clamp(2rem, 4vw, 3rem)",
        }}
      >
        {tr(sectionLabel("fieldwork", "en"), sectionLabel("fieldwork", "fr"))}
      </div>

      {/* Display line — every chapter opens the same way */}
      <h2
        style={{
          fontFamily: "var(--font-instrument-serif)",
          fontStyle: "italic",
          fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: "var(--color-bone)",
          margin: "0 0 clamp(2.5rem, 5vw, 4rem)",
          maxWidth: "20ch",
        }}
      >
        {tr("Proof over promises.", "Des preuves, pas des promesses.")}
      </h2>

      <nav aria-label={tr("Selected projects", "Projets sélectionnés")}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {orderedWork.map((item, i) => (
            <li
              key={item.slug}
              style={{ position: "relative" }}
            >
              {/* Divider before the first side project. */}
              {item.tier === "side" && orderedWork[i - 1]?.tier !== "side" && (
                <div
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "0.75rem",
                    color: "var(--color-ash)",
                    letterSpacing: "0.14em",
                    padding: "clamp(2.5rem, 5vw, 4rem) 0 clamp(1rem, 2vw, 1.5rem)",
                    borderTop: "1px solid rgba(107,107,107,0.2)",
                  }}
                >
                  {tr("// SIDE PROJECTS · CREATIVE ENGINEERING", "// PROJETS ANNEXES · INGÉNIERIE CRÉATIVE")}
                </div>
              )}
              {/* Row wrapper is the bone wipe's positioning context, so the
                  wipe covers ONLY the row — never the side-projects divider
                  that shares this <li> above it. */}
              <div style={{ position: "relative" }}>
              {/* Full-row bone wipe — clips from right, reveals left→right on hover */}
              <div
                ref={(el) => { bgRefs.current[i] = el; }}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "var(--color-bone)",
                  clipPath: "inset(0 100% 0 0)",
                  // Hidden as well as clipped while at rest: tools that ignore
                  // clip-path (contrast checkers) read every row as text on
                  // bone otherwise. The hover handlers toggle it.
                  visibility: "hidden",
                  willChange: "clip-path",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />

              <Link
                href={lp(`/work/${item.slug}`)}
                ref={(el) => { rowRefs.current[i] = el; }}
                onMouseEnter={() => handleRowEnter(i)}
                onMouseLeave={() => handleRowLeave(i)}
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "clamp(1rem, 3vw, 2.5rem)",
                  padding: "clamp(1.5rem, 3.5vw, 2.5rem) 0",
                  borderTop: "1px solid rgba(107,107,107,0.2)",
                  textDecoration: "none",
                }}
              >
                {/* Index */}
                <span
                  ref={(el) => { indexRefs.current[i] = el; }}
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "clamp(0.75rem, 0.9vw, 0.85rem)",
                    color: "var(--color-ash)",
                    minWidth: "2.5rem",
                    letterSpacing: "0.05em",
                    flexShrink: 0,
                  }}
                >
                  {item.index}
                </span>

                {/* Title + excerpt column */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {/* Morphs into the case study's headline on navigation. */}
                  <ViewTransition name={workTitleTransition(item.slug)}>
                    <span
                      ref={(el) => { titleRefs.current[i] = el; }}
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "clamp(1.05rem, 2.6vw, 2.1rem)",
                        fontWeight: 400,
                        color: "var(--color-bone)",
                        letterSpacing: "0.04em",
                        // A box as tight as the text, so the morph scales the
                        // title, not a full-width strip of empty row.
                        alignSelf: "flex-start",
                      }}
                    >
                      {t(item.title)}
                    </span>
                  </ViewTransition>
                  {/* The short summary (meta.description, at most ~155
                      characters), not the 200 to 340 character excerpt: a list
                      is for scanning, the case study keeps the long version.
                      Set in the sans at a reading size; it used to be grey mono
                      at 10.9 px. Stays visible on mobile: without it the
                      section is nine context-free title rows on a phone. */}
                  <span
                    ref={(el) => { excerptRefs.current[i] = el; }}
                    className="fieldwork-excerpt"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "clamp(0.9375rem, 1.05vw, 1rem)",
                      color: EXCERPT_REST,
                      lineHeight: 1.6,
                      maxWidth: "62ch",
                    }}
                  >
                    {t(item.meta.description)}
                    {/* The link's name is its visible text (title, summary);
                        the year, shown aria-hidden on the right, comes last. */}
                    <span className="sr-only">{`, ${item.year}`}</span>
                  </span>
                </div>

                {/* Tags — visible on md+ */}
                <span
                  ref={(el) => { tagRefs.current[i] = el; }}
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "0.75rem",
                    color: "var(--color-ash)",
                    letterSpacing: "0.04em",
                    gap: "0.5rem",
                  }}
                  className="hidden md:flex"
                >
                  {item.tags.slice(0, 2).join(" · ")}
                </span>

                {/* Year + arrow */}
                <span
                  ref={(el) => { yearRefs.current[i] = el; }}
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "clamp(0.75rem, 0.9vw, 0.85rem)",
                    color: "var(--color-ash)",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  [{item.year}]{"  →"}
                </span>
              </Link>
              </div>
            </li>
          ))}
          <li style={{ borderTop: "1px solid rgba(107,107,107,0.2)", height: 0 }} />
        </ul>
      </nav>
    </section>
  );
}
