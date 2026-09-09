// CV-as-code, for real: extracts the CV data from the site's typed content
// (profile.ts is the single source of truth) and compiles cv/cv.typ to PDF
// in both languages.
//
//   node scripts/build-cv.mjs
//
// Requires @myriaddreamin/typst-ts-node-compiler (not a project dependency —
// install it where you run this, e.g. a scratch folder, and set NODE_PATH
// accordingly). Outputs: public/cv-en.pdf and public/cv.pdf (FR, keeping the
// historical URL French as it always was).

import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const { profile } = await import(join(root, "profile.ts"));
const { work } = await import(join(root, "content/work.ts"));
const { toolkitDomains } = await import(join(root, "content/toolkit.ts"));
const { NodeCompiler } = require("@myriaddreamin/typst-ts-node-compiler");

// ── Per-language data assembly ──────────────────────────────────────────────
const pick = (loc, v) => (typeof v === "object" && v !== null && "en" in v ? v[loc] : v);

// ATS hardening: some parsers choke on em/en dashes — plain hyphens in the
// PDF, while the site keeps its typography.
const ats = (v) => {
  if (typeof v === "string") return v.replace(/\s*[—–]\s*/g, " - ");
  if (Array.isArray(v)) return v.map(ats);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, ats(x)]));
  return v;
};

// Contact and project entries carry both halves: `label` is what is printed
// (and what an ATS parses), `url` is what the PDF link annotation points at.
// Deriving one from the other here keeps profile.ts and content/work.ts free
// of duplicated protocol prefixes.
const linkFrom = (url) => ({ label: url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, ""), url });
const urlFrom = (label) => ({ label, url: `https://${label}` });

// ── Projects and skills come from the site's content, not from this file ────
// The CV used to carry its own hardcoded copy of both. When content/work.ts was
// corrected, the CV kept advertising the old version: the published PDF still
// described a Zero Trust project that had never been delivered. The single
// source of truth now runs all the way to the PDF.
const cvProjects = work
  .filter((w) => w.cv)
  .sort((a, b) => a.cv.order - b.cv.order);

for (const w of cvProjects) {
  const stray = w.cv.stack.filter((x) => !w.tags.includes(x));
  if (stray.length > 0) {
    throw new Error(
      `${w.slug}: cv.stack items are not in tags: ${stray.join(", ")}. ` +
        "Fix the tags or the stack — the CV must not claim a technology the site does not.",
    );
  }
}

// ── Skills: a selection, not the whole toolkit ──────────────────────────────
// The CV used to print all six toolkit domains, 44 entries. That reads as
// exposure, not command: nobody believes a junior masters 44 technologies, and
// the GRC lines it is actually hired for were buried among build tools. The CV
// now carries four domains and 24 entries, GRC first.
//
// It is a selection, never an addition: every label below must exist in
// content/toolkit.ts, asserted at build time, so the CV still cannot claim a
// technology the site does not show.
const CV_SKILLS = [
  {
    domain: { en: "GRC / Risk", fr: "GRC / Risque" },
    labels: ["EBIOS RM", "ISO 27001", "NIS2", "PSSI & Policy", "Vulnerability Mgmt (CVSS)", "MITRE ATT&CK", "Training & Awareness"],
  },
  {
    domain: { en: "GRC tooling", fr: "Outils GRC" },
    labels: ["JIRA", "SharePoint", "Power Automate"],
  },
  {
    domain: { en: "Blue team / Network", fr: "Blue team / Réseau" },
    labels: ["Stormshield", "Wazuh", "Wireshark", "Log & Traffic Analysis", "Active Directory", "VLAN Segmentation", "MFA & Privileged Access"],
  },
  {
    domain: { en: "Engineering", fr: "Ingénierie" },
    labels: ["TypeScript", "Next.js", "React", "PostgreSQL", "Docker", "CI/CD", "Linux"],
  },
];

const toolkitLabels = new Set(toolkitDomains.flatMap((d) => d.entries.map((e) => e.label)));
for (const g of CV_SKILLS) {
  const stray = g.labels.filter((l) => !toolkitLabels.has(l));
  if (stray.length > 0) {
    throw new Error(
      `CV skills not present in content/toolkit.ts: ${stray.join(", ")}. ` +
        "Add them to the site's toolkit or drop them — the CV must not claim a technology the site does not.",
    );
  }
}

