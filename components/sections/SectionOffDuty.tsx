"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { offDutyFeatured, offDutyRows, offDutyEntryCount } from "@/content/offduty";

const MONO = "var(--font-jetbrains-mono)";

export function SectionOffDuty() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const hero = heroRef.current;
    const rows = rowRefs.current.filter(Boolean) as HTMLElement[];

    // Reduced motion (incl. runtime flip): everything visible, no reveal.
    if (prefersReduced) {
      if (hero) gsap.set(hero, { opacity: 1, y: 0 });
      rows.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    if (hero) gsap.set(hero, { opacity: 0, y: 40 });
    rows.forEach((el) => gsap.set(el, { opacity: 0, y: 30 }));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const t = entry.target as HTMLElement;
          if (t === hero) {
            gsap.to(hero, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
          } else {
            const i = rows.indexOf(t);
            gsap.to(t, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: i * 0.06 });
          }
          observer.unobserve(t);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" },
    );

    if (hero) observer.observe(hero);
    rows.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      data-section-id="07"
      aria-label="Off-duty — interests"
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
        <span
          aria-hidden="true"
          style={{ fontFamily: MONO, fontSize: "0.65rem", color: "var(--color-blood)", letterSpacing: "0.1em" }}
        >
          {"07 // OFF-DUTY"}
        </span>
        <span
          aria-hidden="true"
          style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--color-ash)", letterSpacing: "0.1em", whiteSpace: "nowrap" }}
        >
          {`0${offDutyEntryCount} ENTRIES · 00 LICENSES`}
        </span>
      </div>

      {/* ── Featured: Moto ── */}
      <div
        ref={heroRef}
        className="offduty-hero"
        style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)", willChange: "transform, opacity" }}
      >
        <div
          className="offduty-hero-bg"
          aria-hidden="true"
          style={{ backgroundImage: `url(${offDutyFeatured.image})` }}
        />
        <div className="offduty-hero-overlay" aria-hidden="true" />

        {/* HUD corner ticks */}
        <span className="offduty-corner" style={{ top: 10, left: 10, borderTopWidth: 1.5, borderLeftWidth: 1.5 }} />
        <span className="offduty-corner" style={{ top: 10, right: 10, borderTopWidth: 1.5, borderRightWidth: 1.5 }} />
        <span className="offduty-corner" style={{ bottom: 10, left: 10, borderBottomWidth: 1.5, borderLeftWidth: 1.5 }} />
        <span className="offduty-corner" style={{ bottom: 10, right: 10, borderBottomWidth: 1.5, borderRightWidth: 1.5 }} />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "clamp(2rem, 5vw, 4rem)",
            padding: "clamp(1.5rem, 3.5vw, 2.75rem)",
          }}
        >
          {/* top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem" }}>
            <span style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--color-bone)", letterSpacing: "0.15em" }}>
              {"01 / "}{offDutyFeatured.label}
            </span>
            <span style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--color-ash)", letterSpacing: "0.12em" }}>
              {offDutyFeatured.coord}
            </span>
          </div>

          {/* middle — headline + note */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-instrument-serif)",
                fontStyle: "italic",
                fontSize: "clamp(2.2rem, 5.5vw, 4.25rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                color: "var(--color-bone)",
                margin: "0 0 clamp(1rem, 2vw, 1.5rem)",
              }}
            >
              {offDutyFeatured.headline.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < offDutyFeatured.headline.length - 1 && <br />}
                </span>
              ))}
            </h3>
            <p
              style={{
                fontFamily: MONO,
                fontSize: "clamp(0.66rem, 1vw, 0.75rem)",
                lineHeight: 1.7,
                color: "rgba(242,239,232,0.6)",
                letterSpacing: "0.04em",
                margin: 0,
                maxWidth: "32ch",
              }}
            >
              {offDutyFeatured.note}
            </p>
          </div>

          {/* bottom row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "0.75rem 1.5rem",
              fontFamily: MONO,
              fontSize: "0.58rem",
              letterSpacing: "0.12em",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", color: "var(--color-ash)" }}>
              <span aria-hidden="true" style={{ width: 7, height: 7, backgroundColor: "var(--color-blood)", flexShrink: 0 }} />
              {offDutyFeatured.tagline}
            </span>
            <span style={{ color: "rgba(242,239,232,0.78)" }}>{offDutyFeatured.spec}</span>
          </div>
        </div>
      </div>

      {/* ── Rows ── */}
      <div>
        {offDutyRows.map((row, i) => (
          <div
            key={row.title}
            ref={(el) => { rowRefs.current[i] = el; }}
            className="offduty-row"
            style={{ willChange: "transform, opacity" }}
          >
            <span
              aria-hidden="true"
              style={{ fontFamily: MONO, fontSize: "0.7rem", color: "var(--color-ash)", letterSpacing: "0.05em", minWidth: "1.5rem" }}
            >
              {String(i + 2).padStart(2, "0")}
            </span>

            <div>
              <h3
                className="offduty-title"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  fontSize: "clamp(1.5rem, 3.4vw, 2.5rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.01em",
                  color: "var(--color-bone)",
                  margin: "0 0 0.5rem",
                }}
              >
                {row.title}
              </h3>
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: "clamp(0.64rem, 0.95vw, 0.72rem)",
                  color: "var(--color-ash)",
                  letterSpacing: "0.03em",
                  margin: 0,
                }}
              >
                {row.subtitle}
              </p>
            </div>

            <span
              className="offduty-tags"
              aria-hidden="true"
              style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--color-ash)", letterSpacing: "0.08em", whiteSpace: "nowrap" }}
            >
              {row.tags.join("  ·  ")}
              {"   "}
              <span className="offduty-arrow">→</span>
            </span>
          </div>
        ))}
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
        <span>{"// OFF-DUTY"}</span>
        <span>{"// ENV prod.nullsec"}</span>
      </div>
    </section>
  );
}
