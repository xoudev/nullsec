"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { offDutyRows, offDutyEntryCount } from "@/content/offduty";

const MONO = "var(--font-jetbrains-mono)";

export function SectionOffDuty() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReduced = useReducedMotion();

  // ── Scroll-reveal of the rows ──
  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean) as HTMLElement[];

    if (prefersReduced) {
      rows.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
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

  // ── Hover a row → crossfade its image into the section background ──
  useEffect(() => {
    if (prefersReduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rows = rowRefs.current.filter(Boolean) as HTMLElement[];
    const bgs = bgRefs.current;
    bgs.forEach((el) => el && gsap.set(el, { willChange: "opacity" }));

    const enters: Array<() => void> = [];
    const leaves: Array<() => void> = [];
    rows.forEach((row, i) => {
      const enter = () => {
        offDutyRows.forEach((_, k) => {
          const el = bgRefs.current[k];
          if (el) gsap.to(el, { opacity: k === i ? 1 : 0, duration: 0.6, ease: "power2.out", overwrite: "auto" });
        });
      };
      const leave = () => {
        const el = bgRefs.current[i];
        if (el) gsap.to(el, { opacity: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" });
      };
      enters.push(enter);
      leaves.push(leave);
      row.addEventListener("mouseenter", enter);
      row.addEventListener("mouseleave", leave);
    });

    return () => {
      rows.forEach((row, i) => {
        row.removeEventListener("mouseenter", enters[i]);
        row.removeEventListener("mouseleave", leaves[i]);
      });
      bgs.forEach((el) => el && gsap.killTweensOf(el));
    };
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      data-section-id="07"
      aria-label="Off-duty — interests"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-void)",
        padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 4vw, 3rem)",
      }}
    >
      {/* Crossfading background — one darkened image per row, faded in on hover */}
      <div className="offduty-bg" aria-hidden="true">
        {offDutyRows.map((row, i) => (
          <div
            key={row.title}
            ref={(el) => { bgRefs.current[i] = el; }}
            style={{ position: "absolute", inset: 0, opacity: 0 }}
          >
            <Image
              src={row.image}
              alt=""
              fill
              sizes="100vw"
              className="offduty-bg-img"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        ))}
        <div className="offduty-bg-veil" />
      </div>

      {/* Foreground content */}
      <div style={{ position: "relative", zIndex: 1 }}>
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
            {"07 // OFF-DUTY"}
          </span>
          <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--color-ash)", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
            {`${String(offDutyEntryCount).padStart(2, "0")} ENTRIES · 00 LICENSES`}
          </span>
        </div>

        {/* Rows */}
        <div>
          {offDutyRows.map((row, i) => (
            <div
              key={row.title}
              ref={(el) => { rowRefs.current[i] = el; }}
              className="offduty-row"
            >
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
      </div>
    </section>
  );
}
