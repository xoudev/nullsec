import { getT } from "@/lib/i18n-static";
import type { Locale } from "@/lib/locale";
import { section, sectionLabel } from "@/lib/sections";
import { offDutyRows, offDutyEntryCount } from "@/content/offduty";
import { OffDutyScope } from "@/components/OffDutyScope";

const MONO = "var(--font-jetbrains-mono)";

export function SectionOffDuty({ l }: { l: Locale }) {
  const { t, tr } = getT(l);

  return (
    <section
      data-section-id={section("offduty").id}
      aria-label={tr("Off-duty: interests", "Hors service : centres d'intérêt")}
      style={{
        backgroundColor: "var(--color-void)",
        padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 4vw, 3rem)",
        position: "relative",
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
        <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: "0.75rem", color: "var(--color-blood)", letterSpacing: "0.1em" }}>
          {tr(sectionLabel("offduty", "en"), sectionLabel("offduty", "fr"))}
        </span>
        <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: "0.75rem", color: "var(--color-ash)", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
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

      {/* The interests as targets, and a scope that acquires the one picked
          (components/OffDutyScope): the display line above, taken at its word. */}
      <OffDutyScope
        targets={offDutyRows.map((row) => ({
          title: t(row.title),
          subtitle: t(row.subtitle),
          tags: t(row.tags),
          subject: t(row.subject),
          image: row.image,
          focus: row.focus,
        }))}
        labels={{
          list: tr("Interests", "Centres d'intérêt"),
          standby: tr("STANDBY", "EN ATTENTE"),
          acquiring: tr("ACQUIRING…", "ACQUISITION…"),
          scanning: tr("SCANNING…", "BALAYAGE…"),
          locked: tr("TARGET LOCKED", "CIBLE VERROUILLÉE"),
          subject: tr("SUBJECT", "SUJET"),
        }}
      />

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
        <span>{`// ${tr(section("offduty").en, section("offduty").fr)}`}</span>
        <span>{"// ENV prod.nullsec"}</span>
      </div>
    </section>
  );
}
