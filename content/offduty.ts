// Off-duty / passions section content. Data-driven like the rest of the site.
// Every entry is a uniform row; hovering one fades its image into the section
// background. Image paths are relative to /public (case-sensitive).

export type OffDutyRow = {
  title: string;
  subtitle: string;
  tags: string[];
  image: string;
};

export const offDutyRows: OffDutyRow[] = [
  { title: "MOTO", subtitle: "same focus, different throttle.", tags: ["SUPERSPORT", "#71", "NO LICENSE"], image: "/off-duty/moto.png" },
  { title: "DRAWING", subtitle: "pencils, ink, and the occasional tablet.", tags: ["SKETCH", "INK", "LINEWORK"], image: "/off-duty/drawing.png" },
  { title: "MANGA & ANIME", subtitle: "raised on panels, arcs and late episodes.", tags: ["MANGA", "ANIME", "STORY"], image: "/off-duty/Anime.jpg" },
  { title: "TECHNOLOGY", subtitle: "where the day job and the hobby blur.", tags: ["HARDWARE", "HOMELAB", "OPEN-SOURCE"], image: "/off-duty/tech.jpg" },
  { title: "GAMING", subtitle: "competitive when it counts, chill when it does not.", tags: ["FPS", "STRATEGY", "CO-OP"], image: "/off-duty/Gaming.jpg" },
];

// "00 LICENSES" stays a fixed thematic detail (the moto no-license joke).
export const offDutyEntryCount = offDutyRows.length;
