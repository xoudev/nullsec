import type { Locale, Localized } from "@/lib/locale";
import { CV_DOC, docSlug } from "@/lib/doc-routes";
import { profile } from "@/profile";
import { work } from "@/content/work";

/**
 * Every document the reader can open, built from the content that already
 * lists them: the CV from the profile, the specifications from the case
 * studies. Server side only (it imports the case studies); client code links
 * with lib/doc-routes.ts.
 */
export type DocEntry = {
  slug: string;
  /** The PDF, per locale (the CV has one per language). */
  src: Localized<string>;
  title: Localized<string>;
  /** Known for the case-study documents; the CV is built to one page. */
  pages: number;
  /** Set when the document exists in one language only. */
  lang?: Locale;
  /** The case study it belongs to, for the way back. */
  project?: { slug: string; title: Localized<string> };
};

export function documents(): DocEntry[] {
  const docs: DocEntry[] = [
    {
      slug: CV_DOC,
      src: profile.cvUrl,
      title: { en: "Curriculum vitae", fr: "Curriculum vitæ" },
      // scripts/build-cv.mjs lays the CV out on a single A4 page.
      pages: 1,
    },
  ];
  for (const w of work) {
    for (const d of w.documents ?? []) {
      docs.push({
        slug: docSlug(d.href),
        src: { en: d.href, fr: d.href },
        title: { en: `${w.title.en} · ${d.label.en}`, fr: `${w.title.fr} · ${d.label.fr}` },
        pages: d.pages,
        lang: d.lang,
        project: { slug: w.slug, title: w.title },
      });
    }
  }
  return docs;
}

export function getDoc(slug: string): DocEntry | undefined {
  return documents().find((d) => d.slug === slug);
}

/** "// DOCUMENT · PDF · 6 P." — the line the page and the curtain open on. */
export function docEyebrow(doc: DocEntry, l: Locale): string {
  const pages = l === "fr" ? `${doc.pages} P.` : `${doc.pages} ${doc.pages > 1 ? "PP." : "P."}`;
  return `// DOCUMENT · PDF · ${pages}`;
}
