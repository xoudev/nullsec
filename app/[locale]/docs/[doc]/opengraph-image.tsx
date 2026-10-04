import { LOCALES, isLocale } from "@/lib/locale";
import { documents, getDoc, docEyebrow } from "@/lib/documents";
import { ogCard } from "@/lib/og";
import { profile } from "@/profile";

export const alt = "NULLSEC document";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => documents().map((d) => ({ locale, doc: d.slug })));
}

// Cards exist for the generated paths only: an unknown one is a 404, not a
// freshly rendered image per request.
export const dynamicParams = false;

// The reader pages are not indexed (the PDF is), but a link to the CV is
// what gets shared: without this, the share showed no card at all.
export default async function Image({ params }: { params: Promise<{ locale: string; doc: string }> }) {
  const { locale, doc: slug } = await params;
  const l = isLocale(locale) ? locale : "en";
  const doc = getDoc(slug);
  if (!doc) return ogCard({ eyebrow: "// DOCUMENT", title: "NULLSEC", meta: "nullsec.fr" });
  const pages = `${doc.pages} page${doc.pages > 1 ? "s" : ""}`;
  return ogCard({
    eyebrow: docEyebrow(doc, l),
    title: doc.title[l],
    meta: `${profile.fullName}   ·   PDF · ${pages}   ·   nullsec.fr`,
  });
}
