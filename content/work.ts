import type { Localized } from "@/lib/i18n";

export type WorkItem = {
  slug: string;
  index: string;
  title: Localized<string>;
  year: string;
  tags: string[];
  excerpt: Localized<string>;
  body: Localized<string[]>;   // paragraphs of editorial copy
  image?: string;   // optional path relative to /public — omit when no asset exists yet
  liveUrl?: string; // optional public / live site link
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
      fr: "La plateforme sur laquelle je reviens sans cesse. Un environnement full-stack d'apprentissage de la cybersécurité où le plus dur n'a jamais été d'écrire les leçons : c'était de faire en sorte que la progression se mérite et de garder une base de données multi-tenant rigoureuse sur qui a le droit de lire quoi.",
    },
    body: {
      en: [
        "CyberLearn is the project everything else orbits. It is a Turborepo monorepo on Next.js 15, with Supabase and Prisma underneath — a French-first platform for learning cybersecurity that is built as a product, not a demo. The interesting engineering was never the lesson content. It was the data model, the authorisation boundary, and the systems that decide what a learner sees and when.",
        "Authorisation is enforced in PostgreSQL through Row-Level Security, not in the application layer. The reasoning is the same one the rest of my work keeps arriving at: the application is not the only thing that can reach the database, so the application cannot be the only thing that enforces access. RLS hardening pushes the trust boundary down to the row, where it survives a compromised API route, a misused service key, or a query written by someone who forgot the tenant check. Getting the policies right — and proving they fail closed — was the part that took longest and mattered most.",
        "On top of that sits a gamification layer: streaks, quests, leagues, cosmetics, and an end-of-period \"wrapped\". The design constraint was to reward consistency without turning learning into a slot machine — motivation systems that respect the learner's time rather than farming it. The content side runs a video pipeline built on Remotion and ElevenLabs, turning written scripts into narrated lessons, because content production is the real bottleneck for any learning platform and automating it is what makes a catalogue maintainable by one person.",
        "The catalogue itself was reorganised into structured DevOps and DevSecOps tracks — sequenced paths rather than a flat list of topics. A learning platform is a schema problem disguised as a content problem: the decisions about progression, prerequisites, and how completion unlocks the next thing constrain everything the product can become later. Most of those decisions had to be made once and be correct, because migrating progression logic under live users is a cost that prototype environments never reveal.",
      ],
      fr: [
        "CyberLearn est le projet autour duquel tout le reste gravite. C'est un monorepo Turborepo sur Next.js 15, avec Supabase et Prisma en dessous : une plateforme « French-first » pour apprendre la cybersécurité, conçue comme un produit et non comme une démo. L'ingénierie intéressante n'a jamais été le contenu des leçons. C'était le modèle de données, la frontière d'autorisation et les systèmes qui décident de ce qu'un apprenant voit, et quand.",
        "L'autorisation est appliquée dans PostgreSQL via la Row-Level Security, pas dans la couche applicative. Le raisonnement est le même que celui auquel le reste de mon travail aboutit constamment : l'application n'est pas la seule chose capable d'atteindre la base de données, donc l'application ne peut pas être la seule chose qui fait respecter les accès. Le durcissement RLS pousse la frontière de confiance jusqu'à la ligne, où elle survit à une route d'API compromise, à une clé de service détournée ou à une requête écrite par quelqu'un qui a oublié le contrôle de tenant. Bien définir les politiques (et prouver qu'elles échouent en mode fermé) a été la partie la plus longue et la plus déterminante.",
        "Par-dessus vient une couche de gamification : streaks, quêtes, ligues, cosmétiques et un « wrapped » de fin de période. La contrainte de conception était de récompenser la régularité sans transformer l'apprentissage en machine à sous : des systèmes de motivation qui respectent le temps de l'apprenant plutôt que de l'exploiter. Côté contenu, un pipeline vidéo bâti sur Remotion et ElevenLabs transforme des scripts écrits en leçons narrées, parce que la production de contenu est le véritable goulet d'étranglement de toute plateforme d'apprentissage et que l'automatiser est ce qui rend un catalogue maintenable par une seule personne.",
        "Le catalogue lui-même a été réorganisé en parcours DevOps et DevSecOps structurés : des cheminements séquencés plutôt qu'une liste plate de sujets. Une plateforme d'apprentissage est un problème de schéma déguisé en problème de contenu : les décisions sur la progression, les prérequis et la façon dont l'achèvement débloque l'étape suivante contraignent tout ce que le produit pourra devenir par la suite. La plupart de ces décisions devaient être prises une seule fois et être justes, car migrer la logique de progression sous des utilisateurs en production est un coût que les environnements de prototype ne révèlent jamais.",
      ],
    },
  },
  {
    slug: "nullsec",
    index: "002",
    title: { en: "NULLSEC", fr: "NULLSEC" },
    year: "2025",
    tags: ["Next.js 16", "GSAP", "Lenis", "Tailwind v4", "Typst"],
    excerpt: {
      en: "The site you are reading. An editorial-brutalist portfolio built under deliberate constraint — four colours, no gradients, three typefaces — where the content is typed data and the CVs are compiled from source.",
      fr: "Le site que vous lisez. Un portfolio éditorial-brutaliste conçu sous contrainte délibérée (quatre couleurs, aucun dégradé, trois typographies) où le contenu est de la donnée typée et les CV sont compilés depuis les sources.",
    },
    body: {
      en: [
        "NULLSEC is this site. The brief I set myself was a constraint, not a moodboard: four colours, no gradients, three typefaces, and motion that earns its place. Constraints are a design forcing-function — they remove the decisions that do not matter so the ones that do become obvious. The result is editorial rather than decorative, which is the right register for security work.",
        "Motion runs on GSAP and Lenis. Every animation is guarded by a reduced-motion check and torn down through GSAP's context cleanup, so the site degrades gracefully instead of breaking for anyone who has opted out or arrived on hardware that cannot keep up. Smooth scroll that fights the browser is worse than none at all; the discipline is in the cleanup paths, not the keyframes.",
        "Content is data. The profile, projects, certifications, and writing all live in typed TypeScript modules as a single source of truth, and the pages are generated from them — adding a project means editing a file, never touching a component. The CVs are authored in Typst, CV-as-code: versioned, diffable, reproducible PDFs that rebuild from source instead of being maintained by hand in a word processor.",
      ],
      fr: [
        "NULLSEC, c'est ce site. Le cahier des charges que je me suis imposé était une contrainte, pas un moodboard : quatre couleurs, aucun dégradé, trois typographies et une animation qui justifie sa présence. Les contraintes sont un mécanisme de forçage de la conception : elles éliminent les décisions qui n'ont pas d'importance pour rendre évidentes celles qui en ont. Le résultat est éditorial plutôt que décoratif, ce qui est le bon registre pour un travail de sécurité.",
        "L'animation repose sur GSAP et Lenis. Chaque animation est protégée par un contrôle « reduced-motion » et démantelée via le nettoyage de contexte de GSAP, afin que le site se dégrade proprement au lieu de casser pour quiconque a refusé le mouvement ou est arrivé sur un matériel incapable de suivre. Un défilement fluide qui se bat contre le navigateur est pire que pas de défilement du tout ; la discipline est dans les chemins de nettoyage, pas dans les keyframes.",
        "Le contenu est de la donnée. Le profil, les projets, les certifications et les écrits vivent tous dans des modules TypeScript typés comme source unique de vérité, et les pages en sont générées : ajouter un projet revient à éditer un fichier, jamais à toucher un composant. Les CV sont rédigés en Typst, en « CV-as-code » : des PDF versionnés, comparables (diffables) et reproductibles, qui se reconstruisent depuis les sources au lieu d'être entretenus à la main dans un traitement de texte.",
      ],
    },
  },
  {
    slug: "zero-trust-architecture",
    index: "003",
    title: { en: "ZERO TRUST ARCHITECTURE", fr: "ARCHITECTURE ZERO TRUST" },
    image: "/ZeroTrust.png",
    year: "2025",
    tags: ["NIST SP 800-207", "OPNsense", "Suricata", "Wazuh", "NIS2", "PKI"],
    excerpt: {
      en: "Designing a Zero Trust migration for an organisation that already exists is a different problem from designing for one that does not. NIST SP 800-207 describes the destination clearly. It says almost nothing about the journey.",
      fr: "Concevoir une migration Zero Trust pour une organisation qui existe déjà est un problème différent de la concevoir pour une organisation qui n'existe pas. NIST SP 800-207 décrit clairement la destination. Il ne dit presque rien du trajet.",
    },
    body: {
      en: [
        "Designing a zero trust architecture for a multi-site logistics company that is already running is a different problem from designing for one that does not exist yet. The existing network has credentials, traffic flows, and operational dependencies that keep the business alive — and a migration that cannot break any of them. NIST SP 800-207 describes the destination with precision. It says almost nothing about how to get there from a network built ten years ago by people who are no longer employed by the company.",
        "The addressing scheme — 10.SITE.VLAN.0/24, second octet for site, third for function — was chosen for auditability over cleverness. A plan a new network engineer can read in five minutes is one they cannot misconfigure silently. The inter-VLAN traffic matrix was built differently: starting from empty and adding only what each business function demonstrably required, not what the existing network allowed. The existing network allowed too much. This is almost universally true. The identity stack — Step-CA for internal PKI, Authentik as the identity provider with hardware MFA, Teleport replacing direct SSH and RDP — was the most sequencing-sensitive part of the architecture. Misconfigure the trust chain at the CA level and every certificate signed against it is suspect.",
        "The three-year TCO came to approximately €25,200 on QEMU/KVM infrastructure, built from component-level cost attribution rather than vendor quote. The difference matters: a vendor quote tells you what a solution costs to purchase. Component-level attribution tells you what it costs to run — including the operational labour that vendor quotes consistently omit. The NIS2 Article 21 compliance mapping was generated from the architecture documentation, not retrospectively: each control justified against a design decision, not claimed against a deployed component. The homelab implementation ran OPNsense with Suricata in IPS mode on the perimeter, Nginx with CrowdSec on the DMZ, and Wazuh receiving logs from every segment.",
        "Five deployment phases, each leaving the network more restrictive than the last, each designed so that a failure in that phase rolls back without cascading. Phase one deploys the identity infrastructure without deprecating existing credentials — which feels counterproductive and is operationally essential. The paired hands-on lab guide exists for a specific reason: a Technical Architecture Document that cannot be implemented is a design opinion dressed as engineering. The guide closes the gap between the document and the working system.",
      ],
      fr: [
        "Concevoir une architecture Zero Trust pour une entreprise de logistique multi-sites déjà en production est un problème différent de la concevoir pour une entreprise qui n'existe pas encore. Le réseau existant possède des identifiants, des flux de trafic et des dépendances opérationnelles qui maintiennent l'activité en vie, et la migration ne doit en briser aucun. NIST SP 800-207 décrit la destination avec précision. Il ne dit presque rien sur la manière d'y parvenir depuis un réseau bâti il y a dix ans par des personnes qui ne travaillent plus dans l'entreprise.",
        "Le plan d'adressage (10.SITE.VLAN.0/24, deuxième octet pour le site, troisième pour la fonction) a été choisi pour son auditabilité plutôt que pour son ingéniosité. Un plan qu'un nouvel ingénieur réseau peut lire en cinq minutes est un plan qu'il ne peut pas mal configurer en silence. La matrice de trafic inter-VLAN a été construite autrement : en partant de zéro et en n'ajoutant que ce dont chaque fonction métier avait démontrablement besoin, pas ce que le réseau existant autorisait. Le réseau existant autorisait trop. C'est presque toujours vrai. La pile d'identité (Step-CA pour la PKI interne, Authentik comme fournisseur d'identité avec MFA matériel, Teleport remplaçant le SSH et le RDP directs) était la partie la plus sensible au séquencement de l'architecture. Mal configurez la chaîne de confiance au niveau de l'autorité de certification et chaque certificat signé par elle devient suspect.",
        "Le TCO sur trois ans s'est élevé à environ 25 200 €, sur une infrastructure QEMU/KVM, construit à partir d'une attribution des coûts au niveau des composants plutôt que d'un devis fournisseur. La différence compte : un devis fournisseur vous dit ce qu'une solution coûte à l'achat. L'attribution au niveau des composants vous dit ce qu'elle coûte à exploiter, y compris le travail opérationnel que les devis fournisseurs omettent systématiquement. La cartographie de conformité à l'article 21 de NIS2 a été générée depuis la documentation d'architecture, pas a posteriori : chaque mesure justifiée par une décision de conception, pas revendiquée face à un composant déployé. L'implémentation en homelab faisait tourner OPNsense avec Suricata en mode IPS sur le périmètre, Nginx avec CrowdSec sur la DMZ, et Wazuh recevant les journaux de chaque segment.",
        "Cinq phases de déploiement, chacune laissant le réseau plus restrictif que la précédente, chacune conçue pour qu'une défaillance lors de cette phase soit annulée sans effet en cascade. La première phase déploie l'infrastructure d'identité sans déprécier les identifiants existants, ce qui paraît contre-productif et reste opérationnellement essentiel. Le guide de lab pratique associé existe pour une raison précise : un document d'architecture technique qui ne peut pas être mis en œuvre n'est qu'une opinion de conception déguisée en ingénierie. Le guide comble l'écart entre le document et le système qui fonctionne.",
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
      fr: "Un rançongiciel dans une entreprise de satellites n'est pas un problème de rançongiciel. C'est une question de savoir quels systèmes vous pouvez vous permettre de perdre, et pour combien de temps, et à quoi ressemble la réponse pour les systèmes dont la réponse ne se mesure pas en heures.",
    },
    body: {
      en: [
        "Ransomware in a satellite company is not a ransomware problem. It is a question of which systems you can afford to lose, for how long, and what the answer looks like for systems where the answer is not measured in hours. Guardian Space: 800 employees, civil telecommunications satellites, military communications infrastructure, classified and unclassified assets sharing the same organisational context. The phishing campaign that seeded the incident had already succeeded by the time the crisis simulation began. The first task was not containment. It was understanding what was actually at risk.",
        "Four risk scenarios, chosen for their consequence asymmetry. R0 — the operations centre — had good visibility and tractable remediation paths. R2 — on-orbit satellites — introduced a constraint that changes every calculation: you cannot patch hardware in orbit during an active incident. Vulnerabilities in satellite firmware are not temporary exposures; they are facts of the deployment lifetime. R8 — ground-to-space communication links — is where the civil and military environments must intersect, and where French Military Programming Law obligations impose requirements with no civilian equivalent and no flexibility for interpretation. R9 — personnel — was the scenario every stakeholder wanted to discuss last. That instinct is itself a finding.",
        "Three regulatory frameworks applied simultaneously: ISO 27001 for the baseline management system, NIS2 Article 21 for sector-specific incident handling obligations, CER for critical infrastructure protection on the ground segment. The BCP/DRP set a six-hour RTO on satellite control functions — not an aspirational target, but one derived from what a longer outage would mean for active orbital missions. The RACI matrix was built before the remediation roadmap. Roadmaps are straightforward to produce. Accountability matrices are the artefact organisations consistently defer, and deferring them is why roadmaps often have no one responsible for seeing them through.",
        "The Cybersecurity Directorate proposed in the governance redesign reports directly to the C-suite, operates on a PDCA cycle with defined review cadences, and carries explicit ownership of every control domain. The P1/P2/P3 prioritisation was driven by two factors: consequence severity and current control maturity. The finding that ran through all four risk scenarios was the same: Guardian Space had security measures. Each team protected its own assets according to its own threat model. The military operations had one security posture; the civil operations had another. The gap between them had no owner — which made it the most reliable attack surface in the organisation.",
      ],
      fr: [
        "Un rançongiciel dans une entreprise de satellites n'est pas un problème de rançongiciel. C'est une question de savoir quels systèmes vous pouvez vous permettre de perdre, et pour combien de temps, et à quoi ressemble la réponse pour les systèmes dont la réponse ne se mesure pas en heures. Guardian Space : 800 employés, des satellites de télécommunications civils, une infrastructure de communications militaires, des actifs classifiés et non classifiés partageant le même contexte organisationnel. La campagne de phishing à l'origine de l'incident avait déjà réussi au moment où la simulation de crise a commencé. La première tâche n'était pas le confinement. C'était de comprendre ce qui était réellement en jeu.",
        "Quatre scénarios de risque, choisis pour leur asymétrie de conséquences. R0, le centre des opérations, offrait une bonne visibilité et des voies de remédiation accessibles. R2, les satellites en orbite, introduisait une contrainte qui change tous les calculs : vous ne pouvez pas corriger du matériel en orbite pendant un incident actif. Les vulnérabilités du firmware satellite ne sont pas des expositions temporaires ; ce sont des faits qui durent toute la vie du déploiement. R8, les liaisons de communication sol-espace, est le point où les environnements civil et militaire doivent se croiser, et où les obligations de la Loi de Programmation Militaire française imposent des exigences sans équivalent civil et sans aucune marge d'interprétation. R9, le personnel, était le scénario que chaque partie prenante voulait aborder en dernier. Cet instinct est en soi un constat.",
        "Trois cadres réglementaires appliqués simultanément : ISO 27001 pour le système de management de base, l'article 21 de NIS2 pour les obligations sectorielles de gestion des incidents, CER pour la protection des infrastructures critiques sur le segment sol. Le PCA/PRA fixait un RTO de six heures sur les fonctions de contrôle satellite : non pas une cible idéale, mais une cible dérivée de ce qu'une panne plus longue signifierait pour des missions orbitales actives. La matrice RACI a été construite avant la feuille de route de remédiation. Les feuilles de route sont simples à produire. Les matrices de responsabilité sont l'artefact que les organisations reportent systématiquement, et ce report est la raison pour laquelle les feuilles de route n'ont souvent personne pour les mener à bien.",
        "La Direction de la Cybersécurité proposée dans la refonte de la gouvernance rend compte directement à la direction générale, fonctionne selon un cycle PDCA avec des cadences de revue définies, et porte la responsabilité explicite de chaque domaine de contrôle. La priorisation P1/P2/P3 reposait sur deux facteurs : la gravité des conséquences et la maturité actuelle des contrôles. Le constat qui traversait les quatre scénarios de risque était le même : Guardian Space disposait de mesures de sécurité. Chaque équipe protégeait ses propres actifs selon son propre modèle de menace. Les opérations militaires avaient une posture de sécurité ; les opérations civiles en avaient une autre. L'écart entre les deux n'avait aucun propriétaire, ce qui en faisait la surface d'attaque la plus fiable de l'organisation.",
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
      fr: "« Crappy Safe » n'est pas un nom créatif pour un firmware vulnérable : c'est une description exacte. La vérification du mot de passe comparait les caractères dans l'ordre et renvoyait un échec dès la première différence. Cette seule décision de conception transforme la routine d'authentification en instrument de mesure.",
    },
    body: {
      en: [
        "Crappy Safe is not a creative name for a vulnerable firmware — it is an accurate description. The password verification routine compared characters in sequence and returned failure the moment it found a mismatch. That design decision turns the authentication routine into a measuring instrument: query with a wrong first character, get a response in T₁ milliseconds. Query with a correct first character and a wrong second, get T₂ > T₁. The timing difference is the key. The algorithm is never touched — the attack reads what the hardware cannot help broadcasting.",
        "UART for target communication, JTAG for flashing — with a fix required up front for the clone chip's JTAG ID, which the toolchain refused to recognise. The measurement strategy was median averaging across repeated queries: median rather than mean, because timing distributions on embedded hardware are not Gaussian. Interrupt service routines and clock jitter produce outliers that skew the mean and flatten the signal below the noise floor. The correct estimator required looking at the actual distribution first. That step is absent from most side-channel tutorials, and skipping it is why naive implementations of the attack fail.",
        "The recovery runs as a loop: for each character position, iterate through the candidate set, send a prefixed query, collect N timing measurements, take the median, identify which candidate takes longest. That candidate is correct. Advance to the next position and repeat. The lab's difficulty levels introduced additional noise and active countermeasure attempts — which required adjusting N and detection thresholds, not the fundamental method. The method is robust because the vulnerability is structural: you cannot make early-exit comparison constant-time by adding noise. The noise affects both candidates equally. The relative ordering survives.",
        "The remediation is constant-time string comparison — three lines of code, available in every standard library. The fifteen-page report in Word and LaTeX documents the full experimental arc: measurements that worked, the ones that required re-collection, and the parameter choices that revealed the underlying physics when they were wrong. The hardening recommendations cover constant-time comparison, authentication rate limiting, nonce-based challenge-response, and watchdog integration against fault injection. Documenting what to fix is only useful if the report also explains why the intuitive implementation was wrong — otherwise the next developer makes the same choice for the same reason.",
      ],
      fr: [
        "« Crappy Safe » n'est pas un nom créatif pour un firmware vulnérable : c'est une description exacte. La routine de vérification du mot de passe comparait les caractères dans l'ordre et renvoyait un échec à l'instant même où elle trouvait une différence. Cette décision de conception transforme la routine d'authentification en instrument de mesure : interrogez avec un premier caractère erroné, obtenez une réponse en T₁ millisecondes. Interrogez avec un premier caractère correct et un deuxième erroné, obtenez T₂ > T₁. La différence de temps est la clé. L'algorithme n'est jamais touché : l'attaque lit ce que le matériel ne peut s'empêcher de diffuser.",
        "UART pour la communication avec la cible, JTAG pour le flashage, avec un correctif requis d'emblée pour l'identifiant JTAG de la puce clonée, que la chaîne d'outils refusait de reconnaître. La stratégie de mesure reposait sur une moyenne médiane à travers des requêtes répétées : la médiane plutôt que la moyenne, car les distributions temporelles sur du matériel embarqué ne sont pas gaussiennes. Les routines de service d'interruption et la gigue d'horloge produisent des valeurs aberrantes qui faussent la moyenne et aplatissent le signal sous le plancher de bruit. Le bon estimateur exigeait d'examiner d'abord la distribution réelle. Cette étape est absente de la plupart des tutoriels sur les canaux auxiliaires, et l'omettre est la raison pour laquelle les implémentations naïves de l'attaque échouent.",
        "La récupération fonctionne en boucle : pour chaque position de caractère, parcourir l'ensemble des candidats, envoyer une requête préfixée, collecter N mesures de temps, prendre la médiane, identifier quel candidat prend le plus de temps. Ce candidat est le bon. Passer à la position suivante et recommencer. Les niveaux de difficulté du lab introduisaient du bruit supplémentaire et des tentatives de contre-mesures actives, ce qui exigeait d'ajuster N et les seuils de détection, pas la méthode fondamentale. La méthode est robuste parce que la vulnérabilité est structurelle : on ne peut pas rendre constante en temps une comparaison à sortie anticipée en ajoutant du bruit. Le bruit affecte les deux candidats de la même manière. L'ordre relatif survit.",
        "La remédiation est la comparaison de chaînes en temps constant : trois lignes de code, disponibles dans toute bibliothèque standard. Le rapport de quinze pages, en Word et en LaTeX, documente l'arc expérimental complet : les mesures qui ont fonctionné, celles qui ont nécessité une nouvelle collecte, et les choix de paramètres qui ont révélé la physique sous-jacente lorsqu'ils étaient mauvais. Les recommandations de durcissement couvrent la comparaison en temps constant, la limitation du débit d'authentification, le défi-réponse basé sur un nonce et l'intégration d'un watchdog contre l'injection de fautes. Documenter ce qu'il faut corriger n'est utile que si le rapport explique aussi pourquoi l'implémentation intuitive était fausse : sinon, le prochain développeur fera le même choix pour la même raison.",
      ],
    },
  },
  {
    slug: "tower-defense-game",
    index: "006",
    title: { en: "TOWER DEFENSE GAME", fr: "JEU TOWER DEFENSE" },
    year: "2026",
    tags: ["Unity", "C#", "Tower Defense", "Fantasy / D&D", "VFX as code", "UI/UX"],
    excerpt: {
      en: "A fantasy, Dungeons & Dragons-flavoured tower-defense built — currently at pre-prototype, with my work spanning development, UI/UX, and VFX authored as code in C#.",
      fr: "Un tower-defense d'inspiration fantasy et Dungeons & Dragons, actuellement au stade de pré-prototype, où mon travail couvre le développement, l'UI/UX et les VFX écrits comme du code en C#.",
    },
    body: {
      en: [
        "A tower-defense game with a fantasy, Dungeons & Dragons-flavoured art direction, built in Unity . It is at the pre-prototype stage — the moment where the core loop and the feel are being proven before anything gets polished. My role spans development, UI/UX, and visual effects.",
        "The part I care most about is VFX as code: effects driven and parameterised in C# rather than hand-placed in the editor, so they are reproducible, tweakable, and version-controlled like any other source. Treating effects as code instead of artefacts you click into existence is the same discipline that keeps infrastructure and detection logic maintainable.",
        "Game development is an unusual entry on a security portfolio, but the transferable part is real: performance budgets, deterministic systems, and a UI that has to communicate state clearly under pressure. Building it with a team — under a shared art direction and a deadline — is also where most of the actual engineering happens.",
      ],
      fr: [
        "Un jeu de tower-defense avec une direction artistique d'inspiration fantasy et Dungeons & Dragons, construit dans Unity. Il en est au stade de pré-prototype : le moment où la boucle de jeu et le ressenti sont validés avant que quoi que ce soit ne soit peaufiné. Mon rôle couvre le développement, l'UI/UX et les effets visuels.",
        "La partie qui me tient le plus à cœur, ce sont les VFX as code : des effets pilotés et paramétrés en C# plutôt que placés à la main dans l'éditeur, afin qu'ils soient reproductibles, ajustables et versionnés comme n'importe quelle autre source. Traiter les effets comme du code plutôt que comme des artefacts que l'on fait apparaître au clic relève de la même discipline que celle qui garde l'infrastructure et la logique de détection maintenables.",
        "Le développement de jeu est une entrée inhabituelle dans un portfolio de sécurité, mais la part transférable est réelle : budgets de performance, systèmes déterministes et une interface qui doit communiquer clairement l'état sous pression. Le construire en équipe (sous une direction artistique commune et une échéance) est aussi l'endroit où se déroule l'essentiel de l'ingénierie réelle.",
      ],
    },
  },
  {
    slug: "homelab-proxmox",
    index: "007",
    title: { en: "HOMELAB · PROXMOX", fr: "HOMELAB · PROXMOX" },
    year: "2026",
    tags: ["Proxmox", "Wazuh", "Self-hosted", "Linux", "Networking"],
    excerpt: {
      en: "A small Proxmox homelab on a laptop — Ryzen 7, 16 GB, 512 GB NVMe — running real workloads: game servers for friends, a Wazuh stack, and a provisioning box for testing.",
      fr: "Un petit homelab Proxmox sur un ordinateur portable (Ryzen 7, 16 Go, NVMe de 512 Go) qui fait tourner de vraies charges de travail : des serveurs de jeu pour des amis, une stack Wazuh et une machine de provisionnement pour les tests.",
    },
    body: {
      en: [
        "The homelab is where the infrastructure and detection skills get rehearsed on something low-stakes and genuinely real. It runs Proxmox on a single laptop — a Ryzen 7 (7000-series), 16 GB of RAM, a 512 GB NVMe — deliberately modest, because the constraint is the lesson: you learn more squeezing real services onto limited hardware than you do with headroom to waste.",
        "It hosts a Cobblemon Minecraft server and other game servers for friends, exposed to the internet through a playit.gg tunnel so nothing at home has to be port-forwarded or directly reachable. Alongside the game servers runs a Wazuh stack — so the same box that serves friends is also where I practise detection engineering against real logs — and a provisioning server used to stand up and tear down test environments on demand.",
        "Running services other people depend on, even for a game, teaches what coursework cannot: uptime, backups, and the immediate cost of a misconfiguration when someone is actually using the thing. It is also where least privilege, segmentation, and zero-trust thinking stop being slides and become muscle memory — applied to a network I own, can break, and have to fix.",
      ],
      fr: [
        "Le homelab est l'endroit où les compétences d'infrastructure et de détection se répètent sur quelque chose à faible enjeu et réellement concret. Il fait tourner Proxmox sur un seul ordinateur portable (un Ryzen 7 de série 7000, 16 Go de RAM, un NVMe de 512 Go), délibérément modeste, parce que la contrainte est la leçon : on apprend davantage en faisant tenir de vrais services sur un matériel limité qu'avec de la marge à gaspiller.",
        "Il héberge un serveur Minecraft Cobblemon et d'autres serveurs de jeu pour des amis, exposés à Internet via un tunnel playit.gg, de sorte que rien à la maison n'a besoin d'être redirigé par port ni directement accessible. À côté des serveurs de jeu tourne une stack Wazuh (ainsi la même machine qui sert les amis est aussi celle où je pratique l'ingénierie de détection sur de vrais journaux) et un serveur de provisionnement servant à monter et démonter des environnements de test à la demande.",
        "Faire tourner des services dont d'autres personnes dépendent, même pour un jeu, enseigne ce que les cours ne peuvent pas : la disponibilité, les sauvegardes et le coût immédiat d'une mauvaise configuration quand quelqu'un utilise réellement la chose. C'est aussi là que le moindre privilège, la segmentation et la pensée Zero Trust cessent d'être des diapositives pour devenir une mémoire musculaire, appliqués à un réseau que je possède, que je peux casser et que je dois réparer.",
      ],
    },
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
