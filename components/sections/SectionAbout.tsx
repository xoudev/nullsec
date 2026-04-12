"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { profile } from "@/profile";

export function SectionAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const el = contentRef.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y: 40 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" });
        observer.disconnect();
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      data-section-id="05"
      aria-label="About"
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
        {"05 // ABOUT"}
      </div>

      <div ref={contentRef}>
        {/* Display quote */}
        <p
          aria-label={profile.bio}
          style={{
            fontFamily:    "var(--font-instrument-serif)",
            fontStyle:     "italic",
            fontSize:      "clamp(1.8rem, 4.5vw, 4rem)",
            lineHeight:    1.08,
            color:         "var(--color-bone)",
            letterSpacing: "-0.02em",
            margin:        "0 0 clamp(3rem, 6vw, 5rem)",
            maxWidth:      "24ch",
          }}
        >
          {profile.bio}
        </p>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{
            height:          "1px",
            backgroundColor: "rgba(107,107,107,0.2)",
            marginBottom:    "clamp(3rem, 6vw, 5rem)",
          }}
        />

        {/* Two-column: narrative + key facts */}
        <div className="article-grid">
          {/* Left — editorial body */}
          <div>
            <p
              style={{
                fontFamily:   "var(--font-sans)",
                fontSize:     "clamp(1rem, 1.15vw, 1.1rem)",
                color:        "rgba(242,239,232,0.82)",
                lineHeight:   1.82,
                margin:       "0 0 1.9rem",
              }}
            >
              Three years through computer science and then cybersecurity. The
              development internships came first — interfaces, performance
              work, a migration from WordPress to static HTML. They were
              useful for understanding how systems get built under time
              pressure, which turns out to be directly relevant to
              understanding how they fail. The security focus came after, at
              Guardia, and sharpened into a specific interest: the space
              between compliance documentation and operational reality, where
              most security programmes produce activity rather than outcomes.
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize:   "clamp(1rem, 1.15vw, 1.1rem)",
                color:      "rgba(242,239,232,0.82)",
                lineHeight: 1.82,
                margin:     0,
              }}
            >
              The apprenticeship at Arvato is in ISMS management — security
              policy, IS audits, risk and incident processes. The work is
              governance-layer: translating frameworks into decisions an
              organisation can actually execute, then maintaining the evidence
              that it did. The domains I am building toward are GRC, blue
              team operations, and DevSecOps. The overlap between them is not
              an accident. Policy without operational instrumentation is
              assumption. Detection without governance accountability is noise
              that no one owns. The connective tissue between them is where
              security actually lives.
            </p>
          </div>

          {/* Right — key facts */}
          <aside className="article-sidebar" aria-label="Profile facts">
            {(
              [
                ["LOCATION",   `${profile.city}, ${profile.country}`],
                ["SCHOOL",     "Guardia Cybersecurity School"],
                ["CURRENT",    "ISMS Apprentice @ Arvato"],
                ["FOCUS",      "GRC · Blue Team · DevSecOps"],
                ["AVAILABLE",  profile.available],
              ] as const
            ).map(([label, value]) => (
              <div key={label} style={{ marginBottom: "clamp(1.25rem, 2vw, 1.75rem)" }}>
                <div
                  style={{
                    fontFamily:    "var(--font-jetbrains-mono)",
                    fontSize:      "0.55rem",
                    color:         "var(--color-ash)",
                    letterSpacing: "0.15em",
                    marginBottom:  "0.4rem",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontFamily:    "var(--font-jetbrains-mono)",
                    fontSize:      "0.72rem",
                    color:         "var(--color-bone)",
                    letterSpacing: "0.04em",
                    lineHeight:    1.5,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}

            {/* Ghost year */}
            <div
              aria-hidden="true"
              style={{
                marginTop:     "clamp(2rem, 4vw, 3rem)",
                fontFamily:    "var(--font-instrument-serif)",
                fontStyle:     "italic",
                fontSize:      "clamp(4rem, 7vw, 7rem)",
                lineHeight:    1,
                color:         "rgba(107,107,107,0.12)",
                letterSpacing: "-0.03em",
                userSelect:    "none",
              }}
            >
              {new Date().getFullYear()}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
