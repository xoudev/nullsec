"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { profile } from "@/profile";

const MONO = "var(--font-jetbrains-mono)";

export function SectionExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const entries = entryRefs.current.filter(Boolean) as HTMLElement[];

    if (prefersReduced) {
      entries.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    entries.forEach((el) => gsap.set(el, { opacity: 0, y: 30 }));
    const observer = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = entries.indexOf(e.target as HTMLElement);
          gsap.to(e.target, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: i * 0.08 });
          observer.unobserve(e.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );
    entries.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      data-section-id="06"
      aria-label="Experience"
      style={{
        backgroundColor: "var(--color-void)",
        padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 4vw, 3rem)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "1rem",
          marginBottom: "clamp(2rem, 4vw, 3rem)",
        }}
      >
        <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: "0.65rem", color: "var(--color-blood)", letterSpacing: "0.1em" }}>
          {"06 // EXPERIENCE"}
        </span>
        <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--color-ash)", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
          {`${String(profile.experience.length).padStart(2, "0")} ROLES · 2024 — 2026`}
        </span>
      </div>

      {/* Display line */}
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
        From shipping features to securing them.
      </h2>

      {/* Entries */}
      <div>
        {profile.experience.map((xp, i) => {
          const current = i === 0;
          return (
            <div
              key={xp.company}
              ref={(el) => { entryRefs.current[i] = el; }}
              className="exp-entry"
              style={{ willChange: "transform, opacity" }}
            >
              {/* Period */}
              <div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.62rem",
                    color: "var(--color-ash)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    lineHeight: 1.5,
                  }}
                >
                  {xp.period}
                </div>
                {current && (
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: "0.55rem",
                      color: "var(--color-blood)",
                      letterSpacing: "0.12em",
                      marginTop: "0.5rem",
                    }}
                  >
                    {"// CURRENT"}
                  </div>
                )}
              </div>

              {/* Content */}
              <div
                style={{
                  borderLeft: current
                    ? "2px solid var(--color-blood)"
                    : "2px solid rgba(107,107,107,0.25)",
                  paddingLeft: "clamp(1rem, 2vw, 1.5rem)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 700,
                    fontSize: "clamp(1.15rem, 2.2vw, 1.7rem)",
                    lineHeight: 1.2,
                    letterSpacing: "-0.01em",
                    color: "var(--color-bone)",
                    margin: "0 0 0.4rem",
                  }}
                >
                  {xp.title}
                </h3>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.68rem",
                    color: "var(--color-blood)",
                    letterSpacing: "0.06em",
                    marginBottom: "clamp(0.9rem, 2vw, 1.25rem)",
                  }}
                >
                  {xp.company}
                </div>

                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {xp.focus.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "baseline", gap: "0.7rem" }}>
                      <span
                        aria-hidden="true"
                        style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "var(--color-blood)", flexShrink: 0, transform: "translateY(-0.15em)" }}
                      />
                      <span
                        style={{
                          fontFamily: MONO,
                          fontSize: "clamp(0.66rem, 0.95vw, 0.74rem)",
                          color: "rgba(242,239,232,0.7)",
                          letterSpacing: "0.02em",
                          lineHeight: 1.6,
                        }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
        <div style={{ borderTop: "1px solid rgba(107,107,107,0.2)", height: 0 }} />
      </div>

      {/* Footer */}
      <div
        aria-hidden="true"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "clamp(1.5rem, 3vw, 2.5rem)",
          fontFamily: MONO,
          fontSize: "0.6rem",
          color: "rgba(107,107,107,0.5)",
          letterSpacing: "0.08em",
        }}
      >
        <span>{"// EXPERIENCE"}</span>
        <span>{"// ENV prod.nullsec"}</span>
      </div>
    </section>
  );
}
