// Single source of truth for all personal information.
// Never hardcode these values anywhere else in the codebase.
export const profile = {
  // ── Identity ──────────────────────────────────────────────────────────────
  name: "Jordan",
  fullName: "Jordan Turnaco",
  handle: "jordan.sys",
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
  available: "Sept 2026",
  tagline: "Securing what others overlook.",
  bio: "I don't build fortresses. I map the blind spots.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nullsec.fr",

  // ── Languages ─────────────────────────────────────────────────────────────
  languages: [
    { lang: "French", level: "Native" },
    { lang: "English", level: "C1" },
    { lang: "Spanish", level: "B1" },
  ],

  // ── Education ─────────────────────────────────────────────────────────────
  education: [
    {
      degree: "Bachelor Cybersecurity — 3rd year",
      school: "Guardia Cybersecurity School",
      period: "2025 – 2026",
    },
    {
      degree: "Bachelor Computer Science — 2nd year",
      school: "EPSI",
      period: "2024 – 2025",
    },
    {
      degree: "Bachelor Computer Science — 1st year",
      school: "EPSI",
      period: "2023 – 2024",
    },
  ],

  // ── Certifications ────────────────────────────────────────────────────────
  certifications: [
    { name: "CC — Certified in Cybersecurity", issuer: "ISC2", status: "in preparation" },
    { name: "Introduction to the Threat Landscape 3.0", issuer: "Fortinet", status: "in preparation" },
    { name: "Getting Started in Cybersecurity 3.0", issuer: "Fortinet", status: "in preparation" },
    { name: "Technical Introduction to Cybersecurity 3.0", issuer: "Fortinet", status: "in preparation" },
    { name: "CSNA", issuer: "Stormshield", status: "in preparation" },
    { name: "CCNA 1", issuer: "Cisco", status: "in preparation" },
  ],

  // ── Experience ────────────────────────────────────────────────────────────
  experience: [
    {
      title: "ISMS Apprentice",
      company: "Arvato",
      period: "Oct 2025 — Sept 2026",
      focus: [
        "ISMS management and improvement",
        "Security policy implementation",
        "IS audit and compliance",
        "Risk and incident management",
      ],
    },
    {
      title: "Flutter Development Intern",
      company: "AaliaTech",
      period: "Dec 2024 — Feb 2025",
      focus: [
        "Responsive Dart/Flutter interfaces",
        "Firebase auth and storage",
        "Performance optimisation and bug fixing",
      ],
    },
    {
      title: "Web Developer Intern",
      company: "Minkey",
      period: "Apr — Jun 2024",
      focus: [
        "UI improvement",
        "Performance optimisation",
        "WordPress → HTML/CSS/JS migration",
      ],
    },
  ],

  // ── Skills ────────────────────────────────────────────────────────────────
  skills: {
    cybersecurity: [
      "Zero Trust Architecture", "ISMS", "GRC", "ISO 27001", "NIS2",
      "EBIOS RM", "Security audit", "Risk management", "Incident management",
      "Wireshark", "Burp Suite", "Metasploit", "Nmap", "OWASP",
      "Kali Linux", "OSINT",
    ],
    development: [
      "Python", "JavaScript", "PHP", "Dart", "C", "C#", "Java",
      "React", "Next.js", "Vue.js", "MySQL",
    ],
    reverseEngineering: [
      "Ghidra", "Static analysis", "Dynamic analysis",
      "STM32 analysis", "Hardware analysis", "Embedded systems",
    ],
    infrastructure: [
      "Network segmentation", "VLANs", "Firewalls", "VPN",
      "Active Directory", "Linux administration", "VMware",
      "pfSense", "Cisco",
    ],
    devSecOps: [
      "Docker", "Kubernetes", "Jenkins", "GitLab CI/CD",
      "Ansible", "Terraform", "SonarQube", "Snyk",
    ],
  },
} as const;

export type Profile = typeof profile;
