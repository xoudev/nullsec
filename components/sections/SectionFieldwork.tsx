import { getT } from "@/lib/i18n-static";
import type { Locale } from "@/lib/locale";
import { section, sectionLabel } from "@/lib/sections";
import { DossierGrid, dossierCount } from "@/components/DossierGrid";

/**
 * The projects as case files (components/DossierGrid), under the section's
 * head: the label, the display line and the count of files and exhibits.
 */
export function SectionFieldwork({ l }: { l: Locale }) {
  const { tr } = getT(l);

  return (
    <section
      id="fieldwork"
      data-section-id={section("fieldwork").id}
      aria-label={tr("Fieldwork", "Travaux de terrain")}
      style={{
        "--gutter": "clamp(1.5rem, 4vw, 3rem)",
        backgroundColor: "var(--color-void)",
        padding: "clamp(4rem, 8vw, 8rem) var(--gutter)",
        position: "relative",
      } as React.CSSProperties}
    >
      {/* Section label */}
      <div
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.75rem",
          color: "var(--color-blood)",
          letterSpacing: "0.1em",
          marginBottom: "clamp(2rem, 4vw, 3rem)",
        }}
      >
        {tr(sectionLabel("fieldwork", "en"), sectionLabel("fieldwork", "fr"))}
      </div>

      <div className="dossiers-head">
        {/* Display line — every chapter opens the same way */}
        <h2
          style={{
            fontFamily: "var(--font-instrument-serif)",
            fontStyle: "italic",
            fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "var(--color-bone)",
            margin: 0,
            maxWidth: "20ch",
          }}
        >
          {tr("Proof over promises.", "Des preuves, pas des promesses.")}
        </h2>
        <p className="dossiers-count" aria-hidden="true">
          {dossierCount(l)}
        </p>
      </div>

      <DossierGrid l={l} />
    </section>
  );
}
