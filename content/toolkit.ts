// Competence domains for the Toolkit section (03).
// Data-driven, mirrors the "content as data" pattern used by work / dispatches.
// `proof` is a short, truthful evidence line revealed on hover/focus; omit when
// there is nothing concrete to point at rather than inventing one.
// `proofHref` links to an internal case study when the skill is demonstrated there.

import type { Localized } from "@/lib/i18n";

export type ToolkitEntry = {
  label: string;
  proof?: Localized<string>;
  proofHref?: string;
};

export type ToolkitDomain = {
  title: Localized<string>; // display title, e.g. "GRC / RISK"
  entries: ToolkitEntry[];
};

export const toolkitDomains: ToolkitDomain[] = [
  {
    title: { en: "GRC / RISK", fr: "GRC / RISQUE" },
    entries: [
      {
        label: "EBIOS RM",
        proof: {
          en: "Risk analyses · Arvato + Space GRC Mission",
          fr: "Analyses de risques · Arvato + Space GRC Mission",
        },
        proofHref: "/work/space-grc-mission",
      },
      {
        label: "ISO 27001",
        proof: {
          en: "ISMS alignment · Arvato + Space GRC Mission",
          fr: "Alignement du SMSI · Arvato + Space GRC Mission",
        },
        proofHref: "/work/space-grc-mission",
      },
      {
        label: "NIS2",
        proof: {
          en: "NIS2 compliance · Arvato",
          fr: "Conformité NIS2 · Arvato",
        },
      },
      {
        label: "MITRE ATT&CK",
        proof: {
          en: "Threat modelling & detection mapping",
          fr: "Modélisation des menaces et cartographie des détections",
        },
      },
      {
        label: "Vulnerability Mgmt (CVSS)",
        proof: {
          en: "Vuln management via JIRA · Arvato",
          fr: "Gestion des vulnérabilités via JIRA · Arvato",
        },
      },
      {
        label: "PSSI & Policy",
        proof: {
          en: "Security-policy drafting · Arvato",
          fr: "Rédaction de la politique de sécurité · Arvato",
        },
      },
      {
        label: "Training & Awareness",
        proof: {
          en: "Creation of training · Arvato",
          fr: "Création de formations · Arvato",
        },
      },
    ],
  },
  {
    title: { en: "BLUE TEAM / DEFENSE", fr: "BLUE TEAM / DÉFENSE" },
    entries: [
      {
        label: "Stormshield",
        proof: {
          en: "CSNA certified · firewalling",
          fr: "Certifié CSNA · pare-feu",
        },
      },
      {
        label: "Wazuh",
        proof: {
          en: "SIEM in the homelab",
          fr: "SIEM dans le homelab",
        },
        proofHref: "/work/homelab-proxmox",
      },
      {
        label: "Zabbix",
        proof: {
          en: "Monitoring in the homelab",
          fr: "Supervision dans le homelab",
        },
        proofHref: "/work/homelab-proxmox",
      },
      {
        label: "Wireshark",
        proof: {
          en: "Traffic analysis · labs & CTF",
          fr: "Analyse du trafic · labs et CTF",
        },
      },
      {
        label: "Log & Traffic Analysis",
        proof: {
          en: "Detection engineering · homelab",
          fr: "Ingénierie de détection · homelab",
        },
        proofHref: "/work/homelab-proxmox",
      },
    ],
  },
  {
    title: { en: "OFFENSIVE / RECON", fr: "OFFENSIF / RECONNAISSANCE" },
    entries: [
      {
        label: "Burp Suite",
        proof: {
          en: "Web pentest labs · Root-Me",
          fr: "Labs de pentest web · Root-Me",
        },
      },
      {
        label: "Metasploit",
        proof: {
          en: "Exploitation labs · Root-Me",
          fr: "Labs d'exploitation · Root-Me",
        },
      },
      {
        label: "Kali",
        proof: {
          en: "Daily offensive toolkit",
          fr: "Arsenal offensif du quotidien",
        },
      },
      {
        label: "Nmap",
        proof: {
          en: "Recon & service mapping",
          fr: "Reconnaissance et cartographie de services",
        },
      },
      {
        label: "cURL",
        proof: {
          en: "API testing & recon",
          fr: "Test d'API et reconnaissance",
        },
      },
      {
        label: "OSINT",
        proof: {
          en: "Footprinting & recon",
          fr: "Prise d'empreinte et reconnaissance",
        },
      },
    ],
  },
  {
    title: { en: "ENGINEERING / WEB", fr: "INGÉNIERIE / WEB" },
    entries: [
      {
        label: "TypeScript",
        proof: {
          en: "CyberLearn · NULLSEC",
          fr: "CyberLearn · NULLSEC",
        },
        proofHref: "/work/cyberlearn",
      },
      {
        label: "Next.js",
        proof: {
          en: "CyberLearn · NULLSEC",
          fr: "CyberLearn · NULLSEC",
        },
        proofHref: "/work/cyberlearn",
      },
      {
        label: "React",
        proof: {
          en: "CyberLearn · NULLSEC",
          fr: "CyberLearn · NULLSEC",
        },
        proofHref: "/work/cyberlearn",
      },
      {
        label: "Turborepo",
        proof: {
          en: "CyberLearn monorepo",
          fr: "Monorepo CyberLearn",
        },
        proofHref: "/work/cyberlearn",
      },
      {
        label: "Supabase",
        proof: {
          en: "CyberLearn backend",
          fr: "Backend CyberLearn",
        },
        proofHref: "/work/cyberlearn",
      },
      {
        label: "PostgreSQL",
        proof: {
          en: "RLS hardening · CyberLearn",
          fr: "Durcissement RLS · CyberLearn",
        },
        proofHref: "/work/cyberlearn",
      },
      {
        label: "Prisma",
        proof: {
          en: "Data layer · CyberLearn",
          fr: "Couche de données · CyberLearn",
        },
        proofHref: "/work/cyberlearn",
      },
      {
        label: "Tailwind",
        proof: {
          en: "NULLSEC · CyberLearn",
          fr: "NULLSEC · CyberLearn",
        },
        proofHref: "/work/nullsec",
      },
      {
        label: "GSAP",
        proof: {
          en: "Motion · NULLSEC",
          fr: "Animations · NULLSEC",
        },
        proofHref: "/work/nullsec",
      },
      {
        label: "Lenis",
        proof: {
          en: "Smooth scroll · NULLSEC",
          fr: "Défilement fluide · NULLSEC",
        },
        proofHref: "/work/nullsec",
      },
      {
        label: "Typst",
        proof: {
          en: "CV-as-code · NULLSEC",
          fr: "CV-as-code · NULLSEC",
        },
        proofHref: "/work/nullsec",
      },
    ],
  },
  {
    title: { en: "INFRA / DEVSECOPS", fr: "INFRA / DEVSECOPS" },
    entries: [
      {
        label: "Docker",
        proof: {
          en: "Containerised services",
          fr: "Services conteneurisés",
        },
      },
      {
        label: "Kubernetes",
        proof: {
          en: "Orchestration labs",
          fr: "Labs d'orchestration",
        },
      },
      {
        label: "Ansible",
        proof: {
          en: "Provisioning automation",
          fr: "Automatisation du provisionnement",
        },
      },
      {
        label: "CI/CD",
        proof: {
          en: "Secure pipelines",
          fr: "Pipelines sécurisés",
        },
      },
      {
        label: "Proxmox",
        proof: {
          en: "Homelab hypervisor",
          fr: "Hyperviseur du homelab",
        },
        proofHref: "/work/homelab-proxmox",
      },
      {
        label: "Linux",
        proof: {
          en: "CachyOS daily driver · homelab",
          fr: "CachyOS au quotidien · homelab",
        },
        proofHref: "/work/homelab-proxmox",
      },
      {
        label: "Git",
        proof: {
          en: "Version control everywhere",
          fr: "Gestion de versions sur tous les projets",
        },
      },
    ],
  },
];

export const toolkitEntryCount = toolkitDomains.reduce(
  (n, d) => n + d.entries.length,
  0,
);
