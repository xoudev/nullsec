import { work } from "@/content/work";
import { LOCALES, isLocale } from "@/lib/locale";
import { ogCard } from "@/lib/og";

export const alt = "NULLSEC project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => work.map((item) => ({ locale, slug: item.slug })));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const l = isLocale(locale) ? locale : "en";
  const item = work.find((w) => w.slug === slug);
  if (!item) return ogCard({ eyebrow: "// FIELDWORK", title: "NULLSEC", meta: "nullsec.fr" });
  return ogCard({
    eyebrow: `// FIELDWORK · ${item.index}`,
    title: item.title[l],
    meta: `${item.tags.slice(0, 4).join("  ·  ")}   ·   ${item.year}`,
  });
}
