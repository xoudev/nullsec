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
  title: string;
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
    title: "CSNA — STORMSHIELD NETWORK ADMINISTRATOR",
    issuer: "STORMSHIELD",
    credentialId: null,
    credentialUrl: null,
    validates: {
      en: "stormshield network security, firewall administration, policy management",
      fr: "sécurité réseau Stormshield, administration de pare-feu, gestion des politiques",
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
];
