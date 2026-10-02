// Off-duty / passions section content. Data-driven like the rest of the site.
// Each entry is a target in the section's scope (components/OffDutyScope):
// picking it acquires its image and locks the reticle on `focus`, the
// subject's place in the image (in % of its width and height; the image is
// cropped around that point too), named by `subject`. Image paths are
// relative to /public (case-sensitive).

import type { Localized } from "@/lib/i18n";

export type OffDutyRow = {
  title: Localized<string>;
  subtitle: Localized<string>;
  tags: Localized<string[]>;
  image: string;
  focus: { x: number; y: number };
  subject: Localized<string>;
};

export const offDutyRows: OffDutyRow[] = [
  {
    title: { en: "MOTO", fr: "MOTO" },
    subtitle: { en: "same focus, different throttle.", fr: "même concentration, juste une autre poignée de gaz." },
    // "TRACK ONLY" keeps the no-license joke unambiguous: circuit riding, not
    // road riding without papers — this portfolio courts compliance recruiters.
    tags: { en: ["SUPERSPORT", "#71", "NO LICENSE", "TRACK ONLY"], fr: ["SUPERSPORT", "#71", "SANS PERMIS", "CIRCUIT"] },
    image: "/off-duty/moto.png",
    focus: { x: 77, y: 44 },
    subject: { en: "rider #71", fr: "pilote #71" },
  },
  {
    title: { en: "DRAWING", fr: "DESSIN" },
    subtitle: { en: "pencils, ink, and the occasional tablet.", fr: "au crayon, à l'encre, et de temps en temps sur tablette." },
    tags: { en: ["SKETCH", "INK", "LINEWORK"], fr: ["CROQUIS", "ENCRE", "TRAIT"] },
    image: "/off-duty/drawing.png",
    focus: { x: 67, y: 58 },
    subject: { en: "pen tip", fr: "pointe du feutre" },
  },
  {
    title: { en: "MANGA & ANIME", fr: "MANGA & ANIME" },
    subtitle: { en: "raised on panels, arcs and late episodes.", fr: "biberonné aux planches, aux grands arcs narratifs et aux épisodes enchaînés trop tard le soir." },
    tags: { en: ["MANGA", "ANIME", "STORY"], fr: ["MANGA", "ANIME", "RÉCIT"] },
    image: "/off-duty/Anime.jpg",
    focus: { x: 48, y: 35 },
    subject: { en: "Naruto", fr: "Naruto" },
  },
  {
    title: { en: "TECHNOLOGY", fr: "TECHNOLOGIE" },
    subtitle: { en: "where the day job and the hobby blur.", fr: "là où le boulot et la passion finissent par se confondre." },
    tags: { en: ["HARDWARE", "HOMELAB", "OPEN-SOURCE"], fr: ["MATÉRIEL", "HOMELAB", "OPEN-SOURCE"] },
    image: "/off-duty/tech.jpg",
    focus: { x: 45, y: 41 },
    subject: { en: "point of contact", fr: "point de contact" },
  },
  {
    title: { en: "GAMING", fr: "GAMING" },
    subtitle: { en: "competitive when it counts, chill when it does not.", fr: "à fond quand ça compte, peinard le reste du temps." },
    tags: { en: ["FPS", "STRATEGY", "CO-OP"], fr: ["FPS", "STRATÉGIE", "CO-OP"] },
    image: "/off-duty/Gaming.jpg",
    focus: { x: 38, y: 37 },
    subject: { en: "headset", fr: "casque" },
  },
];

// "00 LICENSES" stays a fixed thematic detail (the moto no-license joke).
export const offDutyEntryCount = offDutyRows.length;
