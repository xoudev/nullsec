/**
 * Where a document is read on the site: /<locale>/docs/<slug>, the in-site
 * reader (app/[locale]/docs/[doc]). Pure helpers with no content imports, so
 * client components can link to a document without shipping the case studies
 * that list them.
 */

/** The CV's slug: /fr/docs/cv reads cv.pdf, /en/docs/cv reads cv-en.pdf. */
export const CV_DOC = "cv";

/** "/docs/toron-fonctionnalites.pdf" → "toron-fonctionnalites". */
export function docSlug(pdfHref: string): string {
  return pdfHref.replace(/^.*\//, "").replace(/\.pdf$/i, "");
}

/** The reader's path for a document, without the locale prefix. */
export function docPath(slug: string): string {
  return `/docs/${slug}`;
}
