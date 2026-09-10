
// Single source of truth for all personal information.
// Never hardcode these values anywhere else in the codebase.
export const profile = {
  // ── Identity ──────────────────────────────────────────────────────────────
  name: "Jordan",
  fullName: "Jordan Turnaco",
  handle: "xoudev",
  city: "Paris",
  country: "France",
  nationality: "French",

  // ── Contact ───────────────────────────────────────────────────────────────
  email: "jordan.turnaco.pro@gmail.com",
  github: "https://github.com/xoudev",
  linkedin: "https://www.linkedin.com/in/jordan-turnaco",
  pgpKey: "-----BEGIN PGP PUBLIC KEY BLOCK-----\n" +
      "\n" +
      "mDMEadlopxYJKwYBBAHaRw8BAQdAoBjdI9Lc32mvaevB95cRZddyTY0g1TCuJ2TX\n" +
      "mLNcobO0LVRVUk5BQ08gSm9yZGFuIDxqb3JkYW4udHVybmFjby5wcm9AZ21haWwu\n" +
      "Y29tPoiWBBMWCgA+FiEE4K48bZ6E4Oebu1JUOuDGxgfvwm0FAmnZaKcCGwMFCQWj\n" +
      "moAFCwkIBwIGFQoJCAsCBBYCAwECHgECF4AACgkQOuDGxgfvwm15UwEA7w9EU4fk\n" +
      "jUJ/gHPM+bBinTvipsCCXE+hWO0fxaIoEKEA/jjm04MEUSjZrrx5TV8HdeG0Y5hZ\n" +
      "nQ8RUerYS0mai/wIuDgEadlopxIKKwYBBAGXVQEFAQEHQKZKOnZfIat4j+pU+Hfv\n" +
      "4W/qGpW+njBAqMeXagCR6UolAwEIB4h+BBgWCgAmFiEE4K48bZ6E4Oebu1JUOuDG\n" +
      "xgfvwm0FAmnZaKcCGwwFCQWjmoAACgkQOuDGxgfvwm3q+QEAlRJbmVR/0bDbAZmp\n" +
      "3haA7DEj53jFe/oKAdgjwb2grUAA/jwlXm3ETxh1OK6No8ZXLVE4edxJY588NLwq\n" +
      "Rgpa2E4G\n" +
      "=sho7\n" +
      "-----END PGP PUBLIC KEY BLOCK-----", // paste armored public key here when you have one

  // ── Site ──────────────────────────────────────────────────────────────────
  // Both PDFs compile from this file via scripts/build-cv.mjs. The historical
  // /cv.pdf URL stays French (it always was); EN gets its own file.
  cvUrl: { en: "/cv-en.pdf", fr: "/cv.pdf" },
  available: "Sept 2028",
  tagline: { en: "Securing what others overlook.", fr: "Protéger ce que les autres laissent filer." },
  // Resolves the hero's line instead of repeating it verbatim four viewports later.
  bio: { en: "I don't build fortresses. I find where they leak.", fr: "Je ne bâtis pas de forteresses : je cherche où elles fuient." },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nullsec.fr",

  // ── Languages ─────────────────────────────────────────────────────────────
  languages: [
    { lang: { en: "French", fr: "Français" }, level: { en: "Native", fr: "Natif" } },
    { lang: { en: "English", fr: "Anglais" }, level: { en: "C1", fr: "C1" } },
    { lang: { en: "Spanish", fr: "Espagnol" }, level: { en: "B1", fr: "B1" } },
  ],

  // ── Education ─────────────────────────────────────────────────────────────
  education: [
    {
      // RNCP 42345 "Expert cybersécurité" (level 7) — it replaces RNCP 37796,
      // whose registration lapses 19 July 2026, before this cohort starts on
      // 14 Sept 2026 (source: France Compétences). Confirm with Guardia.
      degree: {
        en: "Mastère Expert Cybersecurity — Offensive / Defensive (RNCP 42345)",
        fr: "Mastère Expert Cybersécurité, volet offensif et défensif (RNCP 42345)",
      },
      school: "Guardia Cybersecurity School",
      period: "2026 – 2028",
    },
    {
      degree: {
        // RNCP 37680 "Administrateur d'infrastructures sécurisées" (level 6),
        // confirmed by the final-year dossier itself.
        en: "Bachelor Cybersecurity — Secure Infrastructure Administrator (RNCP 37680, level 6)",
        fr: "Bachelor Cybersécurité, administrateur d'infrastructures sécurisées (RNCP 37680, niveau 6)",
      },
      school: "Guardia Cybersecurity School",
      period: "2025 – 2026",
    },
    {
      degree: {
        en: "Computer Science — 2nd year · DevOps, systems & networks",
        fr: "Informatique, 2e année · DevOps, systèmes et réseaux",
      },
      school: "EPSI",
      period: "2024 – 2025",
    },
    {
      degree: {
        en: "Computer Science — 1st year · DevOps, systems & networks",
        fr: "Informatique, 1re année · DevOps, systèmes et réseaux",
      },
      school: "EPSI",
      period: "2023 – 2024",
    },
  ],

  // ── Certifications ────────────────────────────────────────────────────────
  certifications: [
    {
      name: {
        en: "CSNA — Stormshield Network Administrator",
        fr: "CSNA · Stormshield Network Administrator",
      },
      issuer: "Stormshield",
      status: {
        en: "obtained · Mar 2026 · 80%",
        fr: "obtenue · mars 2026 · 80 %",
      },
    },
  ],

  // ── Experience ────────────────────────────────────────────────────────────
  experience: [
    {
      // Official Arvato title; the ISMS/GRC scope shows in the focus bullets.
      title: {
        en: "Assistant LISO — Local Information Security Officer",
        fr: "Assistant LISO (Local Information Security Officer)",
      },
      company: "Arvato",
      period: { en: "Oct 2025 — Sept 2028", fr: "oct. 2025 – sept. 2028" },
      focus: {
        en: [
          "5 EBIOS RM risk analyses across five business units, one covering 28 risk scenarios",
          "Wrote the ISSP and the ISMS security policies; ISO 27001 certification roadmap",
          "Built an application register: Microsoft Forms · SharePoint · Power Automate",
          "Security assessment of third parties and critical suppliers",
          "Vulnerability management in JIRA (CVSS · SLA) and ISMS indicator tracking",
          "Field audits across logistics sites · ISREG · ISMS continuous improvement",
        ],
        fr: [
          "5 analyses de risques EBIOS RM sur cinq directions métier, dont une de 28 scénarios",
          "Rédaction de la PSSI et des politiques du SMSI, feuille de route de certification ISO 27001",
          "Construction d'un registre applicatif : Microsoft Forms · SharePoint · Power Automate",
          "Évaluation du niveau de sécurité des tiers et des fournisseurs critiques",
          "Gestion des vulnérabilités sous JIRA (CVSS · SLA) et suivi des indicateurs du SMSI",
          "Audits de terrain sur les sites logistiques · ISREG · amélioration continue du SMSI",
        ],
      },
    },
    {
      title: {
        en: "Flutter Development Intern",
        fr: "Stagiaire développeur Flutter",
      },
      company: "AaliaTech",
      period: { en: "Dec 2024 — Feb 2025", fr: "déc. 2024 – févr. 2025" },
      focus: {
        en: [
          "Responsive Dart/Flutter interfaces",
          "Firebase auth and storage",
          "Performance optimisation and bug fixing",
        ],
        fr: [
          "Développement d'interfaces Dart/Flutter responsives",
          "Authentification et stockage avec Firebase",
          "Optimisation des performances et correction de bugs",
        ],
      },
    },
    {
      title: {
        en: "Web Developer Intern",
        fr: "Stagiaire développeur web",
      },
      company: "Minkey",
      period: { en: "Apr — Jun 2024", fr: "avr. – juin 2024" },
      focus: {
        en: [
          "UI improvement",
          "Performance optimisation",
          "WordPress → HTML/CSS/JS migration",
        ],
        fr: [
          "Refonte de l'interface utilisateur",
          "Optimisation des performances",
          "Migration de WordPress vers HTML/CSS/JS",
        ],
      },
    },
  ],

  // ── Skills ────────────────────────────────────────────────────────────────
  skills: {
    cybersecurity: [
      "Zero Trust Architecture", "ISMS", "GRC", "ISO 27001", "ISREG", "NIS2",
      "EBIOS RM", "MITRE ATT&CK", "Risk management", "Incident management",
      "Vulnerability management (CVSS · SLA)", "PSSI / security policies",
      "Security audit", "Stormshield / firewalling",
    ],
    offensive: [
      "Burp Suite", "Metasploit", "Kali Linux", "Wireshark",
      "Nmap", "cURL", "OSINT",
    ],
    development: [
      "TypeScript", "Next.js 15", "React", "Turborepo", "Supabase",
      "PostgreSQL (RLS)", "Prisma", "Tailwind", "GSAP", "Lenis",
      "Typst", "Remotion + ElevenLabs", "Python", "C#",
    ],
    reverseEngineering: [
      "Static analysis", "Dynamic analysis", "Side-channel",
      "STM32 analysis", "Ghidra", "Hardware analysis",
    ],
    infrastructure: [
      "Proxmox (homelab)", "Docker / containers", "Linux (CachyOS)",
      "Network segmentation", "VLANs", "Firewalls", "VPN", "pfSense",
    ],
    devSecOps: [
      "CI/CD", "Docker", "Kubernetes", "Ansible",
      "Secure pipelines", "Least privilege", "Detection engineering",
    ],
  },
} as const;

export type Profile = typeof profile;
