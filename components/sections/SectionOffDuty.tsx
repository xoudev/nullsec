"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { softReveal } from "@/lib/softReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useT } from "@/lib/i18n";
import { offDutyRows, offDutyEntryCount } from "@/content/offduty";

const MONO = "var(--font-jetbrains-mono)";

export function SectionOffDuty() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReduced = useReducedMotion();
  const { t, tr } = useT();

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
      aria-label={tr("Off-duty: interests", "Hors service : centres d'intérêt")}
      style={{
        backgroundColor: "var(--color-void)",
        padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 4vw, 3rem)",
        position: "relative",
      }}
    >
      <span aria-hidden="true" className="ghost-numeral">08</span>

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
          {"08 // OFF-DUTY"}
        </span>
        <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--color-ash)", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
          {`${String(offDutyEntryCount).padStart(2, "0")} ${tr("ENTRIES · 00 LICENSES", "ENTRÉES · 00 PERMIS")}`}
        </span>
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
          maxWidth: "22ch",
        }}
      >
        {tr("Same focus, different targets.", "La même concentration, d'autres cibles.")}
      </h2>

      {/* Rows — each reveals its own image behind it on hover */}
      <div>
        {offDutyRows.map((row, i) => (
          <div
            key={row.image}
            ref={(el) => { rowRefs.current[i] = el; }}
            className="offduty-row"
          >
            {/* Per-row backdrop */}
            <div className="offduty-row-bg" aria-hidden="true">
              <Image
                src={row.image}
                alt=""
                fill
                // Veiled backdrops: q50 is indistinguishable here, and capping
                // the srcset stops DPR-2 laptops fetching 3840px variants.
                sizes="(max-width: 1920px) 100vw, 1920px"
                quality={50}
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
                  {t(row.title)}
                </h3>
                <p className="offduty-subtitle" style={{ fontFamily: MONO, fontSize: "clamp(0.64rem, 0.95vw, 0.72rem)", color: "var(--color-ash)", letterSpacing: "0.03em", margin: 0 }}>
                  {t(row.subtitle)}
                </p>
              </div>

              {/* No arrow here: these rows don't navigate — the image reveal is
                  the reward, and a sliding → promised a link that never came. */}
              <span className="offduty-tags" aria-hidden="true" style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--color-ash)", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                {t(row.tags).join("  ·  ")}
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
          color: "var(--color-ash)",
          letterSpacing: "0.08em",
        }}
      >
        <span>{"// OFF-DUTY"}</span>
        <span>{"// ENV prod.nullsec"}</span>
      </div>
    </section>
  );
}
