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
    projects: en
      ? [
          { name: "CyberLearn", year: "2025", stack: "Next.js · Supabase · PostgreSQL RLS", line: "Full-stack cybersecurity learning platform; row-level-security authorisation, gamification, automated video pipeline.", link: "cyberlearn.fr" },
          { name: "Zero Trust Architecture", year: "2026", stack: "EBIOS RM · Stormshield · Wazuh XDR", line: "Final-year dossier, three-site supply-chain operation: EBIOS RM analysis, 11-VLAN segmentation with a deny-by-default flow matrix, hybrid AD tiering, SIEM and supervision stack.", link: "" },
          { name: "Cryptographic audit (STM32)", year: "2025", stack: "Side-channel · UART/JTAG · Python", line: "Timing attack recovering a password from an early-exit comparison; median-based measurement methodology and hardening report.", link: "" },
          { name: "NULLSEC", year: "2025", stack: "Next.js 16 · GSAP · Typst", line: "This portfolio: typed content as single source of truth; this CV compiles from the same data.", link: "github.com/xoudev/nullsec" },
        ]
      : [
          { name: "CyberLearn", year: "2025", stack: "Next.js · Supabase · PostgreSQL RLS", line: "Plateforme full-stack d'apprentissage de la cybersécurité ; autorisation par Row-Level Security, gamification, pipeline vidéo automatisé.", link: "cyberlearn.fr" },
          { name: "Architecture Zero Trust", year: "2026", stack: "EBIOS RM · Stormshield · Wazuh XDR", line: "Dossier de fin d'études, activité logistique sur trois sites : analyse EBIOS RM, segmentation en 11 VLANs avec matrice de flux en refus par défaut, AD hybride en tiering, socle SIEM et supervision.", link: "" },
          { name: "Audit cryptographique (STM32)", year: "2025", stack: "Canal auxiliaire · UART/JTAG · Python", line: "Attaque temporelle récupérant un mot de passe sur une comparaison à sortie anticipée ; méthodologie de mesure par médiane et rapport de durcissement.", link: "" },
          { name: "NULLSEC", year: "2025", stack: "Next.js 16 · GSAP · Typst", line: "Ce portfolio : contenu typé comme source unique de vérité ; ce CV se compile depuis les mêmes données.", link: "github.com/xoudev/nullsec" },
        ],
    certifications: profile.certifications.map((c) => ({
      name: t(c.name),
      status: t(c.status),
    })),
    certPreparing: en
      ? "In preparation: ISO/IEC 27001 Lead Implementer (target 2027) · CISSP (target 2028)"
      : "En préparation : ISO/IEC 27001 Lead Implementer (objectif 2027) · CISSP (objectif 2028)",
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
    skills: en
      ? [
          { domain: "GRC / Risk", items: "ISO 27001 · EBIOS RM · NIS2 · ISREG · PSSI · risk analysis · vulnerability management (CVSS · SLA) · supplier assessments · security audit" },
          { domain: "Blue team", items: "Stormshield · Wazuh · Wireshark · MITRE ATT&CK · detection engineering · log analysis · incident management" },
          { domain: "Offensive", items: "Burp Suite · Metasploit · Nmap · Kali Linux · OSINT" },
          { domain: "Dev / Infra", items: "TypeScript · Next.js · Python · Docker · Kubernetes · Ansible · CI/CD · Proxmox · Linux · Active Directory · network segmentation / VLANs · IPSec · pfSense" },
        ]
      : [
          { domain: "GRC / Risque", items: "ISO 27001 · EBIOS RM · NIS2 · ISREG · PSSI · analyse de risques · gestion des vulnérabilités (CVSS · SLA) · évaluation des tiers · audit de sécurité" },
          { domain: "Blue team", items: "Stormshield · Wazuh · Wireshark · MITRE ATT&CK · ingénierie de détection · analyse de journaux · gestion des incidents" },
          { domain: "Offensif", items: "Burp Suite · Metasploit · Nmap · Kali Linux · OSINT" },
          { domain: "Dev / Infra", items: "TypeScript · Next.js · Python · Docker · Kubernetes · Ansible · CI/CD · Proxmox · Linux · Active Directory · segmentation réseau / VLAN · IPSec · pfSense" },
        ],
    languagesLine: en
      ? "French (native) · English (C1) · Spanish (B1)"
      : "Français (natif) · Anglais (C1) · Espagnol (B1)",
    footer: en
      ? "compiled from source · github.com/xoudev/nullsec"
      : "compilé depuis les sources · github.com/xoudev/nullsec",
  });
}

// ── Generate data + compile ─────────────────────────────────────────────────
const builddate = new Date().toISOString().slice(0, 10);
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
    inputs: { lang: loc, builddate },
  });
  writeFileSync(join(root, outfile), pdf);
  console.log(`${outfile}: ${pdf.length} bytes`);
}
