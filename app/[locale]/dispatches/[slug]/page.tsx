import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dispatches, getAdjacentDispatch } from "@/content/dispatches";
import { profile } from "@/profile";
import { LOCALES, isLocale, type Locale } from "@/lib/locale";
import { ReadingProgress } from "@/components/ReadingProgress";
import { DispatchArticle } from "./DispatchArticle";

/* ─── Static generation ─── */
export function generateStaticParams() {
  return LOCALES.flatMap((locale) => dispatches.map((d) => ({ locale, slug: d.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const l: Locale = isLocale(locale) ? locale : "en";
  const post = dispatches.find((d) => d.slug === slug);
  if (!post) return {};
  const title = post.title[l];
  const description = post.excerpt[l];
  const base = profile.siteUrl;
  return {
    title,
    description,
    alternates: {
      canonical: `${base}/${l}/dispatches/${post.slug}`,
      languages: {
        en: `${base}/en/dispatches/${post.slug}`,
        fr: `${base}/fr/dispatches/${post.slug}`,
        "x-default": `${base}/en/dispatches/${post.slug}`,
      },
    },
    openGraph: {
      title: `${title} · NULLSEC`,
      description,
      url: `${base}/${l}/dispatches/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

/* ─── Page ─── */
export default async function DispatchPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const l: Locale = isLocale(locale) ? locale : "en";
  const post = dispatches.find((d) => d.slug === slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentDispatch(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title[l],
    description: post.excerpt[l],
    datePublished: post.date,
    inLanguage: l,
    url: `${profile.siteUrl}/${l}/dispatches/${post.slug}`,
    author: { "@type": "Person", name: profile.fullName, url: profile.siteUrl },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <DispatchArticle post={post} prev={prev} next={next} />
    </>
  );
}
