import { dispatches } from "@/content/dispatches";
import { LOCALES, isLocale } from "@/lib/locale";
import { ogCard } from "@/lib/og";

export const alt = "NULLSEC dispatches";
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
  const n = dispatches.length;
  return ogCard({
    eyebrow: l === "fr" ? "// DÉPÊCHES" : "// DISPATCHES",
    title: l === "fr" ? "Des notes prises au ras du bruit." : "Notes from the noise floor.",
    meta: l === "fr"
      ? `Jordan Turnaco   ·   ${n} notes de terrain`
      : `Jordan Turnaco   ·   ${n} field notes`,
  });
}
