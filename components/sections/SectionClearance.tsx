"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, loadScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clearances } from "@/content/clearances";
import type { ClearanceStatus } from "@/content/clearances";
import { ClearanceRadar } from "@/components/sections/ClearanceRadar";

function statusColor(status: ClearanceStatus): string {
  switch (status) {
    case "GRANTED":          return "var(--color-bone)";
    case "PENDING":          return "var(--color-blood)";
    case "EXPIRED":
    case "REVOKED":          return "var(--color-ash)";
  }
}

export function SectionClearance() {
  const sectionRef    = useRef<HTMLElement>(null);
  const entryRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const ruleRefs      = useRef<(HTMLSpanElement | null)[]>([]);
  const validateRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReduced = useReducedMotion();

  // ── Radar active cert (null = show aggregate) ───────────────────
  const [activeCertIndex, setActiveCertIndex] = useState<number | null>(null);

  // ── Mobile IntersectionObserver: most-visible entry drives radar ─
  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const entries = entryRefs.current.filter(Boolean) as HTMLDivElement[];
    const ratioMap = new Map<Element, number>();

    const observer = new IntersectionObserver(
      (ioEntries) => {
        ioEntries.forEach(e => ratioMap.set(e.target, e.intersectionRatio));
        let max = 0;
        let maxIdx = -1;
        entries.forEach((el, i) => {
          const r = ratioMap.get(el) ?? 0;
          if (r > max) { max = r; maxIdx = i; }
        });
        if (maxIdx >= 0) setActiveCertIndex(maxIdx);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1.0] },
    );

    entries.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── GSAP: initial states + scroll reveal ────────────────────────
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    validateRefs.current.forEach((el) => {
      if (!el) return;
      gsap.set(el, isMobile || prefersReduced
        ? { height: "auto", opacity: 1 }
        : { height: 0,      opacity: 0 });
    });

    if (prefersReduced) return;

    entryRefs.current.forEach((el) => {
      if (el) gsap.set(el, { x: -40, opacity: 0 });
    });
    ruleRefs.current.forEach((el) => {
      if (el) gsap.set(el, { scaleX: 0 });
    });

    let isMounted = true;
    let ctx: ReturnType<typeof gsap.context> | undefined;

    loadScrollTrigger().then((ScrollTrigger) => {
      if (!isMounted) return;

      ctx = gsap.context(() => {
        const entries = entryRefs.current.filter(Boolean) as HTMLElement[];
        if (entries.length) {
          gsap.to(entries, {
            x: 0, opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              toggleActions: "play none none none",
            },
          });
        }

        ruleRefs.current.forEach((rule, i) => {
          if (!rule) return;
          gsap.to(rule, {
            scaleX: 1,
            duration: 0.8,
            ease: "power3.out",
            delay: i * 0.15 + 0.2,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              toggleActions: "play none none none",
            },
          });
        });
      });
    });

    return () => { isMounted = false; ctx?.revert(); };
  }, [prefersReduced]);

  // ── Hover: validates expand/collapse + radar update (desktop) ────
  const handleEnter = (i: number) => {
    if (window.innerWidth < 768) return;
    setActiveCertIndex(i);
    if (prefersReduced) return;
    const el = validateRefs.current[i];
    if (el) gsap.to(el, { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" });
  };

  const handleLeave = (i: number) => {
    if (window.innerWidth < 768) return;
    setActiveCertIndex(null);
    if (prefersReduced) return;
    const el = validateRefs.current[i];
    if (el) gsap.to(el, { height: 0, opacity: 0, duration: 0.2, ease: "power2.in" });
  };

  return (
    <section
      ref={sectionRef}
      data-section-id="04"
      aria-label="Clearance — Certifications"
      style={{
        backgroundColor: "var(--color-void)",
        padding: "clamp(5rem, 9vw, 8rem) clamp(1.5rem, 4vw, 3rem)",
      }}
    >
      {/* Section header */}
      <div style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
        <div
          aria-hidden="true"
          style={{
            fontFamily:    "var(--font-jetbrains-mono)",
            fontSize:      "0.65rem",
            color:         "var(--color-blood)",
            letterSpacing: "0.1em",
            marginBottom:  "1.25rem",
          }}
        >
          {"04 // CLEARANCE"}
        </div>
        <div
          aria-label="Trust is earned, then documented."
          style={{
            fontFamily:    "var(--font-instrument-serif)",
            fontStyle:     "italic",
            fontSize:      "clamp(2rem, 5vw, 4rem)",
            lineHeight:    1.05,
            color:         "var(--color-bone)",
            letterSpacing: "-0.02em",
          }}
        >
          Trust is earned,
          <br />
          then documented.
        </div>
      </div>

      {/* Two-column grid: entries left, radar right */}
      <div className="clearance-grid">

        {/* ── Left: cert entries ── */}
        <div
          className="clearance-entries-col"
          style={{
            display:       "flex",
            flexDirection: "column",
            gap:           "clamp(1.75rem, 3.5vw, 2.75rem)",
          }}
        >
          {clearances.map((item, i) => {
            const isPending  = item.status === "PENDING";
            const isInactive = item.status === "EXPIRED" || item.status === "REVOKED";

            return (
              <div
                key={i}
                ref={(el) => { entryRefs.current[i] = el; }}
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={() => handleLeave(i)}
                className={isPending ? "clearance-pending" : undefined}
                style={{
                  borderLeft:  isPending
                    ? "2px solid var(--color-blood)"
                    : "2px solid rgba(107,107,107,0.22)",
                  paddingLeft: "clamp(1rem, 2vw, 1.5rem)",
                }}
              >
                {/* Status / date / rule / level row */}
                <div
                  aria-hidden="true"
                  style={{
                    display:       "flex",
                    alignItems:    "center",
                    gap:           "0.75rem",
                    marginBottom:  "0.55rem",
                    fontFamily:    "var(--font-jetbrains-mono)",
                    fontSize:      "0.58rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  <span style={{ color: statusColor(item.status), flexShrink: 0 }}>
                    [{item.status}]
                  </span>
                  <span style={{ color: "var(--color-ash)", flexShrink: 0 }}>
                    {item.date}
                  </span>

                  {/* Animated horizontal rule */}
                  <span
                    ref={(el) => { ruleRefs.current[i] = el; }}
                    aria-hidden="true"
                    style={{
                      flex:            1,
                      display:         "block",
                      height:          "1px",
                      backgroundColor: "rgba(107,107,107,0.25)",
                      transformOrigin: "left center",
                    }}
                  />

                  <span style={{ color: "var(--color-ash)", flexShrink: 0 }}>
                    LEVEL {item.level}
                  </span>
                </div>

                {/* Title */}
                <div
                  style={{
                    fontFamily:     "var(--font-jetbrains-mono)",
                    fontSize:       "clamp(0.85rem, 1.6vw, 1.1rem)",
                    color:          isInactive ? "var(--color-ash)" : "var(--color-bone)",
                    letterSpacing:  "0.04em",
                    textDecoration: isInactive ? "line-through" : "none",
                    marginBottom:   "0.3rem",
                  }}
                >
                  {item.title}
                </div>

                {/* Issuer + credential ID */}
                <div
                  style={{
                    fontFamily:    "var(--font-jetbrains-mono)",
                    fontSize:      "0.63rem",
                    color:         "var(--color-ash)",
                    letterSpacing: "0.04em",
                    marginBottom:  "0.2rem",
                  }}
                >
                  {item.issuer}
                  {item.credentialId && (
                    <>
                      {" · Credential ID: "}
                      {item.credentialUrl ? (
                        <a
                          href={item.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "var(--color-blood)", textDecoration: "underline" }}
                        >
                          {item.credentialId}
                        </a>
                      ) : (
                        item.credentialId
                      )}
                    </>
                  )}
                </div>

                {/* Validates — animated reveal on desktop hover, always visible on mobile */}
                <div
                  ref={(el) => { validateRefs.current[i] = el; }}
                  style={{ overflow: "hidden" }}
                  aria-label={`Validates: ${item.validates}`}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      fontFamily:    "var(--font-jetbrains-mono)",
                      fontSize:      "0.6rem",
                      color:         "rgba(107,107,107,0.7)",
                      letterSpacing: "0.04em",
                      paddingTop:    "0.3rem",
                    }}
                  >
                    {`// validates: ${item.validates}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Right: sticky radar ── */}
        <div className="clearance-radar-col">
          <ClearanceRadar
            clearances={clearances}
            activeCertIndex={activeCertIndex}
            prefersReduced={prefersReduced}
          />
        </div>

      </div>
    </section>
  );
}
