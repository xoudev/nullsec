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
  validates: string;            // one-line summary of what the cert covers
  radar: RadarValues;           // axis values 0–100
};

export const clearances: Clearance[] = [
  {
    status: "PENDING",
    date: "2026.--",
    level: "01",
    title: "CC — CERTIFIED IN CYBERSECURITY",
    issuer: "ISC2",
    credentialId: null,
    credentialUrl: null,
    validates: "security foundations, access controls, network security, incident response",
    radar: {
      GOVERNANCE: 55,
      NETWORK:    45,
      DEFENSE:    60,
      RISK:       65,
      AUDIT:      50,
      COMPLIANCE: 70,
    },
  },
  {
    status: "PENDING",
    date: "2026.--",
    level: "02",
    title: "INTRODUCTION TO THE THREAT LANDSCAPE 3.0",
    issuer: "FORTINET",
    credentialId: null,
    credentialUrl: null,
    validates: "cyber threat landscape, attack vectors, adversary techniques",
    radar: {
      GOVERNANCE: 20,
      NETWORK:    50,
      DEFENSE:    55,
      RISK:       75,
      AUDIT:      15,
      COMPLIANCE: 20,
    },
  },
  {
    status: "PENDING",
    date: "2026.--",
    level: "03",
    title: "GETTING STARTED IN CYBERSECURITY 3.0",
    issuer: "FORTINET",
    credentialId: null,
    credentialUrl: null,
    validates: "cybersecurity fundamentals, risk awareness, defensive postures",
    radar: {
      GOVERNANCE: 30,
      NETWORK:    40,
      DEFENSE:    50,
      RISK:       50,
      AUDIT:      20,
      COMPLIANCE: 35,
    },
  },
  {
    status: "PENDING",
    date: "2026.--",
    level: "04",
    title: "TECHNICAL INTRODUCTION TO CYBERSECURITY 3.0",
    issuer: "FORTINET",
    credentialId: null,
    credentialUrl: null,
    validates: "network security, firewall fundamentals, security architecture basics",
    radar: {
      GOVERNANCE: 15,
      NETWORK:    70,
      DEFENSE:    65,
      RISK:       30,
      AUDIT:      15,
      COMPLIANCE: 20,
    },
  },
  {
    status: "PENDING",
    date: "2026.--",
    level: "05",
    title: "CSNA",
    issuer: "STORMSHIELD",
    credentialId: null,
    credentialUrl: null,
    validates: "stormshield network security, firewall administration, policy management",
    radar: {
      GOVERNANCE: 20,
      NETWORK:    80,
      DEFENSE:    85,
      RISK:       30,
      AUDIT:      10,
      COMPLIANCE: 25,
    },
  },
  {
    status: "PENDING",
    date: "2026.--",
    level: "06",
    title: "CCNA 1",
    issuer: "CISCO",
    credentialId: null,
    credentialUrl: null,
    validates: "network fundamentals, IP addressing, routing and switching essentials",
    radar: {
      GOVERNANCE: 10,
      NETWORK:    95,
      DEFENSE:    40,
      RISK:       15,
      AUDIT:       5,
      COMPLIANCE: 20,
    },
  },
];
