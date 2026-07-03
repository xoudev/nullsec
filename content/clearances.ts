import type { Localized } from "@/lib/i18n";

export const radarAxes = [
  "GOVERNANCE",
  "NETWORK",
  "DEFENSE",
  "RISK",
  "AUDIT",
  "COMPLIANCE",
] as const;

export type RadarAxis  = typeof radarAxes[number];
export type RadarValues = Record<RadarAxis, number>;

export type ClearanceStatus = "GRANTED" | "PENDING" | "EXPIRED" | "REVOKED";

export type Clearance = {
  status: ClearanceStatus;
  date: string;           // display format: YYYY.MM
  level: string;          // zero-padded display number, e.g. "01"
  title: Localized<string>; // FR must avoid em-dashes (owner rule)
  issuer: string;
  credentialId: string | null;
  credentialUrl: string | null; // links to issuer verification page; null = no link
  validates: Localized<string>; // one-line summary of what the cert covers
  radar: RadarValues;           // axis values 0–100
  score?: string;               // optional exam score for an obtained cert, e.g. "80%"
};

export const clearances: Clearance[] = [
  {
    status: "GRANTED",
    date: "2026.03",
    level: "01",
    title: {
      en: "CSNA — STORMSHIELD NETWORK ADMINISTRATOR",
      fr: "CSNA · STORMSHIELD NETWORK ADMINISTRATOR",
    },
    issuer: "STORMSHIELD",
    credentialId: null,
    credentialUrl: null,
    validates: {
      en: "stormshield network security, firewall administration, policy management",
      fr: "sécurité réseau Stormshield, administration des pare-feu, gestion des politiques de filtrage",
    },
    score: "80%",
    radar: {
      GOVERNANCE: 20,
      NETWORK:    80,
      DEFENSE:    85,
      RISK:       30,
      AUDIT:      10,
      COMPLIANCE: 25,
    },
  },
  // Roadmap targets — [PENDING] shows trajectory, which matters as much as the
  // held cert on a 21-year-old profile. Dates are targets, not bookings.
  {
    status: "PENDING",
    date: "→ 2027",
    level: "02",
    title: {
      en: "ISO/IEC 27001 LEAD IMPLEMENTER",
      fr: "ISO/IEC 27001 LEAD IMPLEMENTER",
    },
    issuer: "PECB",
    credentialId: null,
    credentialUrl: null,
    validates: {
      en: "ISMS design and implementation, audit preparation, risk treatment",
      fr: "conception et mise en œuvre d'un SMSI, préparation à l'audit, traitement du risque",
    },
    radar: {
      GOVERNANCE: 85,
      NETWORK:    10,
      DEFENSE:    20,
      RISK:       70,
      AUDIT:      75,
      COMPLIANCE: 90,
    },
  },
  {
    status: "PENDING",
    date: "→ 2027",
    level: "03",
    title: {
      en: "eJPT — JUNIOR PENETRATION TESTER",
      fr: "eJPT · JUNIOR PENETRATION TESTER",
    },
    issuer: "INE SECURITY",
    credentialId: null,
    credentialUrl: null,
    validates: {
      en: "network and web pentesting methodology, enumeration, exploitation basics",
      fr: "méthodologie de pentest réseau et web, énumération, bases de l'exploitation",
    },
    radar: {
      GOVERNANCE: 10,
      NETWORK:    70,
      DEFENSE:    45,
      RISK:       40,
      AUDIT:      30,
      COMPLIANCE: 10,
    },
  },
];
