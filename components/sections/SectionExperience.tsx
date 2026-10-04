import { profile } from "@/profile";
import { getT } from "@/lib/i18n-static";
import type { Locale } from "@/lib/locale";
import { section, sectionLabel } from "@/lib/sections";

const MONO = "var(--font-jetbrains-mono)";

// Server component: the entries reveal on scroll through data-reveal
// (components/Reveal.tsx), not through a GSAP effect of their own.
export function SectionExperience({ l }: { l: Locale }) {
  const { t, tr } = getT(l);

  return (
    <section
      data-section-id={section("experience").id}
      aria-label={tr("Experience", "Expérience")}
      style={{
        backgroundColor: "var(--color-void)",
        padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 4vw, 3rem)",
        position: "relative",
      }}
    >
      {/* Header: label, count and display line (.sec-head in globals.css
          keeps the count out of the HUD's corner). */}
      <div className="sec-head" style={{ rowGap: "clamp(2rem, 4vw, 3rem)", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
        <span aria-hidden="true" className="sec-label" style={{ fontFamily: MONO, fontSize: "0.75rem", color: "var(--color-blood)", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
          {tr(sectionLabel("experience", "en"), sectionLabel("experience", "fr"))}
        </span>
        <span aria-hidden="true" className="sec-count" style={{ fontFamily: MONO, fontSize: "0.75rem", color: "var(--color-ash)", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
          {`${String(profile.experience.length).padStart(2, "0")} ${tr("ROLES · SINCE 2024", "RÔLES · DEPUIS 2024")}`}
        </span>
        {/* Display line */}
        <h2
          className="sec-title"
          style={{
            fontFamily: "var(--font-instrument-serif)",
            fontStyle: "italic",
            fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "var(--color-bone)",
            margin: 0,
            maxWidth: "20ch",
            textWrap: "balance",
          }}
        >
          {tr("From shipping features to securing them.", "Du développement à la GRC, sans lâcher le code.")}
        </h2>
      </div>

      {/* Entries — meta (left) + responsibilities (right) */}
      <div>
        {profile.experience.map((xp, i) => {
          const current = i === 0;
          return (
            <div
              key={xp.company}
              className="exp-entry"
              data-reveal=""
              style={{ "--reveal-delay": `${i * 0.08}s` } as React.CSSProperties}
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
                <span style={{ fontFamily: MONO, fontSize: "0.75rem", color: "var(--color-ash)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {t(xp.period)}
                  {current && (
                    <span style={{ color: "var(--color-blood)", marginLeft: "0.9rem" }}>{tr("// CURRENT", "// EN COURS")}</span>
                  )}
                </span>
                <span style={{ fontFamily: MONO, fontSize: "0.75rem", color: "var(--color-blood)", letterSpacing: "0.08em" }}>
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
                {t(xp.title)}
              </h3>

              {"scope" in xp && (
                <p
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.8rem",
                    color: "var(--color-ash)",
                    letterSpacing: "0.04em",
                    margin: "-0.35rem 0 clamp(1.1rem, 2.2vw, 1.6rem)",
                  }}
                >
                  <span style={{ color: "var(--color-blood)" }}>{tr("// SCOPE ", "// PÉRIMÈTRE ")}</span>
                  {t(xp.scope)}
                </p>
              )}

              {/* Responsibilities — inline flow, capped measure so lines stay
                  readable on very wide viewports */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem 1.75rem", maxWidth: "110ch" }}>
                {t<readonly string[]>(xp.focus).map((f) => (
                  <span
                    key={f}
                    style={{
                      display: "inline-flex",
                      alignItems: "baseline",
                      gap: "0.5rem",
                      fontFamily: MONO,
                      fontSize: "clamp(0.8rem, 0.9vw, 0.875rem)",
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
          fontSize: "0.75rem",
          color: "var(--color-ash)",
          letterSpacing: "0.08em",
        }}
      >
        <span>{`// ${tr(section("experience").en, section("experience").fr)}`}</span>
        <span>{"// ENV prod.nullsec"}</span>
      </div>
    </section>
  );
}
