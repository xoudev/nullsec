// Off-duty / passions section content. Data-driven like the rest of the site.
// The featured entry (Moto) carries a photo; the remaining rows are text-only.

export type OffDutyRow = {
  title: string;
  subtitle: string;
  tags: string[];
  image: string; // revealed on hover; path relative to /public (case-sensitive)
};

export const offDutyFeatured = {
  label: "MOTO",
  coord: "// CIRCUIT 47.0°N",
  headline: ["Same focus,", "different", "throttle."],
  note: "No license yet — the passion didn't wait.",
  tagline: "OFF THE CLOCK · ON THE LIMIT",
  spec: "SUPERSPORT · #71 · LICENSE PENDING",
  // Drop the file here to light up the hero; until then the block degrades to
  // a dark panel (CSS background, so a missing file never breaks the build).
  image: "/off-duty/moto.png",
} as const;

export const offDutyRows: OffDutyRow[] = [
  { title: "DRAWING", subtitle: "pencils, ink, and the occasional tablet.", tags: ["SKETCH", "INK", "LINEWORK"], image: "/off-duty/drawing.png" },
  { title: "MANGA & ANIME", subtitle: "raised on panels, arcs and late episodes.", tags: ["MANGA", "ANIME", "STORY"], image: "/off-duty/Anime.jpg" },
  { title: "TECHNOLOGY", subtitle: "where the day job and the hobby blur.", tags: ["HARDWARE", "HOMELAB", "OPEN-SOURCE"], image: "/off-duty/tech.jpg" },
  { title: "GAMING", subtitle: "competitive when it counts, chill when it does not.", tags: ["FPS", "STRATEGY", "CO-OP"], image: "/off-duty/Gaming.jpg" },
];

// Featured block (1) + rows. "00 LICENSES" stays a fixed thematic detail.
export const offDutyEntryCount = offDutyRows.length + 1;
