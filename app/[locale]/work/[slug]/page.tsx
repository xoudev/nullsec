import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { work, getAdjacentWork } from "@/content/work";
import { profile } from "@/profile";
import { LOCALES, isLocale, type Locale } from "@/lib/locale";
import { ReadingProgress } from "@/components/ReadingProgress";
import { WorkArticle } from "./WorkArticle";

/* ─── Static generation ─── */
export function generateStaticParams() {
  return LOCALES.flatMap((locale) => work.map((item) => ({ locale, slug: item.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const l: Locale = isLocale(locale) ? locale : "en";
  const item = work.find((w) => w.slug === slug);
  if (!item) return {};
  const title = item.title[l];
  const description = item.excerpt[l];
  const base = profile.siteUrl;
  return {
    title,
    description,
    alternates: {
      canonical: `${base}/${l}/work/${item.slug}`,
      languages: {
        en: `${base}/en/work/${item.slug}`,
        fr: `${base}/fr/work/${item.slug}`,
        "x-default": `${base}/en/work/${item.slug}`,
      },
    },
    openGraph: {
      title: `${title} · NULLSEC`,
      description,
      url: `${base}/${l}/work/${item.slug}`,
      // og:image comes from the per-slug opengraph-image route.
    },
  };
}

/* ─── Page ─── */
export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const item = work.find((w) => w.slug === slug);
  if (!item) notFound();

  const { prev, next } = getAdjacentWork(slug);

  return (
    <>
      <ReadingProgress />
      <WorkArticle item={item} prev={prev} next={next} />
    </>
  );
}
