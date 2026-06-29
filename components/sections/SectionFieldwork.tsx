"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { softReveal } from "@/lib/softReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { work } from "@/content/work";

export function SectionFieldwork() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const titleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const indexRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const yearRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prefersReduced = useReducedMotion();

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
    if (bg) { gsap.killTweensOf(bg); gsap.to(bg, { clipPath: "inset(0 0% 0 0)", duration: 0.55, ease: "expo.inOut" }); }
    if (title) { gsap.killTweensOf(title); gsap.to(title, { color: "var(--color-void)", duration: 0.28, ease: "power2.out" }); }
    if (year) { gsap.killTweensOf(year); gsap.to(year, { color: "rgba(10,10,11,0.45)", duration: 0.28, ease: "power2.out" }); }
    if (tag) { gsap.killTweensOf(tag); gsap.to(tag, { color: "rgba(10,10,11,0.45)", duration: 0.28, ease: "power2.out" }); }
    if (idx) { gsap.killTweensOf(idx); gsap.to(idx, { color: "var(--color-blood)", duration: 0.18, ease: "power2.out" }); }
  };

  const handleRowLeave = (i: number) => {
    if (prefersReduced) return;
    const bg = bgRefs.current[i];
    const title = titleRefs.current[i];
    const idx = indexRefs.current[i];
    const year = yearRefs.current[i];
    const tag = tagRefs.current[i];

    if (bg) { gsap.killTweensOf(bg); gsap.to(bg, { clipPath: "inset(0 100% 0 0)", duration: 0.45, ease: "expo.inOut" }); }
    if (title) { gsap.killTweensOf(title); gsap.to(title, { color: "var(--color-bone)", duration: 0.28, ease: "power2.out" }); }
    if (year) { gsap.killTweensOf(year); gsap.to(year, { color: "var(--color-ash)", duration: 0.28, ease: "power2.out" }); }
    if (tag) { gsap.killTweensOf(tag); gsap.to(tag, { color: "var(--color-ash)", duration: 0.28, ease: "power2.out" }); }
    if (idx) { gsap.killTweensOf(idx); gsap.to(idx, { color: "var(--color-ash)", duration: 0.18, ease: "power2.out" }); }
  };

  return (
    <section
      ref={sectionRef}
      data-section-id="02"
      aria-label="Fieldwork"
      style={{
        backgroundColor: "var(--color-void)",
        padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 4vw, 3rem)",
      }}
    >
      {/* Section label */}
      <div
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.65rem",
          color: "var(--color-blood)",
          letterSpacing: "0.1em",
          marginBottom: "clamp(3rem, 6vw, 5rem)",
        }}
      >
        {"02 // FIELDWORK"}
      </div>

      <nav aria-label="Selected projects">
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {work.map((item, i) => (
            <li
              key={item.slug}
              style={{ position: "relative" }}
            >
              {/* Full-row bone wipe — clips from right, reveals left→right on hover */}
              <div
                ref={(el) => { bgRefs.current[i] = el; }}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "var(--color-bone)",
                  clipPath: "inset(0 100% 0 0)",
                  willChange: "clip-path",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />

              <Link
                href={`/work/${item.slug}`}
                ref={(el) => { rowRefs.current[i] = el; }}
                onMouseEnter={() => handleRowEnter(i)}
                onMouseLeave={() => handleRowLeave(i)}
                aria-label={`${item.title} — ${item.year}`}
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
                    fontSize: "clamp(0.65rem, 0.9vw, 0.8rem)",
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
                  <span
                    ref={(el) => { titleRefs.current[i] = el; }}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "clamp(1.05rem, 2.6vw, 2.1rem)",
                      fontWeight: 400,
                      color: "var(--color-bone)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item.title}
                  </span>
                  <span
                    className="hidden md:block"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono)",
                      fontSize: "0.68rem",
                      color: "var(--color-ash)",
                      lineHeight: 1.55,
                      letterSpacing: "0.02em",
                      opacity: 0.75,
                    }}
                  >
                    {item.excerpt}
                  </span>
                </div>

                {/* Tags — visible on md+ */}
                <span
                  ref={(el) => { tagRefs.current[i] = el; }}
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "0.6rem",
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
                    fontSize: "clamp(0.65rem, 0.9vw, 0.8rem)",
                    color: "var(--color-ash)",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  [{item.year}]{"  →"}
                </span>
              </Link>
            </li>
          ))}
          <li style={{ borderTop: "1px solid rgba(107,107,107,0.2)", height: 0 }} />
        </ul>
      </nav>
    </section>
  );
}
