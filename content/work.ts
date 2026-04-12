export type WorkItem = {
  slug: string;
  index: string;
  title: string;
  year: string;
  tags: string[];
  excerpt: string;
  body: string[]; // paragraphs of editorial copy
  image: string;  // path relative to /public
};

export const work: WorkItem[] = [
  {
    slug: "zero-trust-architecture",
    index: "001",
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
    index: "002",
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
    index: "003",
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
    slug: "cyberlearn",
    index: "004",
    title: "CYBERLEARN",
    image: "/Log_blanc_large.png",
    year: "2024",
    tags: ["Next.js", "Firebase", "Full-Stack", "Product", "Education"],
    excerpt:
      "French cybersecurity students were learning from paywalled English content or shallow translated overviews. That gap is why CyberLearn exists — a production platform built to fill it, not to demonstrate that it could be built.",
    body: [
      "French cybersecurity students learning from paywalled English content or shallow translated overviews. That gap is why CyberLearn exists — not as a proof of concept, but as a production platform built to fill a specific, verifiable absence. Fifty-plus lessons, a hundred interactive exercises, flashcard-based spaced repetition, a badge and certification system that gives learners verifiable evidence of what they have completed. Bilingual French and English from the start, not retrofitted. Live at cyberlearn-neon.vercel.app with a companion mobile app.",
      "Next.js on the frontend, Firebase for authentication and persistent data — user progress, flashcard state, completion records. The bilingual architecture was designed into the content schema at the beginning: translated content keys, not translated pages, so the same component tree serves both languages without duplication. The mobile app shares the same backend; progress synchronises across environments without a second source of truth. The schema decisions made in month one constrained what the badge and certification system could do in month three. That coupling is the part of product development that project briefs do not prepare you for.",
      "Building to a brief ends when the deliverable is accepted. Building a product ends when users stop needing it — a different terminus with different demands. The progression logic required writing rules for a system that did not yet exist: which completion thresholds unlock which badges, how certifications are issued, what the learner sees when they are close to a threshold versus far from it. The Firebase schema had to anticipate query patterns that would not be visible until real users arrived and did things you had not anticipated. Most of these decisions were made once and needed to be correct, because migrating a live database schema under active users carries costs that prototype environments never reveal.",
      "The platform is live, used, and maintained. The code is public. What it demonstrates is not that the stack works — Next.js and Firebase are well-documented, and the stack is conventional. What it demonstrates is that a production deployment imposes a different quality of decision-making: you are accountable for the accuracy of what you are teaching, the reliability of the system while learners are in it, and the data of real people. Those constraints produce better engineering than deadlines do, because the cost of a wrong decision is immediate and belongs to someone other than you.",
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
