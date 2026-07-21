import { dispatches } from "@/content/dispatches";
import { LOCALES, isLocale } from "@/lib/locale";
import { ogCard } from "@/lib/og";

export const alt = "NULLSEC dispatch";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => dispatches.map((d) => ({ locale, slug: d.slug })));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const l = isLocale(locale) ? locale : "en";
  const post = dispatches.find((d) => d.slug === slug);
  if (!post) return ogCard({ eyebrow: "// DISPATCHES", title: "NULLSEC", meta: "nullsec.fr" });
  const date = new Date(post.date).toLocaleDateString(l === "fr" ? "fr-FR" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const read = l === "fr" ? `${post.readTime} de lecture` : `${post.readTime} read`;
  return ogCard({
    eyebrow: "// DISPATCHES",
    title: post.title[l],
    meta: `${date}   ·   ${read}`,
  });
}
