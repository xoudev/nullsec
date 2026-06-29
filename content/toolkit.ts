// Competence domains for the Toolkit section (03).
// Data-driven, mirrors the "content as data" pattern used by work / dispatches.
// `proof` is a short, truthful evidence line revealed on hover/focus; omit when
// there is nothing concrete to point at rather than inventing one.
// `proofHref` links to an internal case study when the skill is demonstrated there.

export type ToolkitEntry = {
  label: string;
  proof?: string;
  proofHref?: string;
};

export type ToolkitDomain = {
  title: string; // display title, e.g. "GRC / RISK"
  entries: ToolkitEntry[];
};

export const toolkitDomains: ToolkitDomain[] = [
  {
    title: "GRC / RISK",
    entries: [
      { label: "EBIOS RM", proof: "Risk analyses · Arvato + Space GRC Mission", proofHref: "/work/space-grc-mission" },
      { label: "ISO 27001", proof: "ISMS alignment · Arvato + Space GRC Mission", proofHref: "/work/space-grc-mission" },
      { label: "NIS2", proof: "NIS2 compliance · Arvato" },
      { label: "MITRE ATT&CK", proof: "Threat modelling & detection mapping" },
      { label: "Vulnerability Mgmt (CVSS)", proof: "Vuln management via JIRA · Arvato" },
      { label: "PSSI & Policy", proof: "Security-policy drafting · Arvato" },
      { label: "Training & Awareness", proof: "Creation of training · Arvato" },
    ],
  },
  {
    title: "BLUE TEAM / DEFENSE",
    entries: [
      { label: "Stormshield", proof: "CSNA certified · firewalling" },
      { label: "Wazuh", proof: "SIEM in the homelab", proofHref: "/work/homelab-proxmox" },
      { label: "Zabbix", proof: "Monitoring in the homelab", proofHref: "/work/homelab-proxmox" },
      { label: "Wireshark", proof: "Traffic analysis · labs & CTF" },
      { label: "Log & Traffic Analysis", proof: "Detection engineering · homelab", proofHref: "/work/homelab-proxmox" },
    ],
  },
  {
    title: "OFFENSIVE / RECON",
    entries: [
      { label: "Burp Suite", proof: "Web pentest labs · Root-Me" },
      { label: "Metasploit", proof: "Exploitation labs · Root-Me" },
      { label: "Kali", proof: "Daily offensive toolkit" },
      { label: "Nmap", proof: "Recon & service mapping" },
      { label: "cURL", proof: "API testing & recon" },
      { label: "OSINT", proof: "Footprinting & recon" },
    ],
  },
  {
    title: "ENGINEERING / WEB",
    entries: [
      { label: "TypeScript", proof: "CyberLearn · NULLSEC", proofHref: "/work/cyberlearn" },
      { label: "Next.js", proof: "CyberLearn · NULLSEC", proofHref: "/work/cyberlearn" },
      { label: "React", proof: "CyberLearn · NULLSEC", proofHref: "/work/cyberlearn" },
      { label: "Turborepo", proof: "CyberLearn monorepo", proofHref: "/work/cyberlearn" },
      { label: "Supabase", proof: "CyberLearn backend", proofHref: "/work/cyberlearn" },
      { label: "PostgreSQL", proof: "RLS hardening · CyberLearn", proofHref: "/work/cyberlearn" },
      { label: "Prisma", proof: "Data layer · CyberLearn", proofHref: "/work/cyberlearn" },
      { label: "Tailwind", proof: "NULLSEC · CyberLearn", proofHref: "/work/nullsec" },
      { label: "GSAP", proof: "Motion · NULLSEC", proofHref: "/work/nullsec" },
      { label: "Lenis", proof: "Smooth scroll · NULLSEC", proofHref: "/work/nullsec" },
      { label: "Typst", proof: "CV-as-code · NULLSEC", proofHref: "/work/nullsec" },
    ],
  },
  {
    title: "INFRA / DEVSECOPS",
    entries: [
      { label: "Docker", proof: "Containerised services" },
      { label: "Kubernetes", proof: "Orchestration labs" },
      { label: "Ansible", proof: "Provisioning automation" },
      { label: "CI/CD", proof: "Secure pipelines" },
      { label: "Proxmox", proof: "Homelab hypervisor", proofHref: "/work/homelab-proxmox" },
      { label: "Linux", proof: "CachyOS daily driver · homelab", proofHref: "/work/homelab-proxmox" },
      { label: "Git", proof: "Version control everywhere" },
    ],
  },
];

export const toolkitEntryCount = toolkitDomains.reduce(
  (n, d) => n + d.entries.length,
  0,
);
