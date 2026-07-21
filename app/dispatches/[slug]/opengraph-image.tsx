import { dispatches } from "@/content/dispatches";
import { ogCard } from "@/lib/og";

export const alt = "NULLSEC dispatch";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return dispatches.map((d) => ({ slug: d.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = dispatches.find((d) => d.slug === slug);
  if (!post) return ogCard({ eyebrow: "// DISPATCHES", title: "NULLSEC", meta: "nullsec.fr" });
  const date = new Date(post.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  return ogCard({
    eyebrow: "// DISPATCHES",
    title: post.title.en,
    meta: `${date}   ·   ${post.readTime} read`,
  });
}
