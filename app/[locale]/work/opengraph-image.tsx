import { orderedWork } from "@/content/work";
import { LOCALES, isLocale } from "@/lib/locale";
import { ogCard } from "@/lib/og";

export const alt = "NULLSEC fieldwork";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

// Cards exist for the generated paths only: an unknown one is a 404, not a
// freshly rendered image per request.
export const dynamicParams = false;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "en";
  const n = orderedWork.length;
  return ogCard({
    eyebrow: l === "fr" ? "// TRAVAUX DE TERRAIN" : "// FIELDWORK",
    title: l === "fr" ? "Des preuves, pas des promesses." : "Proof over promises.",
    meta: l === "fr"
      ? `Jordan Turnaco   ·   ${n} projets   ·   GRC · produits · détection`
      : `Jordan Turnaco   ·   ${n} projects   ·   GRC · products · detection`,
  });
}
