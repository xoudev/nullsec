// Off-duty / passions section content. Data-driven like the rest of the site.
// Every entry is a uniform row; hovering one fades its image into the section
// background. Image paths are relative to /public (case-sensitive).

import type { Localized } from "@/lib/i18n";

export type OffDutyRow = {
  title: Localized<string>;
  subtitle: Localized<string>;
  tags: Localized<string[]>;
  image: string;
};

export const offDutyRows: OffDutyRow[] = [
  {
    title: { en: "MOTO", fr: "MOTO" },
    subtitle: { en: "same focus, different throttle.", fr: "même concentration, juste une autre poignée de gaz." },
    tags: { en: ["SUPERSPORT", "#71", "NO LICENSE"], fr: ["SUPERSPORT", "#71", "SANS PERMIS"] },
    image: "/off-duty/moto.png",
  },
  {
    title: { en: "DRAWING", fr: "DESSIN" },
    subtitle: { en: "pencils, ink, and the occasional tablet.", fr: "au crayon, à l'encre, et de temps en temps sur tablette." },
    tags: { en: ["SKETCH", "INK", "LINEWORK"], fr: ["CROQUIS", "ENCRE", "TRAIT"] },
    image: "/off-duty/drawing.png",
  },
  {
    title: { en: "MANGA & ANIME", fr: "MANGA & ANIME" },
    subtitle: { en: "raised on panels, arcs and late episodes.", fr: "biberonné aux planches, aux grands arcs narratifs et aux épisodes enchaînés trop tard le soir." },
    tags: { en: ["MANGA", "ANIME", "STORY"], fr: ["MANGA", "ANIME", "RÉCIT"] },
    image: "/off-duty/Anime.jpg",
  },
  {
    title: { en: "TECHNOLOGY", fr: "TECHNOLOGIE" },
    subtitle: { en: "where the day job and the hobby blur.", fr: "là où le boulot et la passion finissent par se confondre." },
    tags: { en: ["HARDWARE", "HOMELAB", "OPEN-SOURCE"], fr: ["MATÉRIEL", "HOMELAB", "OPEN-SOURCE"] },
    image: "/off-duty/tech.jpg",
  },
  {
    title: { en: "GAMING", fr: "GAMING" },
    subtitle: { en: "competitive when it counts, chill when it does not.", fr: "à fond quand ça compte, peinard le reste du temps." },
    tags: { en: ["FPS", "STRATEGY", "CO-OP"], fr: ["FPS", "STRATÉGIE", "CO-OP"] },
    image: "/off-duty/Gaming.jpg",
  },
];

// "00 LICENSES" stays a fixed thematic detail (the moto no-license joke).
export const offDutyEntryCount = offDutyRows.length;
