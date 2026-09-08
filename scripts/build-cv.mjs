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

function build(loc) {
  const t = (v) => pick(loc, v);
  const en = loc === "en";

  return ats({
    role: en
      ? "Cybersecurity — GRC · Blue Team · DevSecOps"
      : "Cybersécurité · GRC · Blue Team · DevSecOps",
    // Factual summary — ATS reads it first. Keyword detail lives in Skills, so
    // this stays two lines and names only the through-line.
    pitch: en
      ? "Assistant LISO (apprenticeship) in Internal Control at Arvato; cybersecurity bachelor at Guardia, Mastère (offensive & defensive) from Sept 2026. Focus: GRC, blue-team detection, and network security."
      : "Assistant LISO en alternance au Contrôle Interne d'Arvato ; Bachelor cybersécurité à Guardia, Mastère (offensif et défensif) dès sept. 2026. Axe : GRC, détection blue team et sécurité réseau.",
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
    experience: profile.experience.map((xp) => ({
      title: t(xp.title),
      company: xp.company,
      period: t(xp.period),
      focus: [...t(xp.focus)],
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
      ...toolkitDomains.map((d) => ({
        domain: t(d.title),
        items: d.entries.map((e) => e.label).join(" · "),
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
