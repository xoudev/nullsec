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
  /** How the CV names a target (scripts/build-cv.mjs), when the display
   *  title is too long or set in capitals. Defaults to the title. */
  cvName?: string;
  /** When it lapses, YYYY.MM like `date`: a certification is a dated claim. */
  expires?: string;
  /** The certificate itself, when it can be shown: the PDF under /public,
   *  its page count, its first page as an image (the entry's exhibit, under
   *  public/docs/covers) and its language when it has only one. Read in the
   *  site's reader, /<locale>/docs/<file name> (lib/documents.ts). */
  document?: { href: string; pages: number; cover: string; lang?: "en" | "fr" };
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
    // Issued 2026-05-19, three years.
    expires: "2029.05",
    document: {
      href: "/docs/certificat-csna.pdf",
      pages: 1,
      cover: "/docs/covers/certificat-csna.jpg",
      lang: "en",
    },
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
    cvName: "ISO/IEC 27001 Lead Implementer",
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
];
