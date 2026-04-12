export type Dispatch = {
  slug: string;
  date: string; // ISO 8601
  title: string;
  excerpt: string;
  readTime: string;
  body: string[]; // paragraphs
};

export const dispatches: Dispatch[] = [
  {
    slug: "on-the-fragility-of-edr-assumptions",
    date: "2025-03-14",
    title: "On the fragility of EDR assumptions",
    excerpt:
      "EDR vendors sell you a dashboard. The dashboard shows what the tool caught. The data you actually need is everything it didn't.",
    readTime: "6 min",
    body: [
      "The dashboard problem in endpoint detection is a confidence problem. EDR tools surface what they detect — which is, by construction, only the set of things the vendor's research team has seen, modelled, and decided to alert on. The set of things that did not generate an alert is invisible on the dashboard. The operational reflex is to read that silence as safety. This reflex is how persistent threats persist: not because they are undetectable in principle, but because the detection infrastructure is designed to respond, not to hunt.",
      "Living-off-the-land attacks are the clearest illustration of the detection boundary. When an adversary avoids introducing new binaries and instead runs PowerShell, WMI, certutil, or bitsadmin — signed Microsoft tools doing things Microsoft tools sometimes legitimately do — the EDR heuristics face a categorisation problem with no clean answer. The behaviour is normal in some contexts and malicious in others. Distinguishing between them requires understanding what normal looks like for your specific environment: your user population, your software estate, your administration patterns. This is not something a vendor signature set knows. It is built from your own telemetry, your own baselines, and your own analysis.",
      "Clarity about what EDR purchases is an operational question, not a theological one. It is effective against commodity attacks: ransomware-as-a-service loaders that have not been custom-compiled, known malware families, stealers and droppers that behave the way malware in a sandbox behaves. It raises the cost of unsophisticated attack meaningfully. It provides endpoint telemetry that would otherwise require custom instrumentation. What it does not provide is coverage against an adversary who studied your environment before touching a keyboard — who logs in with valid credentials obtained through phishing, escalates using a legitimate vulnerability in a way that mimics normal admin behaviour, and moves carefully enough to stay below the anomaly threshold for weeks.",
      "The most useful reframe: treat EDR as the instrument that tells you the noise floor has changed. The alert tells you something deviated from baseline enough for the vendor's model to flag it. The interesting question is what happened in the period before the deviation became legible. Blue teams that wait for the dashboard to light up are always responding to day-N of an incident. Blue teams that build hypotheses about what patient adversary behaviour looks like — in their specific logs, against their specific assets, with their specific user population — have a chance at day-one or day-two detection. Assume the alert is late. Ask what the quiet period looked like and whether you would have noticed it.",
    ],
  },
  {
    slug: "zero-trust-is-a-posture-not-a-product",
    date: "2025-01-28",
    title: "Zero Trust is a posture, not a product",
    excerpt:
      "Buying a Zero Trust product does not move you toward the condition the phrase describes. Seventeen vendors will tell you otherwise.",
    readTime: "8 min",
    body: [
      "The phrase Zero Trust has been almost entirely consumed by the market. It appears on product pages for firewalls, network monitors, identity platforms, microsegmentation tools, and endpoint agents — each vendor implying that purchasing their product advances the organisation toward the state the phrase describes. It does not work this way. The phrase describes an architectural and organisational posture. It cannot be purchased. It can only be built, slowly, across teams, through decisions about where verification happens and what trust boundaries mean, at a cost that does not appear on a vendor invoice.",
      "John Kindervag's 2010 Forrester research described a philosophy, not a product category: never trust, always verify. Move the trust boundary away from the network perimeter — which is porous, assumed-secure by convention, and historically incorrect — to the individual transaction. Every access request must be authenticated, authorised, and evaluated in context. The network is not the security boundary. The identity, the device posture, the request context, and the data sensitivity together constitute the boundary, dynamically, per-request. This model is sound and demanding. It requires knowing what you are protecting, who should have access to it, and what legitimate access patterns look like. Most organisations do not have this knowledge in a form precise enough to enforce it consistently.",
      "Implementing Zero Trust in a real environment surfaces three requirements that no vendor adequately prices into their sales cycle. First: a complete and maintained asset inventory, because dynamic access controls applied to assets you have not enumerated produce unpredictable results, not security. Second: identity infrastructure mature enough to provide meaningful context at access time — device health, network location, time of day, role, session risk score — and act on it consistently across all access paths, including the legacy applications that cannot participate in modern authentication flows. Third: monitoring capable of detecting anomalous access patterns in a model where everything is, by design, potentially reachable, and where anomalous must be defined against your baseline, not a generic industry threat model. None of these capabilities come in a box. All of them require organisational maturity that accumulates over years.",
      "The gap between the marketing deck and the threat model is where breaches live. Organisations that purchased the product and called it done typically retained the implicit trust assumptions of their old network architecture while adding the operational complexity of a new control plane. The organisations that have implemented the posture correctly do not describe it as an achievement. They describe it as a discipline they practise continuously — reviewing access decisions, tightening over-provisioned identities, re-evaluating what the trust model from six months ago was actually assuming about the world. Zero Trust as a destination is a narrative that serves vendors. Zero Trust as a practice is a different and more demanding commitment.",
    ],
  },
  {
    slug: "what-side-channel-attacks-taught-me-about-patience",
    date: "2024-11-07",
    title: "What side-channel attacks taught me about patience",
    excerpt:
      "The first 300 traces produced a uniform noise floor. The next 4,500 produced a key. The difference was not more data.",
    readTime: "5 min",
    body: [
      "The first correlation attack I ran did not work. The correlation coefficients were nearly uniform across all 256 key hypotheses for every byte position. I spent most of a day re-reading the ChipWhisperer documentation, then another half-day examining the trigger logic, before I measured the actual problem: the shunt resistor I had soldered into the VCC line was too high in resistance, and the resulting voltage drop was saturating the oscilloscope input on high-activity clock cycles. The signal I was trying to recover was buried under clipping artifacts. The mathematics were correct. The experiment was broken at the level of the physics, and I had spent two days debugging the wrong layer.",
      "What followed was a structured debugging process that has stayed with me. One variable at a time. Characterise the noise floor before touching the analysis. Understand your instrumentation before trusting your data. Lower-resistance shunt. Reduce the oscilloscope input voltage range. Capture a single trace and inspect it visually: does the power waveform have the morphology you would expect from an AES round structure? Does the trigger fire at the right point in the encryption? Does the capture window cover the operation you are targeting? Only when the answers to those questions are clearly yes should you collect traces at scale. The correct sequence is: understand your measurement first, then apply your model. Most of the time wasted in experimental work comes from reversing that order.",
      "The attack that recovered the full 128-bit AES key in 4,800 traces was methodical rather than clever. The insight was not mathematical — Correlation Power Analysis is well-documented and the implementation is straightforward once your measurement is clean. The insight was operational: the failure was not a data quantity problem, it was a data quality problem. Adding more traces against a broken measurement setup does not converge on a result. It produces a larger, equally useless dataset. This distinction matters and is consistently underweighted in how we talk about both offensive techniques and defensive practices. The bottleneck is almost always what you are measuring and how, not how much of it you have collected.",
      "The transfer to threat hunting is direct and underappreciated. Hunting for persistent activity in an environment is structurally similar to recovering a key from noisy power measurements: you have a hypothesis, you have imperfect data, and the temptation is to run the analysis immediately. The analysts who consistently find what others miss are not the ones with the most sophisticated detection logic. They are the ones who, before starting, understood their data sources — coverage gaps, log forwarding latency, timestamp normalisation, what is indexed in the SIEM versus what is collected but unqueried, which hosts produce no telemetry at all. Patience, in both contexts, is methodology operating at a pace slower than the problem seems to demand. It is also the only approach that reliably works.",
    ],
  },
];

// Adjacent dispatch helper for navigation.
export function getAdjacentDispatch(
  slug: string
): { prev: Dispatch | null; next: Dispatch | null } {
  const idx = dispatches.findIndex((d) => d.slug === slug);
  return {
    prev: idx > 0 ? dispatches[idx - 1] : null,
    next: idx < dispatches.length - 1 ? dispatches[idx + 1] : null,
  };
}
