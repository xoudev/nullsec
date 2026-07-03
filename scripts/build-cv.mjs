// CV-as-code, for real: extracts the CV data from the site's typed content
// (profile.ts is the single source of truth) and compiles cv/cv.typ to PDF
// in both languages.
//
//   node scripts/build-cv.mjs
//
// Requires @myriaddreamin/typst-ts-node-compiler (not a project dependency —
// install it where you run this, e.g. `npm i -g` or a scratch folder, and set
// NODE_PATH accordingly). Outputs: public/cv-en.pdf and public/cv.pdf (FR,
// keeping the historical URL French as it always was).

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

function build(loc) {
  const t = (v) => pick(loc, v);
  const en = loc === "en";

  return {
    role: en
      ? "Cybersecurity — GRC · Blue Team · DevSecOps"
      : "Cybersécurité · GRC · Blue Team · DevSecOps",
    pitch: en
      ? "ISMS / GRC apprentice in Internal Control at Arvato; cybersecurity bachelor at Guardia. Building a hybrid profile: governance credible enough to decide, technical depth deep enough to verify."
      : "Alternant SMSI / GRC au Contrôle Interne d'Arvato ; Bachelor cybersécurité à Guardia. Un profil hybride : assez de gouvernance pour décider, assez de technique pour vérifier.",
    availability: en
      ? "APPRENTICE @ ARVATO UNTIL SEPT 2026 · MASTÈRE 2026–2028 · FULL-TIME FROM SEPT 2028"
      : "ALTERNANT @ ARVATO JUSQU'À SEPT. 2026 · MASTÈRE 2026-2028 · TEMPS PLEIN DÈS SEPT. 2028",
    contact: {
      email: profile.email,
      location: `${profile.city}, ${en ? profile.country : "France"}`,
    },
    labels: en
      ? { experience: "Experience", projects: "Selected projects", certifications: "Certifications", education: "Education", skills: "Skills", languages: "Languages" }
      : { experience: "Expérience", projects: "Projets choisis", certifications: "Certifications", education: "Formation", skills: "Compétences", languages: "Langues" },
    experience: profile.experience.map((xp) => ({
      title: t(xp.title),
      company: xp.company,
      period: t(xp.period),
      focus: [...t(xp.focus)],
    })),
    projects: en
      ? [
          { name: "CyberLearn", year: "2025", stack: "Next.js · Supabase · PostgreSQL RLS", line: "Full-stack cybersecurity learning platform; row-level-security authorisation, gamification, automated video pipeline.", link: "cyberlearn.fr" },
          { name: "Zero Trust Architecture", year: "2025", stack: "NIST SP 800-207 · OPNsense · Wazuh", line: "Migration design for a multi-site logistics company: identity stack (Step-CA, Authentik, Teleport), inter-VLAN matrix, 3-year TCO, NIS2 art. 21 mapping.", link: "" },
          { name: "Cryptographic audit (STM32)", year: "2025", stack: "Side-channel · UART/JTAG · Python", line: "Timing attack recovering a password from an early-exit comparison; median-based measurement methodology and hardening report.", link: "" },
          { name: "NULLSEC", year: "2025", stack: "Next.js 16 · GSAP · Typst", line: "This portfolio: typed content as single source of truth; this CV compiles from the same data.", link: "github.com/xoudev/nullsec" },
        ]
      : [
          { name: "CyberLearn", year: "2025", stack: "Next.js · Supabase · PostgreSQL RLS", line: "Plateforme full-stack d'apprentissage de la cybersécurité ; autorisation par Row-Level Security, gamification, pipeline vidéo automatisé.", link: "cyberlearn.fr" },
          { name: "Architecture Zero Trust", year: "2025", stack: "NIST SP 800-207 · OPNsense · Wazuh", line: "Conception de migration pour une entreprise logistique multi-sites : pile d'identité (Step-CA, Authentik, Teleport), matrice inter-VLAN, TCO sur 3 ans, cartographie NIS2 art. 21.", link: "" },
          { name: "Audit cryptographique (STM32)", year: "2025", stack: "Canal auxiliaire · UART/JTAG · Python", line: "Attaque temporelle récupérant un mot de passe sur une comparaison à sortie anticipée ; méthodologie de mesure par médiane et rapport de durcissement.", link: "" },
          { name: "NULLSEC", year: "2025", stack: "Next.js 16 · GSAP · Typst", line: "Ce portfolio : contenu typé comme source unique de vérité ; ce CV se compile depuis les mêmes données.", link: "github.com/xoudev/nullsec" },
        ],
    certifications: profile.certifications.map((c) => ({
      name: t(c.name),
      status: t(c.status),
    })),
    education: profile.education.map((e) => ({
      degree: t(e.degree),
      school: e.school,
      period: e.period,
    })),
    skills: en
      ? [
          { domain: "GRC / Risk", items: "ISO 27001 · EBIOS RM · NIS2 · ISREG · PSSI · vulnerability mgmt (CVSS · SLA) · supplier assessments" },
          { domain: "Blue team", items: "Stormshield · Wazuh · Wireshark · MITRE ATT&CK · detection engineering · log analysis" },
          { domain: "Offensive", items: "Burp Suite · Metasploit · Nmap · Kali · OSINT" },
          { domain: "Dev / Infra", items: "TypeScript · Next.js · Python · Docker · Kubernetes · Ansible · Proxmox · Linux · segmentation / VLANs" },
        ]
      : [
          { domain: "GRC / Risque", items: "ISO 27001 · EBIOS RM · NIS2 · ISREG · PSSI · gestion des vulnérabilités (CVSS · SLA) · évaluation des tiers" },
          { domain: "Blue team", items: "Stormshield · Wazuh · Wireshark · MITRE ATT&CK · ingénierie de détection · analyse de journaux" },
          { domain: "Offensif", items: "Burp Suite · Metasploit · Nmap · Kali · OSINT" },
          { domain: "Dev / Infra", items: "TypeScript · Next.js · Python · Docker · Kubernetes · Ansible · Proxmox · Linux · segmentation / VLAN" },
        ],
    languages: profile.languages.map((l) => ({
      name: t(l.lang),
      level: t(l.level),
    })),
    footer: en
      ? "compiled from source — github.com/xoudev/nullsec"
      : "compilé depuis les sources · github.com/xoudev/nullsec",
  };
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
