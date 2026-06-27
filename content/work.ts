export type WorkItem = {
  slug: string;
  index: string;
  title: string;
  year: string;
  tags: string[];
  excerpt: string;
  body: string[];   // paragraphs of editorial copy
  image?: string;   // optional path relative to /public — omit when no asset exists yet
  liveUrl?: string; // optional public / live site link
};

export const work: WorkItem[] = [
  {
    slug: "cyberlearn",
    index: "001",
    title: "CYBERLEARN",
    image: "/Log_blanc_large.png",
    liveUrl: "https://cyberlearn.fr",
    year: "2025",
    tags: ["Turborepo", "Next.js 15", "Supabase", "Prisma", "PostgreSQL RLS", "Remotion"],
    excerpt:
      "The platform I keep coming back to. A full-stack cybersecurity learning environment where the hard part was never writing the lessons — it was making progress feel earned and keeping a multi-tenant database honest about who is allowed to read what.",
    body: [
      "CyberLearn is the project everything else orbits. It is a Turborepo monorepo on Next.js 15, with Supabase and Prisma underneath — a French-first platform for learning cybersecurity that is built as a product, not a demo. The interesting engineering was never the lesson content. It was the data model, the authorisation boundary, and the systems that decide what a learner sees and when.",
      "Authorisation is enforced in PostgreSQL through Row-Level Security, not in the application layer. The reasoning is the same one the rest of my work keeps arriving at: the application is not the only thing that can reach the database, so the application cannot be the only thing that enforces access. RLS hardening pushes the trust boundary down to the row, where it survives a compromised API route, a misused service key, or a query written by someone who forgot the tenant check. Getting the policies right — and proving they fail closed — was the part that took longest and mattered most.",
      "On top of that sits a gamification layer: streaks, quests, leagues, cosmetics, and an end-of-period \"wrapped\". The design constraint was to reward consistency without turning learning into a slot machine — motivation systems that respect the learner's time rather than farming it. The content side runs a video pipeline built on Remotion and ElevenLabs, turning written scripts into narrated lessons, because content production is the real bottleneck for any learning platform and automating it is what makes a catalogue maintainable by one person.",
      "The catalogue itself was reorganised into structured DevOps and DevSecOps tracks — sequenced paths rather than a flat list of topics. A learning platform is a schema problem disguised as a content problem: the decisions about progression, prerequisites, and how completion unlocks the next thing constrain everything the product can become later. Most of those decisions had to be made once and be correct, because migrating progression logic under live users is a cost that prototype environments never reveal.",
    ],
  },
  {
    slug: "nullsec",
    index: "002",
    title: "NULLSEC",
    year: "2025",
    tags: ["Next.js 16", "GSAP", "Lenis", "Tailwind v4", "Typst"],
    excerpt:
      "The site you are reading. An editorial-brutalist portfolio built under deliberate constraint — four colours, no gradients, three typefaces — where the content is typed data and the CVs are compiled from source.",
    body: [
      "NULLSEC is this site. The brief I set myself was a constraint, not a moodboard: four colours, no gradients, three typefaces, and motion that earns its place. Constraints are a design forcing-function — they remove the decisions that do not matter so the ones that do become obvious. The result is editorial rather than decorative, which is the right register for security work.",
      "Motion runs on GSAP and Lenis. Every animation is guarded by a reduced-motion check and torn down through GSAP's context cleanup, so the site degrades gracefully instead of breaking for anyone who has opted out or arrived on hardware that cannot keep up. Smooth scroll that fights the browser is worse than none at all; the discipline is in the cleanup paths, not the keyframes.",
      "Content is data. The profile, projects, certifications, and writing all live in typed TypeScript modules as a single source of truth, and the pages are generated from them — adding a project means editing a file, never touching a component. The CVs are authored in Typst, CV-as-code: versioned, diffable, reproducible PDFs that rebuild from source instead of being maintained by hand in a word processor.",
    ],
  },
  {
    slug: "zero-trust-architecture",
    index: "003",
    title: "ZERO TRUST ARCHITECTURE",
    image: "/ZeroTrust.png",
    year: "2025",
    tags: ["NIST SP 800-207", "OPNsense", "Suricata", "Wazuh", "NIS2", "PKI"],
    excerpt:
      "Designing a Zero Trust migration for an organisation that already exists is a different problem from designing for one that does not. NIST SP 800-207 describes the destination clearly. It says almost nothing about the journey.",
    body: [
      "Designing a zero trust architecture for a multi-site logistics company that is already running is a different problem from designing for one that does not exist yet. The existing network has credentials, traffic flows, and operational dependencies that keep the business alive — and a migration that cannot break any of them. NIST SP 800-207 describes the destination with precision. It says almost nothing about how to get there from a network built ten years ago by people who are no longer employed by the company.",
      "The addressing scheme — 10.SITE.VLAN.0/24, second octet for site, third for function — was chosen for auditability over cleverness. A plan a new network engineer can read in five minutes is one they cannot misconfigure silently. The inter-VLAN traffic matrix was built differently: starting from empty and adding only what each business function demonstrably required, not what the existing network allowed. The existing network allowed too much. This is almost universally true. The identity stack — Step-CA for internal PKI, Authentik as the identity provider with hardware MFA, Teleport replacing direct SSH and RDP — was the most sequencing-sensitive part of the architecture. Misconfigure the trust chain at the CA level and every certificate signed against it is suspect.",
      "The three-year TCO came to approximately €25,200 on QEMU/KVM infrastructure, built from component-level cost attribution rather than vendor quote. The difference matters: a vendor quote tells you what a solution costs to purchase. Component-level attribution tells you what it costs to run — including the operational labour that vendor quotes consistently omit. The NIS2 Article 21 compliance mapping was generated from the architecture documentation, not retrospectively: each control justified against a design decision, not claimed against a deployed component. The homelab implementation ran OPNsense with Suricata in IPS mode on the perimeter, Nginx with CrowdSec on the DMZ, and Wazuh receiving logs from every segment.",
      "Five deployment phases, each leaving the network more restrictive than the last, each designed so that a failure in that phase rolls back without cascading. Phase one deploys the identity infrastructure without deprecating existing credentials — which feels counterproductive and is operationally essential. The paired hands-on lab guide exists for a specific reason: a Technical Architecture Document that cannot be implemented is a design opinion dressed as engineering. The guide closes the gap between the document and the working system.",
    ],
  },
  {
    slug: "space-grc-mission",
    index: "004",
    title: "SPACE GRC MISSION",
    image: "/GuardianSpace.png",
    year: "2025",
    tags: ["ISO 27001", "NIS2", "EBIOS RM", "BCP/DRP", "LPM", "Crisis Response"],
    excerpt:
      "Ransomware in a satellite company is not a ransomware problem. It is a question of which systems you can afford to lose, for how long — and what the answer looks like for systems where the answer is not measured in hours.",
    body: [
      "Ransomware in a satellite company is not a ransomware problem. It is a question of which systems you can afford to lose, for how long, and what the answer looks like for systems where the answer is not measured in hours. Guardian Space: 800 employees, civil telecommunications satellites, military communications infrastructure, classified and unclassified assets sharing the same organisational context. The phishing campaign that seeded the incident had already succeeded by the time the crisis simulation began. The first task was not containment. It was understanding what was actually at risk.",
      "Four risk scenarios, chosen for their consequence asymmetry. R0 — the operations centre — had good visibility and tractable remediation paths. R2 — on-orbit satellites — introduced a constraint that changes every calculation: you cannot patch hardware in orbit during an active incident. Vulnerabilities in satellite firmware are not temporary exposures; they are facts of the deployment lifetime. R8 — ground-to-space communication links — is where the civil and military environments must intersect, and where French Military Programming Law obligations impose requirements with no civilian equivalent and no flexibility for interpretation. R9 — personnel — was the scenario every stakeholder wanted to discuss last. That instinct is itself a finding.",
      "Three regulatory frameworks applied simultaneously: ISO 27001 for the baseline management system, NIS2 Article 21 for sector-specific incident handling obligations, CER for critical infrastructure protection on the ground segment. The BCP/DRP set a six-hour RTO on satellite control functions — not an aspirational target, but one derived from what a longer outage would mean for active orbital missions. The RACI matrix was built before the remediation roadmap. Roadmaps are straightforward to produce. Accountability matrices are the artefact organisations consistently defer, and deferring them is why roadmaps often have no one responsible for seeing them through.",
      "The Cybersecurity Directorate proposed in the governance redesign reports directly to the C-suite, operates on a PDCA cycle with defined review cadences, and carries explicit ownership of every control domain. The P1/P2/P3 prioritisation was driven by two factors: consequence severity and current control maturity. The finding that ran through all four risk scenarios was the same: Guardian Space had security measures. Each team protected its own assets according to its own threat model. The military operations had one security posture; the civil operations had another. The gap between them had no owner — which made it the most reliable attack surface in the organisation.",
    ],
  },
  {
    slug: "cryptographic-audit",
    index: "005",
    title: "CRYPTOGRAPHIC AUDIT",
    image: "/stm32-blue-pill.jpg",
    year: "2025",
    tags: ["Side-Channel", "STM32", "Timing Attack", "Python", "JTAG", "UART"],
    excerpt:
      "Crappy Safe is not a creative name for vulnerable firmware — it is an accurate description. The password check compared characters in sequence and returned failure on the first mismatch. That single design decision turns the authentication routine into a measuring instrument.",
    body: [
      "Crappy Safe is not a creative name for a vulnerable firmware — it is an accurate description. The password verification routine compared characters in sequence and returned failure the moment it found a mismatch. That design decision turns the authentication routine into a measuring instrument: query with a wrong first character, get a response in T₁ milliseconds. Query with a correct first character and a wrong second, get T₂ > T₁. The timing difference is the key. The algorithm is never touched — the attack reads what the hardware cannot help broadcasting.",
      "UART for target communication, JTAG for flashing — with a fix required up front for the clone chip's JTAG ID, which the toolchain refused to recognise. The measurement strategy was median averaging across repeated queries: median rather than mean, because timing distributions on embedded hardware are not Gaussian. Interrupt service routines and clock jitter produce outliers that skew the mean and flatten the signal below the noise floor. The correct estimator required looking at the actual distribution first. That step is absent from most side-channel tutorials, and skipping it is why naive implementations of the attack fail.",
      "The recovery runs as a loop: for each character position, iterate through the candidate set, send a prefixed query, collect N timing measurements, take the median, identify which candidate takes longest. That candidate is correct. Advance to the next position and repeat. The lab's difficulty levels introduced additional noise and active countermeasure attempts — which required adjusting N and detection thresholds, not the fundamental method. The method is robust because the vulnerability is structural: you cannot make early-exit comparison constant-time by adding noise. The noise affects both candidates equally. The relative ordering survives.",
      "The remediation is constant-time string comparison — three lines of code, available in every standard library. The fifteen-page report in Word and LaTeX documents the full experimental arc: measurements that worked, the ones that required re-collection, and the parameter choices that revealed the underlying physics when they were wrong. The hardening recommendations cover constant-time comparison, authentication rate limiting, nonce-based challenge-response, and watchdog integration against fault injection. Documenting what to fix is only useful if the report also explains why the intuitive implementation was wrong — otherwise the next developer makes the same choice for the same reason.",
    ],
  },
  {
    slug: "tower-defense-game",
    index: "006",
    title: "TOWER DEFENSE GAME",
    year: "2026",
    tags: ["Unity", "C#", "Tower Defense", "Fantasy / D&D", "VFX as code", "UI/UX"],
    excerpt:
      "A fantasy, Dungeons & Dragons-flavoured tower-defense built — currently at pre-prototype, with my work spanning development, UI/UX, and VFX authored as code in C#.",
    body: [
      "A tower-defense game with a fantasy, Dungeons & Dragons-flavoured art direction, built in Unity . It is at the pre-prototype stage — the moment where the core loop and the feel are being proven before anything gets polished. My role spans development, UI/UX, and visual effects.",
      "The part I care most about is VFX as code: effects driven and parameterised in C# rather than hand-placed in the editor, so they are reproducible, tweakable, and version-controlled like any other source. Treating effects as code instead of artefacts you click into existence is the same discipline that keeps infrastructure and detection logic maintainable.",
      "Game development is an unusual entry on a security portfolio, but the transferable part is real: performance budgets, deterministic systems, and a UI that has to communicate state clearly under pressure. Building it with a team — under a shared art direction and a deadline — is also where most of the actual engineering happens.",
    ],
  },
  {
    slug: "homelab-proxmox",
    index: "007",
    title: "HOMELAB · PROXMOX",
    year: "2026",
    tags: ["Proxmox", "Wazuh", "Self-hosted", "Linux", "Networking"],
    excerpt:
      "A small Proxmox homelab on a laptop — Ryzen 7, 16 GB, 512 GB NVMe — running real workloads: game servers for friends, a Wazuh stack, and a provisioning box for testing.",
    body: [
      "The homelab is where the infrastructure and detection skills get rehearsed on something low-stakes and genuinely real. It runs Proxmox on a single laptop — a Ryzen 7 (7000-series), 16 GB of RAM, a 512 GB NVMe — deliberately modest, because the constraint is the lesson: you learn more squeezing real services onto limited hardware than you do with headroom to waste.",
      "It hosts a Cobblemon Minecraft server and other game servers for friends, exposed to the internet through a playit.gg tunnel so nothing at home has to be port-forwarded or directly reachable. Alongside the game servers runs a Wazuh stack — so the same box that serves friends is also where I practise detection engineering against real logs — and a provisioning server used to stand up and tear down test environments on demand.",
      "Running services other people depend on, even for a game, teaches what coursework cannot: uptime, backups, and the immediate cost of a misconfiguration when someone is actually using the thing. It is also where least privilege, segmentation, and zero-trust thinking stop being slides and become muscle memory — applied to a network I own, can break, and have to fix.",
    ],
  },
];

// Adjacent-project navigation helper used in work/[slug] pages.
export function getAdjacentWork(
  slug: string
): { prev: WorkItem | null; next: WorkItem | null } {
  const idx = work.findIndex((w) => w.slug === slug);
  return {
    prev: idx > 0 ? work[idx - 1] : null,
    next: idx < work.length - 1 ? work[idx + 1] : null,
  };
}
