import type { MetadataRoute } from "next";
import { profile } from "@/profile";
import { work } from "@/content/work";
import { dispatches } from "@/content/dispatches";

const base = profile.siteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const workEntries: MetadataRoute.Sitemap = work.map((item) => ({
    url: `${base}/work/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const dispatchEntries: MetadataRoute.Sitemap = dispatches.map((post) => ({
    url: `${base}/dispatches/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...workEntries,
    ...dispatchEntries,
  ];
}
