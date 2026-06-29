import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dispatches, getAdjacentDispatch } from "@/content/dispatches";
import { profile } from "@/profile";
import { ReadingProgress } from "@/components/ReadingProgress";
import { DispatchArticle } from "./DispatchArticle";

/* ─── Static generation ─── */
export function generateStaticParams() {
  return dispatches.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = dispatches.find((d) => d.slug === slug);
  if (!post) return {};
  return {
    title: post.title.en,
    description: post.excerpt.en,
    openGraph: {
      title: `${post.title.en} · NULLSEC`,
      description: post.excerpt.en,
      url: `${profile.siteUrl}/dispatches/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

/* ─── Page ─── */
export default async function DispatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = dispatches.find((d) => d.slug === slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentDispatch(slug);

  return (
    <>
      <ReadingProgress />
      <DispatchArticle post={post} prev={prev} next={next} />
    </>
  );
}
