"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { dispatches } from "@/content/dispatches";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function SectionDispatches() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs   = useRef<(HTMLLIElement | null)[]>([]);
  const prefersReduced = useReducedMotion();

  // Staggered entrance via IntersectionObserver
  useEffect(() => {
    if (prefersReduced) return;
    const items = itemRefs.current.filter(Boolean) as HTMLElement[];
    items.forEach((el) => gsap.set(el, { opacity: 0, y: 50 }));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          gsap.to(entry.target, {
            opacity: 1, y: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: "power2.out",
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      data-section-id="06"
      aria-label="Dispatches"
      style={{
        backgroundColor: "var(--color-void)",
        padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 4vw, 3rem)",
      }}
    >
      {/* Section label */}
      <div
        aria-hidden="true"
        style={{
          fontFamily:    "var(--font-jetbrains-mono)",
          fontSize:      "0.65rem",
          color:         "var(--color-blood)",
          letterSpacing: "0.1em",
          marginBottom:  "clamp(3rem, 6vw, 5rem)",
        }}
      >
        06 // DISPATCHES
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }} aria-label="Writing">
        {dispatches.map((post, i) => (
          <li
            key={post.slug}
            ref={(el) => { itemRefs.current[i] = el; }}
            style={{ borderTop: "1px solid rgba(107,107,107,0.2)" }}
          >
            {/* Full-width flex row: text block left, ghost number right */}
            <Link
              href={`/dispatches/${post.slug}`}
              className="dispatch-row"
            >
              {/* ── Text block ── */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Date + read time */}
                <div
                  aria-hidden="true"
                  style={{
                    display:       "flex",
                    gap:           "1.5rem",
                    fontFamily:    "var(--font-jetbrains-mono)",
                    fontSize:      "0.65rem",
                    color:         "var(--color-ash)",
                    letterSpacing: "0.06em",
                    marginBottom:  "0.75rem",
                  }}
                >
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span>{post.readTime}</span>
                </div>

                {/* Title */}
                <h3
                  className="dispatch-title"
                  style={{
                    fontFamily:    "var(--font-instrument-serif)",
                    fontStyle:     "italic",
                    fontSize:      "clamp(1.25rem, 2.5vw, 2rem)",
                    fontWeight:    400,
                    margin:        "0 0 0.75rem",
                    lineHeight:    1.1,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize:   "clamp(0.85rem, 1.1vw, 0.95rem)",
                    color:      "var(--color-ash)",
                    lineHeight: 1.7,
                    margin:     0,
                  }}
                >
                  {post.excerpt}
                </p>
              </div>

              {/* ── Ghost article number ── */}
              <span
                aria-hidden="true"
                className="dispatch-number"
              >
                {String(i + 1).padStart(3, "0")}
              </span>
            </Link>
          </li>
        ))}
        <li style={{ borderTop: "1px solid rgba(107,107,107,0.2)", height: 0 }} />
      </ul>
    </section>
  );
}
