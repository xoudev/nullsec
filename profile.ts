import type { Localized } from "@/lib/i18n";

// Single source of truth for all personal information.
// Never hardcode these values anywhere else in the codebase.
export const profile = {
  // ── Identity ──────────────────────────────────────────────────────────────
  name: "Jordan",
  fullName: "Jordan Turnaco",
  handle: "xoudev",
  age: 21,
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
  cvUrl: "/cv.pdf",
  available: "Sept 2028",
  tagline: { en: "Securing what others overlook.", fr: "Protéger ce que les autres laissent filer." },
  bio: { en: "I don't build fortresses. I map the blind spots.", fr: "Je ne bâtis pas de forteresses : je cartographie les angles morts." },
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
      // RNCP 37796 — "Gestionnaire de la sécurité des données, des réseaux et des systèmes". Starts 14 Sept 2026.
      degree: {
        en: "Mastère Expert Cybersecurity — Offensive / Defensive (RNCP 37796)",
        fr: "Mastère Expert Cybersécurité, volet offensif et défensif (RNCP 37796)",
      },
      school: "Guardia Cybersecurity School",
      period: "2026 – 2028",
    },
    {
      degree: {
        en: "Bachelor Cybersecurity — 3rd year (RNCP level 6)",
        fr: "Bachelor Cybersécurité, 3e année (RNCP niveau 6)",
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
    { name: "CSNA — Stormshield Network Administrator", issuer: "Stormshield", status: "obtained · Mar 2026 · 80%" },
  ],

  // ── Experience ────────────────────────────────────────────────────────────
  experience: [
    {
      title: {
        en: "ISMS / GRC Apprentice — Internal Control",
        fr: "Alternant ISMS / GRC, contrôle interne",
      },
      company: "Arvato",
      period: "Oct 2025 — Sept 2026",
      focus: {
        en: [
          "EBIOS RM risk analyses (GRC, second line)",
          "ISO 27001 / ISREG alignment",
          "PSSI and security-policy drafting",
          "Third-party / supplier security assessments",
          "Vulnerability management via JIRA (CVSS · SLA)",
          "ISMS documentation & on-site sitewalk audits (logistics sites)",
        ],
        fr: [
          "Analyses de risques EBIOS RM (GRC, deuxième ligne de défense)",
          "Mise en conformité ISO 27001 / ISREG",
          "Rédaction de la PSSI et des politiques de sécurité",
          "Évaluation du niveau de sécurité des tiers et des fournisseurs",
          "Gestion des vulnérabilités sous JIRA (CVSS · SLA)",
          "Documentation de l'ISMS et audits de terrain sur les sites logistiques",
        ],
      },
    },
    {
      title: {
        en: "Flutter Development Intern",
        fr: "Stagiaire développeur Flutter",
      },
      company: "AaliaTech",
      period: "Dec 2024 — Feb 2025",
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
      period: "Apr — Jun 2024",
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
