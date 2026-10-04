import { profile } from "@/profile";
import { getT } from "@/lib/i18n-static";
import type { Locale } from "@/lib/locale";
import { section, sectionLabel } from "@/lib/sections";

/**
 * The profile as a sheet first, then the story in three parts. The sheet
 * (where, school, post, programme, focus, availability) is what a recruiter
 * scans in ten seconds, so on a phone it comes first, two facts to a line;
 * on a wide screen it is the side column. The story is the same text as
 * before, cut at its own seams into three parts with a heading each, where
 * one block of two long paragraphs ran two and a half screens on a phone.
 */
export function SectionAbout({ l }: { l: Locale }) {
  const { t, tr } = getT(l);

  const facts = [
    [tr("LOCATION", "LIEU"), `${profile.city}, ${profile.country}`],
    [tr("SCHOOL", "ÉCOLE"), "Guardia Cybersecurity School"],
    [tr("CURRENT", "EN POSTE"), tr("ISMS Apprentice @ Arvato", "Alternant SMSI @ Arvato")],
    [tr("PROGRAMME", "FORMATION"), tr("MSc Offensive / Defensive, 2026 — 2028", "Mastère offensif / défensif, 2026 – 2028")],
    [tr("FOCUS", "FOCUS"), tr("DevSecOps & GRC · ISO 27001 · EBIOS RM", "DevSecOps & GRC · ISO 27001 · EBIOS RM")],
    [tr("AVAILABLE", "DISPO"), t(profile.available)],
  ] as const;

  const story = [
    {
      head: tr("// WHERE I COME FROM", "// D'OÙ JE VIENS"),
      text: tr(
        "Two years through computer science at EPSI — DevOps, systems and networks — before cybersecurity at Guardia. The early work was infrastructure and build pipelines, which turns out to be the most direct preparation for security there is: you cannot reason about how a system fails until you have built one under time pressure and watched it strain. The security focus sharpened into a specific interest at Guardia — the space between compliance documentation and operational reality, where most security programmes produce activity rather than outcomes.",
        "Deux ans d'informatique à l'EPSI (DevOps, systèmes et réseaux) avant de basculer sur la cybersécurité à Guardia. J'ai d'abord touché à l'infrastructure et aux pipelines de build, et c'est sans doute la meilleure école de sécurité qui soit : impossible de comprendre comment un système lâche tant qu'on n'en a pas monté un soi-même, dans l'urgence, en le voyant ployer sous la charge. À Guardia, ce goût pour la sécurité s'est mué en une obsession bien précise : ce qui se joue entre la documentation de conformité et le terrain, là où la plupart des programmes de sécurité s'agitent beaucoup pour très peu de résultats.",
      ),
    },
    {
      head: tr("// WHAT I DO", "// CE QUE JE FAIS"),
      text: tr(
        "The apprenticeship at Arvato is second-line GRC inside Internal Control: EBIOS RM risk analyses, ISO 27001 and ISREG alignment, certification readiness and ISMS continuous improvement, PSSI and policy drafting, supplier assessments, vulnerability management. The work is governance-layer — translating frameworks into decisions an organisation can actually execute, then keeping the evidence that it did.",
        "Mon alternance chez Arvato, c'est de la GRC de seconde ligne au sein du Contrôle Interne : analyses de risques EBIOS RM, alignement ISO 27001 et ISREG, préparation à la certification et amélioration continue du SMSI, rédaction de la PSSI et des politiques, évaluation des fournisseurs, gestion des vulnérabilités. Tout se joue au niveau de la gouvernance : transformer des référentiels en décisions qu'une organisation peut vraiment appliquer, puis garder la trace qu'elle l'a fait.",
      ),
    },
    {
      head: tr("// WHERE I AM GOING", "// OÙ JE VAIS"),
      text: tr(
        "What I am building toward is a DevSecOps and GRC profile: enough GRC to be credible on governance, enough engineering to secure the pipelines and the infrastructure the code ships through. Since September 2026 I have been on a Mastère in offensive and defensive cybersecurity, still in apprenticeship at Arvato, through to September 2028. The throughline is secure by design — policy without operational instrumentation is assumption, detection without governance accountability is noise no one owns, and the connective tissue between them is where security actually lives.",
        "Mon cap, c'est un profil DevSecOps et GRC : assez de GRC pour peser sur la gouvernance, assez de technique pour sécuriser les pipelines et l'infrastructure par lesquels passe le code. Depuis septembre 2026, je poursuis un Mastère en cybersécurité offensive et défensive, toujours en alternance chez Arvato, jusqu'en septembre 2028. Le fil rouge reste le secure by design : une politique sans instrumentation opérationnelle n'est qu'un pari, une détection sans gouvernance qui l'assume n'est qu'un bruit dont personne ne répond, et c'est précisément dans ce qui relie les deux que la sécurité prend vraiment corps.",
      ),
    },
  ];

  return (
    <section
      data-section-id={section("about").id}
      aria-label={tr("About", "À propos")}
      style={{
        backgroundColor: "var(--color-void)",
        padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 4vw, 3rem)",
        position: "relative",
      }}
    >
      {/* Section label */}
      <div
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.75rem",
          color: "var(--color-blood)",
          letterSpacing: "0.1em",
          marginBottom: "clamp(3rem, 6vw, 5rem)",
        }}
      >
        {tr(sectionLabel("about", "en"), sectionLabel("about", "fr"))}
      </div>

      <div data-reveal="" style={{ "--reveal-y": "40px", "--reveal-duration": "0.9s" } as React.CSSProperties}>
        {/* Display quote */}
        <p
          aria-label={t(profile.bio)}
          style={{
            fontFamily: "var(--font-instrument-serif)",
            fontStyle: "italic",
            fontSize: "clamp(1.8rem, 4.5vw, 4rem)",
            lineHeight: 1.08,
            color: "var(--color-bone)",
            letterSpacing: "-0.02em",
            margin: "0 0 clamp(3rem, 6vw, 5rem)",
            maxWidth: "24ch",
          }}
        >
          {t(profile.bio)}
        </p>

        <div className="about-grid">
          {/* The sheet. A labelled group, not an <aside>: a complementary
              landmark inside the About region is one landmark nested in
              another. */}
          <dl className="about-facts" aria-label={tr("Profile facts", "Repères du profil")}>
            {facts.map(([label, value]) => (
              <div key={label} className="about-fact">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          {/* The story, in three parts. */}
          <div className="about-story">
            {story.map((part) => (
              <div key={part.head} className="about-part">
                <h3 className="about-part-head" aria-hidden="true">
                  {part.head}
                </h3>
                <p className="about-part-text">{part.text}</p>
              </div>
            ))}
          </div>

          {/* Ghost year: decoration, so generated content (.ghost-year in
              globals.css), like the dispatch ghosts. As DOM text it was
              real text at 1.1:1, a contrast failure aria-hidden does not
              excuse. */}
          <div aria-hidden="true" className="ghost-year about-ghost" data-year={String(new Date().getFullYear())} />
        </div>
      </div>
    </section>
  );
}
