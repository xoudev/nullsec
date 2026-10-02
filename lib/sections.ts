import type { Locale } from "@/lib/locale";

/**
 * The homepage's sections, in page order: the one list every number on the
 * site is read from (each section's "02 // EXPÉRIENCE" label and its
 * data-section-id, the HUD index and NODE readout, the mobile section counter,
 * the 1 to 9 keyboard shortcuts).
 *
 * Reordering the page means moving a row here and the matching component in
 * app/[locale]/page.tsx; every number follows. Before this list existed, the
 * numbers were typed by hand in a dozen places, which is why Experience
 * stayed buried at 06 behind the skills wall.
 */
export const SECTIONS = [
  { key: "identity", en: "IDENTITY", fr: "IDENTITÉ" },
  { key: "experience", en: "EXPERIENCE", fr: "EXPÉRIENCE" },
  { key: "fieldwork", en: "FIELDWORK", fr: "TERRAIN" },
  { key: "toolkit", en: "TOOLKIT", fr: "OUTILLAGE" },
  { key: "clearance", en: "CLEARANCE", fr: "HABILITATIONS" },
  { key: "about", en: "ABOUT", fr: "À PROPOS" },
  { key: "dispatches", en: "DISPATCHES", fr: "DÉPÊCHES" },
  { key: "offduty", en: "OFF-DUTY", fr: "HORS SERVICE" },
  { key: "handshake", en: "HANDSHAKE", fr: "CONTACT" },
] as const;

export type SectionKey = (typeof SECTIONS)[number]["key"];

export type SectionMeta = { key: SectionKey; id: string; en: string; fr: string };

/** Every section with its two-digit number ("01" to "09"). */
export const SECTION_LIST: SectionMeta[] = SECTIONS.map((s, i) => ({
  ...s,
  id: String(i + 1).padStart(2, "0"),
}));

export function section(key: SectionKey): SectionMeta {
  return SECTION_LIST.find((s) => s.key === key)!;
}

/** The label a section opens on, e.g. "02 // EXPÉRIENCE". */
export function sectionLabel(key: SectionKey, l: Locale): string {
  const s = section(key);
  return `${s.id} // ${s[l]}`;
}
