"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { softReveal } from "@/lib/softReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { offDutyRows, offDutyEntryCount } from "@/content/offduty";

const MONO = "var(--font-jetbrains-mono)";

export function SectionOffDuty() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReduced = useReducedMotion();

  // ── Scroll-reveal of the rows ──
  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean) as HTMLElement[];

    if (prefersReduced) {
      rows.forEach((el) => gsap.set(el, { y: 0 }));
      return softReveal(rows);
    }

    rows.forEach((el) => gsap.set(el, { opacity: 0, y: 30 }));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const i = rows.indexOf(entry.target as HTMLElement);
          gsap.to(entry.target, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: i * 0.06 });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );
    rows.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      data-section-id="08"
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
          marginBottom: "clamp(2.5rem, 5vw, 4rem)",
        }}
      >
        <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: "0.65rem", color: "var(--color-blood)", letterSpacing: "0.1em" }}>
          {"08 // OFF-DUTY"}
        </span>
        <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--color-ash)", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
          {`${String(offDutyEntryCount).padStart(2, "0")} ENTRIES · 00 LICENSES`}
        </span>
      </div>

      {/* Rows — each reveals its own image behind it on hover */}
      <div>
        {offDutyRows.map((row, i) => (
          <div
            key={row.title}
            ref={(el) => { rowRefs.current[i] = el; }}
            className="offduty-row"
          >
            {/* Per-row backdrop */}
            <div className="offduty-row-bg" aria-hidden="true">
              <Image
                src={row.image}
                alt=""
                fill
                sizes="100vw"
                className="offduty-bg-img"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
              <div className="offduty-bg-veil" />
            </div>

            {/* Foreground */}
            <div className="offduty-row-inner">
              <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: "0.7rem", color: "var(--color-ash)", letterSpacing: "0.05em", minWidth: "1.5rem" }}>
                {String(i + 1).padStart(2, "0")}
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
                <p style={{ fontFamily: MONO, fontSize: "clamp(0.64rem, 0.95vw, 0.72rem)", color: "var(--color-ash)", letterSpacing: "0.03em", margin: 0 }}>
                  {row.subtitle}
                </p>
              </div>

              <span className="offduty-tags" aria-hidden="true" style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--color-ash)", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                {row.tags.join("  ·  ")}
                {"   "}
                <span className="offduty-arrow">→</span>
              </span>
            </div>
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
