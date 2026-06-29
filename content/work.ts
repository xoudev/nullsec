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
      fr: "La plateforme sur laquelle je reviens toujours. Un environnement full-stack d'apprentissage de la cybersécurité où le plus dur n'a jamais été de rédiger les leçons, mais de faire en sorte que la progression se mérite et de tenir une base multi-tenant rigoureuse sur les droits de lecture de chacun.",
    },
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
    year: "2025",
    tags: ["Next.js 16", "GSAP", "Lenis", "Tailwind v4", "Typst"],
    excerpt: {
      en: "The site you are reading. An editorial-brutalist portfolio built under deliberate constraint — four colours, no gradients, three typefaces — where the content is typed data and the CVs are compiled from source.",
      fr: "Le site que vous êtes en train de lire. Un portfolio éditorial-brutaliste conçu sous contrainte délibérée (quatre couleurs, aucun dégradé, trois typographies), où le contenu n'est que de la donnée structurée et où les CV se compilent depuis les sources.",
    },
    body: {
      en: [
        "NULLSEC is this site. The brief I set myself was a constraint, not a moodboard: four colours, no gradients, three typefaces, and motion that earns its place. Constraints are a design forcing-function — they remove the decisions that do not matter so the ones that do become obvious. The result is editorial rather than decorative, which is the right register for security work.",
        "Motion runs on GSAP and Lenis. Every animation is guarded by a reduced-motion check and torn down through GSAP's context cleanup, so the site degrades gracefully instead of breaking for anyone who has opted out or arrived on hardware that cannot keep up. Smooth scroll that fights the browser is worse than none at all; the discipline is in the cleanup paths, not the keyframes.",
        "Content is data. The profile, projects, certifications, and writing all live in typed TypeScript modules as a single source of truth, and the pages are generated from them — adding a project means editing a file, never touching a component. The CVs are authored in Typst, CV-as-code: versioned, diffable, reproducible PDFs that rebuild from source instead of being maintained by hand in a word processor.",
      ],
      fr: [
        "NULLSEC, c'est ce site. Le cahier des charges que je me suis fixé tenait de la contrainte, pas du moodboard : quatre couleurs, aucun dégradé, trois typographies et une animation qui doit justifier sa présence. La contrainte agit comme un révélateur de conception : elle écarte les décisions sans importance pour faire ressortir celles qui comptent. Le résultat est éditorial plutôt que décoratif, et c'est le bon registre pour un travail de sécurité.",
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
    year: "2025",
    tags: ["NIST SP 800-207", "OPNsense", "Suricata", "Wazuh", "NIS2", "PKI"],
    excerpt: {
      en: "Designing a Zero Trust migration for an organisation that already exists is a different problem from designing for one that does not. NIST SP 800-207 describes the destination clearly. It says almost nothing about the journey.",
      fr: "Concevoir une migration Zero Trust pour une organisation qui existe déjà n'a rien à voir avec le fait de la concevoir pour une organisation qui n'existe pas encore. NIST SP 800-207 décrit clairement la destination. Il ne dit presque rien du chemin pour y arriver.",
    },
    body: {
      en: [
        "Designing a zero trust architecture for a multi-site logistics company that is already running is a different problem from designing for one that does not exist yet. The existing network has credentials, traffic flows, and operational dependencies that keep the business alive — and a migration that cannot break any of them. NIST SP 800-207 describes the destination with precision. It says almost nothing about how to get there from a network built ten years ago by people who are no longer employed by the company.",
        "The addressing scheme — 10.SITE.VLAN.0/24, second octet for site, third for function — was chosen for auditability over cleverness. A plan a new network engineer can read in five minutes is one they cannot misconfigure silently. The inter-VLAN traffic matrix was built differently: starting from empty and adding only what each business function demonstrably required, not what the existing network allowed. The existing network allowed too much. This is almost universally true. The identity stack — Step-CA for internal PKI, Authentik as the identity provider with hardware MFA, Teleport replacing direct SSH and RDP — was the most sequencing-sensitive part of the architecture. Misconfigure the trust chain at the CA level and every certificate signed against it is suspect.",
        "The three-year TCO came to approximately €25,200 on QEMU/KVM infrastructure, built from component-level cost attribution rather than vendor quote. The difference matters: a vendor quote tells you what a solution costs to purchase. Component-level attribution tells you what it costs to run — including the operational labour that vendor quotes consistently omit. The NIS2 Article 21 compliance mapping was generated from the architecture documentation, not retrospectively: each control justified against a design decision, not claimed against a deployed component. The homelab implementation ran OPNsense with Suricata in IPS mode on the perimeter, Nginx with CrowdSec on the DMZ, and Wazuh receiving logs from every segment.",
        "Five deployment phases, each leaving the network more restrictive than the last, each designed so that a failure in that phase rolls back without cascading. Phase one deploys the identity infrastructure without deprecating existing credentials — which feels counterproductive and is operationally essential. The paired hands-on lab guide exists for a specific reason: a Technical Architecture Document that cannot be implemented is a design opinion dressed as engineering. The guide closes the gap between the document and the working system.",
      ],
      fr: [
        "Concevoir une architecture Zero Trust pour une entreprise de logistique multi-sites déjà en activité n'a rien à voir avec le fait de la concevoir pour une entreprise qui n'existe pas encore. Le réseau en place a ses identifiants, ses flux de trafic et ses dépendances opérationnelles qui font vivre l'entreprise, et la migration ne peut en casser aucun. NIST SP 800-207 décrit la destination avec précision, mais il ne dit presque rien sur la façon d'y parvenir depuis un réseau monté il y a dix ans par des gens qui ont depuis quitté la maison.",
        "Le plan d'adressage (10.SITE.VLAN.0/24, deuxième octet pour le site, troisième pour la fonction) a été choisi pour sa lisibilité d'audit, pas pour son astuce. Un plan qu'un nouvel ingénieur réseau lit en cinq minutes est un plan qu'il ne peut pas dérégler en douce. La matrice de trafic inter-VLAN, elle, a suivi une logique inverse : partir de rien et n'ouvrir que ce dont chaque fonction métier avait réellement besoin, pas tout ce que le réseau existant tolérait. Et le réseau existant en tolérait trop, ce qui est vrai à peu près partout. La pile d'identité (Step-CA pour la PKI interne, Authentik comme fournisseur d'identité avec MFA matériel, Teleport en remplacement du SSH et du RDP directs) était la partie la plus sensible à l'ordre de déploiement. Que la chaîne de confiance soit mal configurée au niveau de l'autorité de certification, et tout certificat signé en dessous devient suspect.",
        "Le TCO sur trois ans s'est établi autour de 25 200 €, sur une infrastructure QEMU/KVM, calculé par imputation des coûts composant par composant plutôt qu'à partir d'un devis fournisseur. La nuance n'est pas anodine : un devis vous dit ce qu'une solution coûte à l'achat ; l'imputation composant par composant vous dit ce qu'elle coûte à exploiter, charge opérationnelle comprise, celle-là même que les devis passent toujours sous silence. La cartographie de conformité à l'article 21 de NIS2 a été tirée directement de la documentation d'architecture, et non reconstituée après coup : chaque mesure adossée à une décision de conception, et non revendiquée sur la foi d'un composant déployé. Côté homelab, l'implémentation faisait tourner OPNsense avec Suricata en mode IPS sur le périmètre, Nginx avec CrowdSec sur la DMZ, et Wazuh collectant les journaux de chaque segment.",
        "Cinq phases de déploiement, chacune rendant le réseau plus restrictif que la précédente, chacune conçue pour qu'une défaillance à ce stade puisse être annulée sans contaminer les suivantes. La première phase déploie l'infrastructure d'identité sans pour autant déprécier les identifiants existants : cela semble contre-productif, c'est pourtant indispensable sur le terrain. Le guide de lab pratique qui l'accompagne répond à un besoin précis : un document d'architecture technique impossible à mettre en œuvre n'est qu'un avis de conception déguisé en ingénierie. Le guide fait le pont entre le document et le système qui tourne.",
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
    body: {
      en: [
        "Crappy Safe is not a creative name for a vulnerable firmware — it is an accurate description. The password verification routine compared characters in sequence and returned failure the moment it found a mismatch. That design decision turns the authentication routine into a measuring instrument: query with a wrong first character, get a response in T₁ milliseconds. Query with a correct first character and a wrong second, get T₂ > T₁. The timing difference is the key. The algorithm is never touched — the attack reads what the hardware cannot help broadcasting.",
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
    index: "006",
    title: { en: "TOWER DEFENSE GAME", fr: "JEU TOWER DEFENSE" },
    year: "2026",
    tags: ["Unity", "C#", "Tower Defense", "Fantasy / D&D", "VFX as code", "UI/UX"],
    excerpt: {
      en: "A fantasy, Dungeons & Dragons-flavoured tower-defense built — currently at pre-prototype, with my work spanning development, UI/UX, and VFX authored as code in C#.",
      fr: "Un tower-defense d'inspiration fantasy et Dungeons & Dragons, aujourd'hui au stade du pré-prototype, où j'interviens sur le développement, l'UI/UX et les VFX écrits comme du code, en C#.",
    },
    body: {
      en: [
        "A tower-defense game with a fantasy, Dungeons & Dragons-flavoured art direction, built in Unity . It is at the pre-prototype stage — the moment where the core loop and the feel are being proven before anything gets polished. My role spans development, UI/UX, and visual effects.",
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
    index: "007",
    title: { en: "HOMELAB · PROXMOX", fr: "HOMELAB · PROXMOX" },
    year: "2026",
    tags: ["Proxmox", "Wazuh", "Self-hosted", "Linux", "Networking"],
    excerpt: {
      en: "A small Proxmox homelab on a laptop — Ryzen 7, 16 GB, 512 GB NVMe — running real workloads: game servers for friends, a Wazuh stack, and a provisioning box for testing.",
      fr: "Un petit homelab Proxmox sur un ordinateur portable (Ryzen 7, 16 Go, NVMe de 512 Go) qui fait tourner de vraies charges : des serveurs de jeu pour des amis, une stack Wazuh et une machine de provisionnement pour les tests.",
    },
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
