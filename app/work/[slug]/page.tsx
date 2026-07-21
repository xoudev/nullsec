import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { work, getAdjacentWork } from "@/content/work";
import { profile } from "@/profile";
import { ReadingProgress } from "@/components/ReadingProgress";
import { WorkArticle } from "./WorkArticle";

/* ─── Static generation ─── */
export function generateStaticParams() {
  return work.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = work.find((w) => w.slug === slug);
  if (!item) return {};
  return {
    title: item.title.en,
    description: item.excerpt.en,
    openGraph: {
      title: `${item.title.en} · NULLSEC`,
      description: item.excerpt.en,
      url: `${profile.siteUrl}/work/${item.slug}`,
      // og:image comes from the per-slug opengraph-image route (branded,
      // project-specific card) via the file convention.
    },
  };
}

/* ─── Page ─── */
export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
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
