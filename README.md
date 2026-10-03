# NULLSEC

> **Securing what others overlook.**

**NULLSEC** est le portfolio personnel de [Jordan Turnaco](https://nullsec.fr), étudiant en cybersécurité, alternant SMSI et développeur. Le site présente un profil situé à l'intersection de la sécurité défensive, de la GRC, du DevSecOps et de l'ingénierie produit.

Ce n'est pas un CV posé sur une page. C'est une interface éditoriale pensée comme un dossier de terrain : les expériences sont contextualisées, les projets sont documentés, les compétences sont reliées à des preuves et chaque détail de l'interface sert la même idée : regarder là où le système laisse une ouverture.

[Voir le portfolio](https://nullsec.fr) · [Profil GitHub](https://github.com/xoudev) · [Profil LinkedIn](https://www.linkedin.com/in/jordan-turnaco)

---

## Ce que c'est

NULLSEC rassemble en un seul endroit :

- un parcours professionnel centré sur le **SMSI**, la gestion des risques, la conformité et la protection des systèmes ;
- des études de cas sur des produits, des architectures et des travaux de sécurité ;
- des dispatches, notes courtes et réflexions techniques ;
- un espace off-duty qui montre les centres d'intérêt au-delà du travail ;
- un CV bilingue généré depuis les mêmes données que le site ;
- des documents de projet consultables dans un lecteur intégré ;
- une expérience entièrement disponible en **français** et en **anglais**.

Le portfolio s'adresse à la fois aux recruteurs qui veulent comprendre rapidement un parcours et aux lecteurs techniques qui veulent aller au-delà d'une liste de mots-clés.

## Les sections du portfolio

La page d'accueil est organisée comme une progression, du signal d'identité vers les preuves :

| Section | Rôle |
|---|---|
| **Identity** | Positionnement, bio et première impression. |
| **Key figures** | Repères rapides sur le parcours et les domaines travaillés. |
| **Experience** | Expériences professionnelles, missions et résultats. |
| **Fieldwork** | Travail concret en sécurité, infrastructure et analyse. |
| **Toolkit** | Compétences regroupées par domaines, avec liens vers les projets qui les illustrent. |
| **Clearance** | Certifications obtenues et objectifs en cours. |
| **About** | Formation, langues et trajectoire. |
| **Dispatches** | Articles, notes et observations techniques. |
| **Off duty** | Intérêts personnels présentés comme une exploration interactive. |
| **Handshake** | Contact et points d'entrée vers les profils externes. |

Les projets importants disposent de leur propre étude de cas, avec contexte, rôle, livrables, statut, stack, documents, liens et parfois une vidéo. Les contenus ne sont pas décoratifs : ils expliquent les décisions, les limites et les garanties de chaque projet.

## Projets mis en avant

Les contenus de `content/work.ts` alimentent à la fois les cartes du site, les pages d'études de cas et le CV compilé.

### TORON

Plateforme de conformité pour PME et ETI. Son modèle relie les contrôles internes aux exigences de plusieurs référentiels afin qu'une même preuve puisse couvrir ISO 27001, NIS2 et les questionnaires de sécurité clients. Le projet explore notamment les règles métier, la traçabilité, l'intégrité des exports et l'isolation multi-tenant par PostgreSQL RLS.

### HUNE

Plateforme de gestion de parc pensée autour d'un scénario où le serveur RMM devient lui-même un outil d'attaque. L'architecture étudie la double signature Ed25519, le mTLS, les accès distants sans port entrant et les limites à imposer à un serveur compromis.

Le portfolio présente également des travaux liés au reverse engineering, à l'analyse embarquée, à l'infrastructure, au développement web et mobile ainsi qu'à la conception de produits de sécurité.

## Stack technique

### Application

- **Next.js 16** avec App Router, Server Components et génération statique des routes connues ;
- **React 19** pour les îlots véritablement interactifs ;
- **TypeScript** pour typer le contenu, les routes localisées et les contrats entre composants ;
- **Tailwind CSS v4** et CSS natif pour le système visuel et les comportements responsifs ;
- **ESLint 9** et la configuration Next.js pour maintenir la qualité du code.

### Motion et expérience

- **GSAP** pour les révélations, transitions et séquences de scroll ;
- **Lenis** pour un défilement fluide contrôlé ;
- pause des animations hors écran et prise en charge de `prefers-reduced-motion` ;
- curseur personnalisé, HUD de scan, ticker de boot et navigation par raccourcis de sections ;
- contrôle audio optionnel avec bootstrap différé ;
- lecteur vidéo maison pour les médias locaux et YouTube.

Les effets restent une couche d'expression : le contenu principal est rendu dans le HTML et reste lisible sans attendre une séquence de boot ou une animation.

### Données et contenus

- fichiers TypeScript typés dans `content/` pour les projets, dispatches, compétences, clearances et contenus off-duty ;
- `profile.ts` comme source unique pour l'identité, les expériences, la formation, les certifications, les liens et les langues ;
- contenu localisé sous la forme `{ en, fr }`, avec routes indexables `/en` et `/fr` ;
- génération des métadonnées, sitemaps, robots, flux RSS et images Open Graph depuis l'application ;
- validation des relations entre compétences, projets et éléments exportés dans le CV.

### Documents et CV

Le CV est traité comme du code : `scripts/build-cv.mjs` récupère les données de `profile.ts` et `content/work.ts`, prépare les variantes linguistiques et compile le document Typst dans les deux langues. Les URLs publiques historiques sont conservées pour la version française, tandis que la version anglaise dispose de son propre fichier.

Le même principe s'applique aux documents de projets : ils sont référencés dans les données, affichés avec une couverture et ouverts dans un lecteur interne via les routes `/docs` localisées.

## Architecture de l'interface

```text
app/
├── [locale]/             Pages localisées en français et en anglais
│   ├── page.tsx          Portfolio principal
│   ├── work/[slug]/      Études de cas
│   ├── dispatches/[slug]/ Articles et dispatches
│   └── docs/[doc]/       Lecture des documents PDF
├── feed.xml/             Flux RSS
└── opengraph-image.tsx   Images sociales générées

components/
├── sections/             Sections éditoriales du portfolio
├── Reveal, PageTransition Révélations et transitions
└── audio, vidéo, HUD      Contrôles d'interface et médias

content/                  Source typée des contenus publiés
lib/                      Internationalisation, SEO, GSAP, documents et audio
cv/                       Template Typst, données et polices du CV
public/                   Médias, polices, documents et fichiers publics
```

La page d'accueil est principalement rendue côté serveur. Seuls les éléments qui ont réellement besoin d'un état navigateur ou d'une interaction sont envoyés comme composants client : toolkit, radar de clearance, terminal, audio, navigation et quelques contrôles visuels.

## Direction visuelle

NULLSEC utilise une grammaire visuelle volontairement limitée : quatre couleurs, aucune surcharge décorative et une hiérarchie qui rappelle les interfaces de contrôle et les dossiers techniques.

| Token | Valeur actuelle | Usage |
|---|---|---|
| `--color-void` | `#0F0F12` | Fond et surfaces sombres |
| `--color-bone` | `#F2EFE8` | Texte principal et panneaux clairs |
| `--color-blood` | `#FF6B1A` | Accent, focus et états actifs |
| `--color-ash` | `#8A8A8A` | Métadonnées et texte secondaire |

La typographie combine **Instrument Serif** pour les titres expressifs, **Inter** pour le texte courant et **JetBrains Mono** pour les labels, compteurs et informations d'interface. La palette et les contrastes sont définis dans `app/globals.css`, avec des états de focus visibles et une skip link pour la navigation clavier.

## Principes de conception

- **Le contenu avant l'effet** : le HTML porte le message ; les animations le mettent en scène.
- **Les compétences doivent avoir une preuve** : le toolkit relie les domaines aux expériences et aux projets associés.
- **La précision plutôt que le vernis** : chaque étude de cas expose aussi ses contraintes, son statut et ce que le produit ne prétend pas être.
- **Une seule source de vérité** : le site et le CV lisent les mêmes données typées.
- **Accessibilité et performance** : rendu serveur, composants clients limités, focus visibles, pause hors écran et respect de la réduction des mouvements.
- **Bilingue par conception** : le français et l'anglais sont des routes distinctes, pas un texte changé au dernier moment dans le navigateur.

## Identité du projet

NULLSEC signifie ici un espace où l'on examine ce qui n'est pas immédiatement visible : les hypothèses, les frontières, les contrôles et les petits écarts qui deviennent des failles. Le site applique cette logique à son propre récit : il ne se contente pas d'affirmer une compétence, il montre le contexte dans lequel elle a été utilisée.

## Licence

Projet personnel. Tous droits réservés.
