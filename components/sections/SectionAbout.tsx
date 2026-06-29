"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { softReveal } from "@/lib/softReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { profile } from "@/profile";
import { useT } from "@/lib/i18n";

export function SectionAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { t, tr } = useT();

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    // Reduced motion: soft opacity fade-in, no upward slide.
    if (prefersReduced) return softReveal([el]);
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
          aria-label={t(profile.bio)}
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
          {t(profile.bio)}
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
              {tr(
                "Two years through computer science at EPSI — DevOps, systems and networks — before cybersecurity at Guardia. The early work was infrastructure and build pipelines, which turns out to be the most direct preparation for security there is: you cannot reason about how a system fails until you have built one under time pressure and watched it strain. The security focus sharpened into a specific interest at Guardia — the space between compliance documentation and operational reality, where most security programmes produce activity rather than outcomes.",
                "Deux ans d'informatique à l'EPSI (DevOps, systèmes et réseaux) avant de basculer sur la cybersécurité à Guardia. J'ai d'abord touché à l'infrastructure et aux pipelines de build, et c'est sans doute la meilleure école de sécurité qui soit : impossible de comprendre comment un système lâche tant qu'on n'en a pas monté un soi-même, dans l'urgence, en le voyant ployer sous la charge. À Guardia, ce goût pour la sécurité s'est mué en une obsession bien précise : ce qui se joue entre la documentation de conformité et le terrain, là où la plupart des programmes de sécurité s'agitent beaucoup pour très peu de résultats."
              )}
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
              {tr(
                "The apprenticeship at Arvato is second-line GRC inside Internal Control: EBIOS RM risk analyses, ISO 27001 and ISREG alignment, PSSI and policy drafting, supplier assessments, vulnerability management. The work is governance-layer — translating frameworks into decisions an organisation can actually execute, then keeping the evidence that it did. What I am building toward is a hybrid profile: enough GRC to be credible on governance, enough technical depth for detection engineering and pipeline security. A Mastère in offensive and defensive cybersecurity starts in September 2026. The throughline is secure by design — policy without operational instrumentation is assumption, detection without governance accountability is noise no one owns, and the connective tissue between them is where security actually lives.",
                "Mon alternance chez Arvato, c'est de la GRC de seconde ligne au sein du Contrôle Interne : analyses de risques EBIOS RM, mise en conformité ISO 27001 et ISREG, rédaction de la PSSI et des politiques, évaluation des fournisseurs, gestion des vulnérabilités. Tout se joue au niveau de la gouvernance : transformer des référentiels en décisions qu'une organisation peut vraiment appliquer, puis garder la trace qu'elle l'a fait. Mon cap, c'est un profil hybride : assez de GRC pour peser sur la gouvernance, assez de bagage technique pour le detection engineering et la sécurité des pipelines. Un Mastère en cybersécurité offensive et défensive m'attend en septembre 2026. Le fil rouge reste le secure by design : une politique sans instrumentation opérationnelle n'est qu'un pari, une détection sans gouvernance qui l'assume n'est qu'un bruit dont personne ne répond, et c'est précisément dans ce qui relie les deux que la sécurité prend vraiment corps."
              )}
            </p>
          </div>

          {/* Right — key facts */}
          <aside className="article-sidebar" aria-label="Profile facts">
            {(
              [
                [tr("LOCATION", "LIEU"),     `${profile.city}, ${profile.country}`],
                [tr("SCHOOL", "ÉCOLE"),      "Guardia Cybersecurity School"],
                [tr("CURRENT", "EN POSTE"),  tr("ISMS / GRC Apprentice @ Arvato", "Alternant SMSI / GRC @ Arvato")],
                [tr("NEXT", "ENSUITE"),      tr("MSc Offensive / Defensive — Sept 2026", "Mastère offensif / défensif, sept. 2026")],
                [tr("FOCUS", "FOCUS"),       "GRC · Blue Team · DevSecOps"],
                [tr("AVAILABLE", "DISPO"),   profile.available],
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
