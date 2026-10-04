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

      {/* The roles as a log along one rail: the current one in full, in
          figures then in entries; the two before it in a line each. */}
      <ol className="exp-list">
        {profile.experience.map((xp, i) => {
          const current = i === 0;
          const focus = t<readonly string[]>(xp.focus);
          return (
            <li
              key={i}
              className="exp-item"
              data-current={current ? "" : undefined}
              data-reveal=""
              style={{ "--reveal-delay": `${i * 0.08}s` } as React.CSSProperties}
            >
              {i === 1 && (
                <span className="exp-divider" aria-hidden="true">
                  {tr("// BEFORE: DEVELOPMENT", "// AVANT : LE DÉVELOPPEMENT")}
                </span>
              )}
              {/* The node on the rail; the current role's one pulses. */}
              <span className="exp-node" aria-hidden="true" />
              <span className="exp-period">
                {t(xp.period)}
                {current && <span className="exp-current">{tr("// CURRENT", "// EN COURS")}</span>}
              </span>
              <div className="exp-what">
                <span className="exp-company">{xp.company}</span>
                <h3 className="exp-title">{t(xp.title)}</h3>
                {"scope" in xp && (
                  <p className="exp-scope">
                    <span>{tr("// SCOPE ", "// PÉRIMÈTRE ")}</span>
                    {t(xp.scope)}
                  </p>
                )}
                {"highlights" in xp && (
                  <ul className="exp-stats" aria-label={tr("In figures", "En chiffres")}>
                    {t<readonly (readonly [string, string])[]>(xp.highlights).map(([n, label]) => (
                      <li key={label}>
                        <span className="exp-stat-n">{n}</span>
                        <span className="exp-stat-l">{label}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {current ? (
                  <ol className="exp-log">
                    {focus.map((f, j) => (
                      <li key={f}>
                        <span className="exp-idx" aria-hidden="true">
                          {String(j + 1).padStart(2, "0")}
                        </span>
                        {f}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="exp-brief">{focus.join("  ·  ")}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <div style={{ borderTop: "1px solid rgba(107,107,107,0.2)", height: 0 }} />

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
