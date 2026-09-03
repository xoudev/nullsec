import type { Localized } from "@/lib/i18n";

export type WorkFact = {
  label: Localized<string>;
  value: Localized<string>;
};

export type WorkItem = {
  slug: string;
  index: string;
  // "side" projects (creative engineering) render after the core security work.
  tier?: "core" | "side";
  title: Localized<string>;
  year: string;
  tags: string[];
  excerpt: Localized<string>;
  // Fast fact sheet rendered above the editorial body — a reader must get the
  // context, role and outcome in twenty seconds, then read on if interested.
  facts: WorkFact[];
  body: Localized<string[]>;   // paragraphs of editorial copy
  image?: string;   // optional path relative to /public — omit when no asset exists yet
  liveUrl?: string; // optional public / live site link
  repoUrl?: string; // optional public source repository
};

export const work: WorkItem[] = [
  {
    slug: "cyberlearn",
    index: "001",
    title: { en: "CYBERLEARN", fr: "CYBERLEARN" },
    image: "/Log_blanc_large.png",
    liveUrl: "https://cyberlearn.fr",
    year: "2025",
    tags: ["Turborepo", "Next.js 15", "Supabase", "Prisma", "PostgreSQL RLS", "Remotion"],
    excerpt: {
      en: "The platform I keep coming back to. A full-stack cybersecurity learning environment where the hard part was never writing the lessons — it was making progress feel earned and keeping a multi-tenant database honest about who is allowed to read what.",
      fr: "La plateforme sur laquelle je reviens toujours. Un environnement full-stack d'apprentissage de la cybersécurité où le plus dur n'a jamais été de rédiger les leçons, mais de faire en sorte que la progression se mérite et de tenir une base multi-tenant rigoureuse sur les droits de lecture de chacun.",
    },
    facts: [
      { label: { en: "CONTEXT", fr: "CONTEXTE" }, value: { en: "Personal product, built and run solo", fr: "Produit personnel, conçu et opéré en solo" } },
      { label: { en: "ROLE", fr: "RÔLE" }, value: { en: "Architecture, full-stack development, security model", fr: "Architecture, développement full-stack, modèle de sécurité" } },
      { label: { en: "DELIVERABLES", fr: "LIVRABLES" }, value: { en: "Live platform, PostgreSQL RLS policy set, gamification layer, Remotion video pipeline", fr: "Plateforme en ligne, politiques RLS PostgreSQL, couche de gamification, pipeline vidéo Remotion" } },
      { label: { en: "OUTCOME", fr: "RÉSULTAT" }, value: { en: "Authorisation enforced at row level (fails closed); catalogue maintainable by one person", fr: "Autorisation appliquée au niveau des lignes (se referme en cas de doute) ; catalogue tenable par une seule personne" } },
    ],
    body: {
      en: [
        "CyberLearn is the project everything else orbits. It is a Turborepo monorepo on Next.js 15, with Supabase and Prisma underneath — a French-first platform for learning cybersecurity that is built as a product, not a demo. The interesting engineering was never the lesson content. It was the data model, the authorisation boundary, and the systems that decide what a learner sees and when.",
        "Authorisation is enforced in PostgreSQL through Row-Level Security, not in the application layer. The reasoning is the same one the rest of my work keeps arriving at: the application is not the only thing that can reach the database, so the application cannot be the only thing that enforces access. RLS hardening pushes the trust boundary down to the row, where it survives a compromised API route, a misused service key, or a query written by someone who forgot the tenant check. Getting the policies right — and proving they fail closed — was the part that took longest and mattered most.",
        "On top of that sits a gamification layer: streaks, quests, leagues, cosmetics, and an end-of-period \"wrapped\". The design constraint was to reward consistency without turning learning into a slot machine — motivation systems that respect the learner's time rather than farming it. The content side runs a video pipeline built on Remotion and ElevenLabs, turning written scripts into narrated lessons, because content production is the real bottleneck for any learning platform and automating it is what makes a catalogue maintainable by one person.",
        "The catalogue itself was reorganised into structured DevOps and DevSecOps tracks — sequenced paths rather than a flat list of topics. A learning platform is a schema problem disguised as a content problem: the decisions about progression, prerequisites, and how completion unlocks the next thing constrain everything the product can become later. Most of those decisions had to be made once and be correct, because migrating progression logic under live users is a cost that prototype environments never reveal.",
      ],
      fr: [
        "CyberLearn est le projet autour duquel tout le reste gravite. Un monorepo Turborepo sous Next.js 15, adossé à Supabase et Prisma : une plateforme « French-first » pour apprendre la cybersécurité, pensée comme un produit, pas comme une démo. L'ingénierie qui m'a vraiment intéressé n'a jamais résidé dans le contenu des leçons, mais dans le modèle de données, la frontière d'autorisation et tous les mécanismes qui décident de ce qu'un apprenant voit, et à quel moment.",
        "L'autorisation se joue dans PostgreSQL, via la Row-Level Security, et non dans la couche applicative. C'est le même raisonnement qui revient dans tout le reste de mon travail : l'application n'est pas la seule à pouvoir atteindre la base, elle ne peut donc pas être la seule à en faire respecter les accès. Le durcissement RLS fait descendre la frontière de confiance jusqu'à la ligne elle-même, où elle tient bon face à une route d'API compromise, à une clé de service détournée ou à une requête écrite par quelqu'un qui a oublié le filtrage par tenant. Écrire les bonnes politiques, et prouver qu'elles se referment en cas de doute, aura été la tâche la plus longue et la plus déterminante.",
        "Par-dessus se greffe une couche de gamification : séries, quêtes, ligues, cosmétiques et un « wrapped » de fin de période. Toute la difficulté tenait à récompenser la régularité sans transformer l'apprentissage en machine à sous, avec des ressorts de motivation qui respectent le temps de l'apprenant au lieu de le pressurer. Côté contenu, un pipeline vidéo bâti sur Remotion et ElevenLabs transforme les scripts en leçons narrées, car la production de contenu est le vrai goulet d'étranglement de toute plateforme d'apprentissage : l'automatiser, c'est ce qui rend un catalogue tenable par une seule personne.",
        "Le catalogue, lui, a été réorganisé en parcours DevOps et DevSecOps structurés, des cheminements séquencés plutôt qu'une simple liste de sujets. Une plateforme d'apprentissage est un problème de schéma déguisé en problème de contenu : les choix de progression, de prérequis et de déblocage d'une étape à la suivante conditionnent tout ce que le produit pourra devenir par la suite. La plupart de ces choix devaient être tranchés une bonne fois et tranchés juste, car migrer une logique de progression sous les pieds d'utilisateurs en production a un coût que les environnements de prototype ne laissent jamais soupçonner.",
      ],
    },
  },
  {
    slug: "nullsec",
    index: "002",
    title: { en: "NULLSEC", fr: "NULLSEC" },
    repoUrl: "https://github.com/xoudev/nullsec",
    year: "2025",
    tags: ["Next.js 16", "GSAP", "Lenis", "Tailwind v4", "Typst"],
    excerpt: {
      en: "The site you are reading. An editorial-brutalist portfolio built under deliberate constraint — five colours, no gradients, three typefaces — where the content is typed data and the CVs are compiled from source.",
      fr: "Le site que vous êtes en train de lire. Un portfolio éditorial-brutaliste conçu sous contrainte délibérée (cinq couleurs, aucun dégradé, trois typographies), où le contenu n'est que de la donnée structurée et où les CV se compilent depuis les sources.",
    },
    facts: [
      { label: { en: "CONTEXT", fr: "CONTEXTE" }, value: { en: "Personal site, designed and built solo", fr: "Site personnel, conçu et développé en solo" } },
      { label: { en: "ROLE", fr: "RÔLE" }, value: { en: "Design system, development, content, hardening", fr: "Système de design, développement, contenu, durcissement" } },
      { label: { en: "DELIVERABLES", fr: "LIVRABLES" }, value: { en: "This site, typed content model, Typst CV pipeline, CSP/HSTS/security.txt posture", fr: "Ce site, modèle de contenu typé, pipeline de CV Typst, posture CSP/HSTS/security.txt" } },
      { label: { en: "OUTCOME", fr: "RÉSULTAT" }, value: { en: "Single source of truth: site and CVs compile from the same data", fr: "Source unique de vérité : le site et les CV se compilent depuis les mêmes données" } },
    ],
    body: {
      en: [
        "NULLSEC is this site. The brief I set myself was a constraint, not a moodboard: five colours, no gradients, three typefaces, and motion that earns its place. Constraints are a design forcing-function — they remove the decisions that do not matter so the ones that do become obvious. The result is editorial rather than decorative, which is the right register for security work.",
        "Motion runs on GSAP and Lenis. Every animation is guarded by a reduced-motion check and torn down through GSAP's context cleanup, so the site degrades gracefully instead of breaking for anyone who has opted out or arrived on hardware that cannot keep up. Smooth scroll that fights the browser is worse than none at all; the discipline is in the cleanup paths, not the keyframes.",
        "Content is data. The profile, projects, certifications, and writing all live in typed TypeScript modules as a single source of truth, and the pages are generated from them — adding a project means editing a file, never touching a component. The CVs are authored in Typst, CV-as-code: versioned, diffable, reproducible PDFs that rebuild from source instead of being maintained by hand in a word processor.",
      ],
      fr: [
        "NULLSEC, c'est ce site. Le cahier des charges que je me suis fixé tenait de la contrainte, pas du moodboard : cinq couleurs, aucun dégradé, trois typographies et une animation qui doit justifier sa présence. La contrainte agit comme un révélateur de conception : elle écarte les décisions sans importance pour faire ressortir celles qui comptent. Le résultat est éditorial plutôt que décoratif, et c'est le bon registre pour un travail de sécurité.",
        "L'animation repose sur GSAP et Lenis. Chaque effet est conditionné à un test « reduced-motion » et démantelé par le nettoyage de contexte de GSAP, pour que le site se dégrade en douceur au lieu de casser chez ceux qui ont désactivé le mouvement ou qui arrivent sur une machine trop juste. Un défilement fluide qui lutte contre le navigateur est pire que pas de défilement du tout : toute la rigueur se trouve dans les routines de nettoyage, pas dans les keyframes.",
        "Le contenu n'est que de la donnée. Le profil, les projets, les certifications et les écrits résident tous dans des modules TypeScript typés, source unique de vérité d'où les pages sont générées : ajouter un projet, c'est éditer un fichier, jamais toucher à un composant. Les CV, eux, sont écrits en Typst, en mode « CV-as-code » : des PDF versionnés, suivis au diff et reproductibles, qui se reconstruisent depuis les sources au lieu d'être bricolés à la main dans un traitement de texte.",
      ],
    },
  },
  {
    slug: "zero-trust-architecture",
    index: "003",
    title: { en: "ZERO TRUST ARCHITECTURE", fr: "ARCHITECTURE ZERO TRUST" },
    image: "/ZeroTrust.png",
    year: "2026",
    tags: ["EBIOS RM", "Stormshield SNS", "Proxmox VE", "Wazuh XDR", "ISO 27001", "NIS2"],
    excerpt: {
      en: "A final-year architecture dossier: Zero Trust and defence in depth for a three-site supply-chain operation. The target architecture was never the hard part. Justifying every choice against a risk analysis, a sovereignty constraint and a budget was.",
      fr: "Dossier d'architecture de fin d'études : Zero Trust et défense en profondeur pour une activité logistique sur trois sites. L'architecture cible n'a jamais été le plus dur. Justifier chaque choix face à une analyse de risques, à une contrainte de souveraineté et à un budget, si.",
    },
    facts: [
      { label: { en: "CONTEXT", fr: "CONTEXTE" }, value: { en: "Final-year dossier (Guardia, RNCP 37680) — supply-chain operation, 3 sites, 150 users", fr: "Dossier de fin d'études (Guardia, RNCP 37680) : activité logistique, 3 sites, 150 utilisateurs" } },
      { label: { en: "ROLE", fr: "RÔLE" }, value: { en: "Sole author: risk analysis, target architecture, tooling comparison, costing, documentation", fr: "Auteur unique : analyse de risques, architecture cible, comparatif d'outillage, chiffrage, documentation" } },
      { label: { en: "DELIVERABLES", fr: "LIVRABLES" }, value: { en: "EBIOS RM analysis, 11-VLAN segmentation with deny-by-default flow matrix, hybrid AD tiering design, SIEM and supervision stack, 3 network diagrams, 12-phase roadmap", fr: "Analyse EBIOS RM, segmentation en 11 VLANs avec matrice de flux en refus par défaut, conception AD hybride en tiering, socle SIEM et supervision, 3 schémas réseau, feuille de route en 12 phases" } },
      { label: { en: "OUTCOME", fr: "RÉSULTAT" }, value: { en: "Critical EBIOS RM scenarios brought to an accepted residual level; bottom-up year-one budget; all 10 competencies of the qualification evidenced against concrete design decisions", fr: "Scénarios critiques EBIOS RM ramenés à un niveau résiduel accepté, budget de première année construit poste par poste, et les 10 compétences du titre adossées à des décisions de conception concrètes" } },
    ],
    body: {
      en: [
        "Designing a Zero Trust architecture for an operation that is already running is a different problem from designing for one that does not exist yet. The network in place has credentials, traffic flows and operational dependencies that keep the business alive, and the migration cannot break any of them. The reference frameworks describe the destination with precision. They say very little about how to get there without stopping the warehouses.",
        "So the dossier starts before the architecture. Assets were classified on availability, integrity and confidentiality, then run through a full EBIOS RM analysis across its five workshops, and a threat model expressed in MITRE ATT&CK terms. Only then did tool selection begin, and every choice had to survive a written comparison rather than a preference: a Stormshield NGFW because it carries ANSSI qualification, Proxmox VE for virtualisation, Wazuh for the SIEM, Teleport as the SSH bastion. Sovereignty was a stated selection criterion, not a slogan added at the end.",
        "The target architecture segments the estate into eleven VLANs with a flow matrix built the restrictive way: starting from nothing and opening only what a business function demonstrably needed, rather than preserving what the previous network happened to tolerate. The three sites are joined by a full-mesh IPSec IKEv2 tunnel set with AES-256-GCM and perfect forward secrecy, over dual-carrier links that fail over rather than fail. Identity is a hybrid Active Directory under a 0/1/2 tiering model, with hardened administration workstations, an SSH bastion and MFA on every sensitive path. Compute is a Proxmox cluster per site with distributed storage and high availability; backups follow a 3-2-1 strategy ending in immutable, sovereign-hosted object storage.",
        "Detection and operations were designed with the same discipline: a Wazuh XDR with rules mapped to specific ATT&CK techniques, Grafana and Prometheus for supervision with severity-routed alerting, CIS Benchmark hardening verified with a scanner rather than asserted, and the whole estate mapped against ISO 27001 Annex A and NIS2. Provisioning is automated with PowerShell for the directory and idempotent Ansible playbooks for the infrastructure. The part I would defend hardest is the conclusion: the architecture is largely sovereign but still leans on a US collaboration suite, and the dossier says so plainly, then costs out what removing that dependency would take. An architecture that hides its own trade-offs is not finished.",
      ],
      fr: [
        "Concevoir une architecture Zero Trust pour une activité déjà en marche n'a rien à voir avec le fait de la concevoir pour une organisation qui n'existe pas encore. Le réseau en place a ses identifiants, ses flux et ses dépendances opérationnelles qui font vivre l'entreprise, et la migration ne peut en casser aucun. Les référentiels décrivent la destination avec précision. Ils disent très peu de choses sur la façon d'y arriver sans arrêter les entrepôts.",
        "Le dossier commence donc avant l'architecture. Les actifs ont été classifiés selon la disponibilité, l'intégrité et la confidentialité, puis passés dans une analyse EBIOS RM complète sur ses cinq ateliers, doublée d'un modèle de menaces exprimé en langage MITRE ATT&CK. Le choix des outils n'est venu qu'ensuite, et chaque option devait survivre à un comparatif écrit plutôt qu'à une préférence : un pare-feu Stormshield parce qu'il porte une qualification ANSSI, Proxmox VE pour la virtualisation, Wazuh pour le SIEM, Teleport comme bastion SSH. La souveraineté était un critère de sélection assumé, pas un slogan ajouté à la fin.",
        "L'architecture cible découpe le parc en onze VLANs, avec une matrice de flux construite dans le bon sens : partir de rien et n'ouvrir que ce dont une fonction métier avait réellement besoin, au lieu de reconduire ce que le réseau précédent tolérait. Les trois sites sont reliés par un maillage complet de tunnels IPSec IKEv2 en AES-256-GCM avec confidentialité persistante, sur des liens à double opérateur qui basculent au lieu de tomber. L'identité repose sur un Active Directory hybride sous un modèle de tiering 0/1/2, avec postes d'administration durcis, bastion SSH et MFA sur tous les accès sensibles. Le calcul s'appuie sur un cluster Proxmox par site, en stockage distribué et haute disponibilité ; les sauvegardes suivent une stratégie 3-2-1 qui se termine dans un stockage objet immuable, hébergé en souverain.",
        "La détection et l'exploitation ont été traitées avec la même rigueur : un Wazuh XDR dont les règles sont rattachées à des techniques ATT&CK précises, Grafana et Prometheus pour la supervision avec un alerting routé par criticité, un durcissement CIS vérifié par scanner plutôt qu'affirmé, et l'ensemble cartographié sur l'annexe A d'ISO 27001 et sur NIS2. Le provisionnement est automatisé, en PowerShell pour l'annuaire et en playbooks Ansible idempotents pour l'infrastructure. Ce que je défendrais le plus, c'est la conclusion : l'architecture est largement souveraine mais reste adossée à une suite collaborative américaine, et le dossier le dit franchement, puis chiffre ce que coûterait la suppression de cette dépendance. Une architecture qui masque ses propres arbitrages n'est pas terminée.",
      ],
    },
  },
  {
    slug: "space-grc-mission",
    index: "004",
    title: { en: "SPACE GRC MISSION", fr: "MISSION GRC SPATIALE" },
    image: "/GuardianSpace.png",
    year: "2025",
    tags: ["ISO 27001", "NIS2", "EBIOS RM", "BCP/DRP", "LPM", "Crisis Response"],
    excerpt: {
      en: "Ransomware in a satellite company is not a ransomware problem. It is a question of which systems you can afford to lose, for how long — and what the answer looks like for systems where the answer is not measured in hours.",
      fr: "Un rançongiciel dans une entreprise de satellites n'est pas un problème de rançongiciel. C'est la question de savoir quels systèmes vous pouvez vous permettre de perdre, et pour combien de temps, et ce que devient cette réponse pour les systèmes où elle ne se compte plus en heures.",
    },
    facts: [
      { label: { en: "CONTEXT", fr: "CONTEXTE" }, value: { en: "School crisis simulation (Guardia): satellite operator under ransomware", fr: "Simulation de crise (Guardia) : opérateur de satellites sous rançongiciel" } },
      { label: { en: "ROLE", fr: "RÔLE" }, value: { en: "GRC analyst: risk scenarios, continuity planning, governance redesign", fr: "Analyste GRC : scénarios de risque, plans de continuité, refonte de la gouvernance" } },
      { label: { en: "DELIVERABLES", fr: "LIVRABLES" }, value: { en: "4 risk scenarios, BCP/DRP with a 6-hour RTO on satellite control, RACI matrix, P1-P3 remediation roadmap", fr: "4 scénarios de risque, PCA/PRA avec RTO de 6 h sur le contrôle satellite, matrice RACI, feuille de route P1-P3" } },
      { label: { en: "OUTCOME", fr: "RÉSULTAT" }, value: { en: "ISO 27001 + NIS2 + CER applied jointly; the key finding was the unowned gap between civil and military postures", fr: "ISO 27001, NIS2 et CER appliqués de front ; constat clef : l'écart sans propriétaire entre postures civile et militaire" } },
    ],
    body: {
      en: [
        "Ransomware in a satellite company is not a ransomware problem. It is a question of which systems you can afford to lose, for how long, and what the answer looks like for systems where the answer is not measured in hours. Guardian Space: 800 employees, civil telecommunications satellites, military communications infrastructure, classified and unclassified assets sharing the same organisational context. The phishing campaign that seeded the incident had already succeeded by the time the crisis simulation began. The first task was not containment. It was understanding what was actually at risk.",
        "Four risk scenarios, chosen for their consequence asymmetry. R0 — the operations centre — had good visibility and tractable remediation paths. R2 — on-orbit satellites — introduced a constraint that changes every calculation: you cannot patch hardware in orbit during an active incident. Vulnerabilities in satellite firmware are not temporary exposures; they are facts of the deployment lifetime. R8 — ground-to-space communication links — is where the civil and military environments must intersect, and where French Military Programming Law obligations impose requirements with no civilian equivalent and no flexibility for interpretation. R9 — personnel — was the scenario every stakeholder wanted to discuss last. That instinct is itself a finding.",
        "Three regulatory frameworks applied simultaneously: ISO 27001 for the baseline management system, NIS2 Article 21 for sector-specific incident handling obligations, CER for critical infrastructure protection on the ground segment. The BCP/DRP set a six-hour RTO on satellite control functions — not an aspirational target, but one derived from what a longer outage would mean for active orbital missions. The RACI matrix was built before the remediation roadmap. Roadmaps are straightforward to produce. Accountability matrices are the artefact organisations consistently defer, and deferring them is why roadmaps often have no one responsible for seeing them through.",
        "The Cybersecurity Directorate proposed in the governance redesign reports directly to the C-suite, operates on a PDCA cycle with defined review cadences, and carries explicit ownership of every control domain. The P1/P2/P3 prioritisation was driven by two factors: consequence severity and current control maturity. The finding that ran through all four risk scenarios was the same: Guardian Space had security measures. Each team protected its own assets according to its own threat model. The military operations had one security posture; the civil operations had another. The gap between them had no owner — which made it the most reliable attack surface in the organisation.",
      ],
      fr: [
        "Un rançongiciel dans une entreprise de satellites n'est pas un problème de rançongiciel. C'est la question de savoir quels systèmes vous pouvez vous permettre de perdre, et pour combien de temps, et ce que devient cette réponse pour les systèmes où elle ne se compte plus en heures. Guardian Space : 800 collaborateurs, des satellites de télécommunications civils, une infrastructure de communications militaires, des actifs classifiés et non classifiés cohabitant dans le même contexte organisationnel. Quand la simulation de crise a démarré, la campagne de phishing à l'origine de l'incident avait déjà fait mouche. La première tâche n'était pas de contenir l'attaque, mais de comprendre ce qui était réellement exposé.",
        "Quatre scénarios de risque, retenus pour l'asymétrie de leurs conséquences. R0, le centre des opérations, offrait une bonne visibilité et des pistes de remédiation faciles à suivre. R2, les satellites en orbite, posait une contrainte qui rebat toutes les cartes : on ne corrige pas du matériel en orbite en plein incident. Les vulnérabilités du firmware satellite ne sont pas des expositions passagères, ce sont des données figées pour toute la durée de vie du déploiement. R8, les liaisons de communication sol-espace, est l'endroit où les mondes civil et militaire doivent se rejoindre, et où les obligations de la Loi de Programmation Militaire imposent des exigences sans équivalent civil et sans la moindre latitude d'interprétation. R9, le personnel, était le scénario que chaque partie prenante repoussait en fin de liste. Ce réflexe est, à lui seul, déjà un constat.",
        "Trois cadres réglementaires appliqués de front : ISO 27001 pour le système de management socle, l'article 21 de NIS2 pour les obligations sectorielles de gestion des incidents, et CER pour la protection des infrastructures critiques sur le segment sol. Le PCA/PRA fixait un RTO de six heures sur les fonctions de contrôle satellite : non pas une cible de principe, mais une cible déduite de ce qu'une interruption plus longue impliquerait pour des missions orbitales en cours. La matrice RACI a été dressée avant la feuille de route de remédiation. Produire une feuille de route est facile ; les matrices de responsabilité, elles, sont l'artefact que les organisations repoussent immanquablement, et c'est précisément ce report qui fait qu'une feuille de route se retrouve souvent sans personne pour la mener à terme.",
        "La Direction de la Cybersécurité prévue par la refonte de la gouvernance rend compte directement au comité de direction, fonctionne sur un cycle PDCA aux échéances de revue définies et assume la responsabilité explicite de chaque domaine de contrôle. La priorisation P1/P2/P3 reposait sur deux critères : la gravité des conséquences et la maturité actuelle des contrôles. Le constat qui traversait les quatre scénarios était toujours le même : Guardian Space ne manquait pas de mesures de sécurité. Chaque équipe protégeait ses propres actifs selon son propre modèle de menace. Les opérations militaires avaient leur posture de sécurité, les opérations civiles en avaient une autre. L'écart entre les deux n'avait, lui, aucun responsable attitré, ce qui en faisait la surface d'attaque la plus fiable de toute l'organisation.",
      ],
    },
  },
  {
    slug: "cryptographic-audit",
    index: "005",
    title: { en: "CRYPTOGRAPHIC AUDIT", fr: "AUDIT CRYPTOGRAPHIQUE" },
    image: "/stm32-blue-pill.jpg",
    year: "2025",
    tags: ["Side-Channel", "STM32", "Timing Attack", "Python", "JTAG", "UART"],
    excerpt: {
      en: "Crappy Safe is not a creative name for vulnerable firmware — it is an accurate description. The password check compared characters in sequence and returned failure on the first mismatch. That single design decision turns the authentication routine into a measuring instrument.",
      fr: "« Crappy Safe » n'est pas un nom trouvé pour faire joli sur un firmware vulnérable : c'est une description exacte. La vérification du mot de passe comparait les caractères un à un et s'arrêtait sur un échec dès la première différence. Ce seul choix de conception suffit à transformer la routine d'authentification en instrument de mesure.",
    },
    facts: [
      { label: { en: "CONTEXT", fr: "CONTEXTE" }, value: { en: "Hardware security lab: timing side-channel on an STM32 target", fr: "Lab de sécurité matérielle : canal auxiliaire temporel sur cible STM32" } },
      { label: { en: "ROLE", fr: "RÔLE" }, value: { en: "Attack design, instrumentation, measurement methodology, reporting", fr: "Conception de l'attaque, instrumentation, méthodologie de mesure, rédaction" } },
      { label: { en: "DELIVERABLES", fr: "LIVRABLES" }, value: { en: "Python recovery tool, UART/JTAG bring-up, 15-page report, hardening recommendations", fr: "Outil de récupération Python, mise en route UART/JTAG, rapport de 15 pages, recommandations de durcissement" } },
      { label: { en: "OUTCOME", fr: "RÉSULTAT" }, value: { en: "Full password recovery via median-based timing analysis; fix is constant-time comparison", fr: "Récupération complète du mot de passe par analyse temporelle sur médiane ; correctif : comparaison en temps constant" } },
    ],
    body: {
      en: [
        "Crappy Safe is not a creative name for vulnerable firmware — it is an accurate description. The password verification routine compared characters in sequence and returned failure the moment it found a mismatch. That design decision turns the authentication routine into a measuring instrument: query with a wrong first character, get a response in T₁ milliseconds. Query with a correct first character and a wrong second, get T₂ > T₁. The timing difference is the key. The algorithm is never touched — the attack reads what the hardware cannot help broadcasting.",
        "UART for target communication, JTAG for flashing — with a fix required up front for the clone chip's JTAG ID, which the toolchain refused to recognise. The measurement strategy was median averaging across repeated queries: median rather than mean, because timing distributions on embedded hardware are not Gaussian. Interrupt service routines and clock jitter produce outliers that skew the mean and flatten the signal below the noise floor. The correct estimator required looking at the actual distribution first. That step is absent from most side-channel tutorials, and skipping it is why naive implementations of the attack fail.",
        "The recovery runs as a loop: for each character position, iterate through the candidate set, send a prefixed query, collect N timing measurements, take the median, identify which candidate takes longest. That candidate is correct. Advance to the next position and repeat. The lab's difficulty levels introduced additional noise and active countermeasure attempts — which required adjusting N and detection thresholds, not the fundamental method. The method is robust because the vulnerability is structural: you cannot make early-exit comparison constant-time by adding noise. The noise affects both candidates equally. The relative ordering survives.",
        "The remediation is constant-time string comparison — three lines of code, available in every standard library. The fifteen-page report in Word and LaTeX documents the full experimental arc: measurements that worked, the ones that required re-collection, and the parameter choices that revealed the underlying physics when they were wrong. The hardening recommendations cover constant-time comparison, authentication rate limiting, nonce-based challenge-response, and watchdog integration against fault injection. Documenting what to fix is only useful if the report also explains why the intuitive implementation was wrong — otherwise the next developer makes the same choice for the same reason.",
      ],
      fr: [
        "« Crappy Safe » n'est pas un nom trouvé pour faire joli sur un firmware vulnérable : c'est une description exacte. La routine de vérification du mot de passe comparait les caractères un à un et renvoyait un échec à l'instant précis où elle tombait sur une différence. Ce choix de conception transforme la routine d'authentification en instrument de mesure : interrogez-la avec un premier caractère faux, vous obtenez une réponse en T₁ millisecondes ; avec un premier caractère bon et un deuxième faux, vous obtenez T₂ > T₁. C'est l'écart de temps qui livre la clé. L'algorithme n'est jamais entamé : l'attaque se contente de lire ce que le matériel ne peut s'empêcher d'émettre.",
        "UART pour dialoguer avec la cible, JTAG pour le flashage, avec un correctif nécessaire dès le départ sur l'identifiant JTAG de la puce clonée, que la chaîne d'outils refusait de reconnaître. La mesure s'appuyait sur la médiane de requêtes répétées : la médiane et non la moyenne, car les distributions temporelles sur du matériel embarqué n'ont rien de gaussien. Les routines d'interruption et la gigue d'horloge génèrent des valeurs aberrantes qui faussent la moyenne et noient le signal sous le plancher de bruit. Choisir le bon estimateur supposait de regarder d'abord à quoi ressemblait la distribution réelle. Cette étape manque à la plupart des tutoriels sur les canaux auxiliaires, et c'est en la sautant que les implémentations naïves de l'attaque échouent.",
        "La récupération tourne en boucle : pour chaque position de caractère, parcourir les candidats possibles, envoyer une requête préfixée, relever N mesures de temps, en prendre la médiane et repérer le candidat le plus lent. C'est le bon. On passe alors à la position suivante et on recommence. Les niveaux de difficulté du lab ajoutaient du bruit et des tentatives de contre-mesures actives, ce qui obligeait à retoucher N et les seuils de détection, mais pas la méthode de fond. Celle-ci tient parce que la vulnérabilité est structurelle : ajouter du bruit ne rend pas une comparaison à sortie anticipée constante en temps. Le bruit pèse autant sur les deux candidats, et l'ordre relatif, lui, demeure.",
        "Le correctif tient en une comparaison de chaînes en temps constant : trois lignes de code, présentes dans n'importe quelle bibliothèque standard. Le rapport de quinze pages, sous Word et LaTeX, retrace tout le parcours expérimental : les mesures concluantes, celles qu'il a fallu refaire, et les choix de paramètres qui ont mis au jour la physique sous-jacente justement quand ils étaient mauvais. Les recommandations de durcissement couvrent la comparaison en temps constant, la limitation du débit d'authentification, le défi-réponse à base de nonce et l'ajout d'un watchdog contre l'injection de fautes. Dire ce qu'il faut corriger ne sert à rien si le rapport n'explique pas aussi pourquoi l'implémentation intuitive était fausse : sans cela, le développeur suivant referait le même choix pour les mêmes raisons.",
      ],
    },
  },
  {
    slug: "tower-defense-game",
    index: "007",
    tier: "side",
    title: { en: "TOWER DEFENSE GAME", fr: "JEU TOWER DEFENSE" },
    year: "2026",
    tags: ["Unity", "C#", "Tower Defense", "Fantasy / D&D", "VFX as code", "UI/UX"],
    excerpt: {
      en: "A fantasy, Dungeons & Dragons-flavoured tower defense built in Unity — currently at pre-prototype, with my work spanning development, UI/UX, and VFX authored as code in C#.",
      fr: "Un tower-defense d'inspiration fantasy et Dungeons & Dragons, aujourd'hui au stade du pré-prototype, où j'interviens sur le développement, l'UI/UX et les VFX écrits comme du code, en C#.",
    },
    facts: [
      { label: { en: "CONTEXT", fr: "CONTEXTE" }, value: { en: "Side project — creative engineering, small team", fr: "Projet perso, ingénierie créative, petite équipe" } },
      { label: { en: "ROLE", fr: "RÔLE" }, value: { en: "Development, UI/UX, VFX-as-code", fr: "Développement, UI/UX, VFX-as-code" } },
      { label: { en: "STATUS", fr: "STATUT" }, value: { en: "Pre-prototype — core loop and feel", fr: "Pré-prototype : boucle de jeu et ressenti" } },
      { label: { en: "OUTCOME", fr: "RÉSULTAT" }, value: { en: "Transfers performance budgets and deterministic-systems discipline outside security", fr: "Transfère budgets de perf et discipline des systèmes déterministes hors sécurité" } },
    ],
    body: {
      en: [
        "A tower-defense game with a fantasy, Dungeons & Dragons-flavoured art direction, built in Unity. It is at the pre-prototype stage — the moment where the core loop and the feel are being proven before anything gets polished. My role spans development, UI/UX, and visual effects.",
        "The part I care most about is VFX as code: effects driven and parameterised in C# rather than hand-placed in the editor, so they are reproducible, tweakable, and version-controlled like any other source. Treating effects as code instead of artefacts you click into existence is the same discipline that keeps infrastructure and detection logic maintainable.",
        "Game development is an unusual entry on a security portfolio, but the transferable part is real: performance budgets, deterministic systems, and a UI that has to communicate state clearly under pressure. Building it with a team — under a shared art direction and a deadline — is also where most of the actual engineering happens.",
      ],
      fr: [
        "Un tower-defense à la direction artistique d'inspiration fantasy et Dungeons & Dragons, développé sous Unity. Il en est au pré-prototype : ce moment où l'on valide la boucle de jeu et le ressenti avant de polir quoi que ce soit. J'y interviens sur le développement, l'UI/UX et les effets visuels.",
        "Ce qui me tient le plus à cœur, ce sont les VFX as code : des effets pilotés et paramétrés en C# plutôt que posés à la main dans l'éditeur, pour qu'ils restent reproductibles, ajustables et versionnés au même titre que n'importe quelle source. Traiter les effets comme du code, et non comme des objets que l'on fait surgir au clic, c'est exactement la discipline qui garde l'infrastructure et la logique de détection maintenables.",
        "Le développement de jeu détonne dans un portfolio de sécurité, mais ce qui s'y transfère est bien réel : budgets de performance, systèmes déterministes, et une interface qui doit donner à lire l'état du jeu clairement, même sous pression. Et c'est en le construisant à plusieurs, sous une direction artistique partagée et avec une échéance, que se fait l'essentiel du vrai travail d'ingénierie.",
      ],
    },
  },
  {
    slug: "homelab-proxmox",
    index: "006",
    title: { en: "HOMELAB · PROXMOX", fr: "HOMELAB · PROXMOX" },
    year: "2026",
    tags: ["Proxmox", "Wazuh", "Self-hosted", "Linux", "Networking"],
    excerpt: {
      en: "A small Proxmox homelab on a laptop — Ryzen 7, 16 GB, 512 GB NVMe — running real workloads: game servers for friends, a Wazuh stack, and a provisioning box for testing.",
      fr: "Un petit homelab Proxmox sur un ordinateur portable (Ryzen 7, 16 Go, NVMe de 512 Go) qui fait tourner de vraies charges : des serveurs de jeu pour des amis, une stack Wazuh et une machine de provisionnement pour les tests.",
    },
    facts: [
      { label: { en: "CONTEXT", fr: "CONTEXTE" }, value: { en: "Personal infrastructure, running continuously", fr: "Infrastructure personnelle, en fonctionnement continu" } },
      { label: { en: "ROLE", fr: "RÔLE" }, value: { en: "Sole operator: build, segmentation, detection, upkeep", fr: "Opérateur unique : montage, segmentation, détection, maintien" } },
      { label: { en: "DELIVERABLES", fr: "LIVRABLES" }, value: { en: "Proxmox host, game servers via playit.gg tunnel, Wazuh detection stack, provisioning box", fr: "Hôte Proxmox, serveurs de jeu via tunnel playit.gg, stack de détection Wazuh, machine de provisionnement" } },
      { label: { en: "OUTCOME", fr: "RÉSULTAT" }, value: { en: "Live detection engineering against real logs; least privilege and segmentation as muscle memory", fr: "Ingénierie de détection sur de vrais journaux ; moindre privilège et segmentation devenus des réflexes" } },
    ],
    body: {
      en: [
        "The homelab is where the infrastructure and detection skills get rehearsed on something low-stakes and genuinely real. It runs Proxmox on a single laptop — a Ryzen 7 (7000-series), 16 GB of RAM, a 512 GB NVMe — deliberately modest, because the constraint is the lesson: you learn more squeezing real services onto limited hardware than you do with headroom to waste.",
        "It hosts a Cobblemon Minecraft server and other game servers for friends, exposed to the internet through a playit.gg tunnel so nothing at home has to be port-forwarded or directly reachable. Alongside the game servers runs a Wazuh stack — so the same box that serves friends is also where I practise detection engineering against real logs — and a provisioning server used to stand up and tear down test environments on demand.",
        "Running services other people depend on, even for a game, teaches what coursework cannot: uptime, backups, and the immediate cost of a misconfiguration when someone is actually using the thing. It is also where least privilege, segmentation, and zero-trust thinking stop being slides and become muscle memory — applied to a network I own, can break, and have to fix.",
      ],
      fr: [
        "Le homelab, c'est là que mes compétences en infrastructure et en détection se rodent sur quelque chose à faible enjeu, mais bien réel. Il fait tourner Proxmox sur un unique ordinateur portable (un Ryzen 7 série 7000, 16 Go de RAM, un NVMe de 512 Go), volontairement modeste, parce que c'est la contrainte qui instruit : on apprend bien plus à faire tenir de vrais services sur du matériel limité qu'avec de la marge à gaspiller.",
        "Il héberge un serveur Minecraft Cobblemon et d'autres serveurs de jeu pour des amis, exposés sur Internet via un tunnel playit.gg, si bien que rien à la maison n'a besoin d'ouverture de port ni d'accès direct. À côté des serveurs de jeu tourne une stack Wazuh, de sorte que la machine qui rend service aux amis est aussi celle où je m'exerce à l'ingénierie de détection sur de vrais journaux, ainsi qu'un serveur de provisionnement pour monter et démonter des environnements de test à la demande.",
        "Faire tourner des services dont d'autres dépendent, même pour un jeu, vous apprend ce qu'aucun cours ne transmettra jamais : la disponibilité, les sauvegardes et le coût immédiat d'une erreur de configuration quand quelqu'un, là, maintenant, est en train de s'en servir. C'est aussi là que le moindre privilège, la segmentation et la logique Zero Trust cessent d'être des diapositives pour devenir des réflexes, sur un réseau qui m'appartient, que je peux casser et que je dois réparer.",
      ],
    },
  },
];

// Display order: core security work first, then side (creative) projects,
// each group by its index. Used by the fieldwork list and detail-page nav so
// they agree.
const tierRank = (w: WorkItem) => (w.tier === "side" ? 1 : 0);
export const orderedWork: WorkItem[] = [...work].sort(
  (a, b) => tierRank(a) - tierRank(b) || a.index.localeCompare(b.index),
);

// Adjacent-project navigation helper used in work/[slug] pages.
export function getAdjacentWork(
  slug: string
): { prev: WorkItem | null; next: WorkItem | null } {
  const idx = orderedWork.findIndex((w) => w.slug === slug);
  return {
    prev: idx > 0 ? orderedWork[idx - 1] : null,
    next: idx < orderedWork.length - 1 ? orderedWork[idx + 1] : null,
  };
}
