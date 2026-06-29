"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { softReveal } from "@/lib/softReveal";
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
      entries.forEach((el) => gsap.set(el, { y: 0 }));
      return softReveal(entries);
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

      {/* Entries — meta (left) + responsibilities (right) */}
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
              {/* Meta row — period anchored left, company anchored right */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: "0.5rem 1.5rem",
                  marginBottom: "clamp(0.85rem, 1.8vw, 1.25rem)",
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: "0.62rem", color: "var(--color-ash)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {xp.period}
                  {current && (
                    <span style={{ color: "var(--color-blood)", marginLeft: "0.9rem" }}>{"// CURRENT"}</span>
                  )}
                </span>
                <span style={{ fontFamily: MONO, fontSize: "0.65rem", color: "var(--color-blood)", letterSpacing: "0.08em" }}>
                  {xp.company}
                </span>
              </div>

              {/* Big serif title — spans the row */}
              <h3
                style={{
                  fontFamily: "var(--font-instrument-serif)",
                  fontSize: "clamp(1.9rem, 4.2vw, 3.3rem)",
                  fontWeight: 400,
                  lineHeight: 1.05,
                  letterSpacing: "-0.015em",
                  color: "var(--color-bone)",
                  margin: "0 0 clamp(1.1rem, 2.2vw, 1.6rem)",
                }}
              >
                {xp.title}
              </h3>

              {/* Responsibilities — flow inline, wrapping across the full width */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem 1.75rem" }}>
                {xp.focus.map((f) => (
                  <span
                    key={f}
                    style={{
                      display: "inline-flex",
                      alignItems: "baseline",
                      gap: "0.5rem",
                      fontFamily: MONO,
                      fontSize: "clamp(0.66rem, 0.9vw, 0.76rem)",
                      color: "rgba(242,239,232,0.72)",
                      letterSpacing: "0.02em",
                      lineHeight: 1.6,
                    }}
                  >
                    <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "var(--color-blood)", flexShrink: 0, transform: "translateY(-0.1em)" }} />
                    {f}
                  </span>
                ))}
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