function build(loc) {
  const t = (v) => pick(loc, v);
  const en = loc === "en";

  return ats({
    role: en ? "Cybersecurity — GRC & ISMS" : "Cybersécurité · GRC & SMSI",
    // Factual summary — ATS reads it first. Keyword detail lives in Skills, so
    // this stays two lines and names only the through-line.
    pitch: en
      ? "Assistant LISO (apprenticeship), second line of defence at Arvato: building and improving an ISMS, from EBIOS RM risk analysis to ISO 27001 compliance, policy and third-party assessment. Mastère (offensive & defensive) from Sept 2026."
      : "Assistant LISO en alternance, deuxième ligne de défense chez Arvato : construction et amélioration continue du SMSI, de l'analyse de risques EBIOS RM à la conformité ISO 27001, aux politiques et à l'évaluation des tiers. Mastère offensif et défensif dès sept. 2026.",
    availability: en
      ? "APPRENTICE @ ARVATO UNTIL SEPT 2028 · MASTÈRE 2026-2028 · FULL-TIME FROM SEPT 2028"
      : "ALTERNANT @ ARVATO JUSQU'À SEPT. 2028 · MASTÈRE 2026-2028 · TEMPS PLEIN DÈS SEPT. 2028",
    contact: {
      email: profile.email,
      location: `${profile.city}, ${en ? profile.country : "France"}`,
      site: linkFrom(profile.siteUrl),
      github: linkFrom(profile.github),
      linkedin: linkFrom(profile.linkedin),
    },
    labels: en
      ? { experience: "Experience", projects: "Projects", certifications: "Certifications", education: "Education", skills: "Skills", languages: "Languages" }
      : { experience: "Expérience", projects: "Projets", certifications: "Certifications", education: "Formation", skills: "Compétences", languages: "Langues" },
    // Only the current role is worth bullets on one page. The two 2024/2025
    // dev internships predate the cybersecurity track and were each taking
    // three lines, so Projects ended up rivalling Experience for weight; they
    // collapse to a single summary line here. The site keeps the full detail —
    // it has the room, a one-page CV does not.
    experience: profile.experience.map((xp, i) => ({
      title: t(xp.title),
      company: xp.company,
      period: t(xp.period),
      focus: i === 0 ? [...t(xp.focus)] : [t(xp.focus).join(en ? "; " : " ; ")],
    })),
    projects: cvProjects.map((w) => ({
      name: t(w.cv.name),
      year: w.year,
      stack: w.cv.stack.join(" · "),
      line: t(w.cv.line),
      link: w.cv.link ? urlFrom(w.cv.link) : null,
    })),
    certifications: profile.certifications.map((c) => ({
      name: t(c.name),
      status: t(c.status),
    })),
    certPreparing: en
      ? "Certification targets: ISO/IEC 27001 Lead Implementer 2027 · CISSP 2028"
      : "Objectifs de certification : ISO/IEC 27001 Lead Implementer 2027 · CISSP 2028",
    // The RNCP level is dropped here only: the code identifies the diploma on
    // its own, and the extra ", level 6" pushed the degree onto a second line,
    // leaving a two-character widow. The site keeps the full label.
    // The two EPSI years collapse into one CV row — same data, one page.
    education: [
      ...profile.education
        .filter((e) => e.school !== "EPSI")
        .map((e) => ({
          degree: t(e.degree).replace(/,\s*(?:level|niveau)\s*\d+/i, ""),
          school: e.school,
          period: e.period,
        })),
      {
        degree: en
          ? "Computer Science — 1st & 2nd year · DevOps, systems & networks"
          : "Informatique, 1re et 2e année · DevOps, systèmes et réseaux",
        school: "EPSI",
        period: "2023 – 2025",
      },
    ],
    // Languages ride in the skills grid rather than owning a section header:
    // one line of content does not earn a heading, a rule and its spacing, and
    // a language IS a competence.
    skills: [
      ...CV_SKILLS.map((g) => ({
        domain: t(g.domain),
        items: g.labels.join(" · "),
      })),
      {
        domain: en ? "Languages" : "Langues",
        items: en
          ? "French (native) · English (C1) · Spanish (B1)"
          : "Français (natif) · Anglais (C1) · Espagnol (B1)",
      },
    ],
  });
}

// ── Generate data + compile ─────────────────────────────────────────────────
const compiler = NodeCompiler.create({
  workspace: join(root, "cv"),
  fontArgs: [{ fontPaths: [join(root, "cv", "fonts")] }],
});

for (const [loc, outfile] of [
  ["en", "public/cv-en.pdf"],
  ["fr", "public/cv.pdf"],
]) {
  writeFileSync(join(root, "cv", `data-${loc}.json`), JSON.stringify(build(loc), null, 1));
  const pdf = compiler.pdf({
    mainFilePath: join(root, "cv", "cv.typ"),
    inputs: { lang: loc },
  });
  writeFileSync(join(root, outfile), pdf);
  console.log(`${outfile}: ${pdf.length} bytes`);
}
