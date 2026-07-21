import { work } from "@/content/work";
import { ogCard } from "@/lib/og";

export const alt = "NULLSEC project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return work.map((item) => ({ slug: item.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = work.find((w) => w.slug === slug);
  if (!item) return ogCard({ eyebrow: "// FIELDWORK", title: "NULLSEC", meta: "nullsec.fr" });
  return ogCard({
    eyebrow: `// FIELDWORK · ${item.index}`,
    title: item.title.en,
    meta: `${item.tags.slice(0, 4).join("  ·  ")}   ·   ${item.year}`,
  });
}
