import type { MetadataRoute } from "next";
import { profile } from "@/profile";
import { work } from "@/content/work";
import { dispatches } from "@/content/dispatches";
import { LOCALES } from "@/lib/locale";

const base = profile.siteUrl;

type Entry = MetadataRoute.Sitemap[number];

// One <url> per locale, each carrying the full hreflang cluster (en / fr /
// x-default) so Google serves the right language and never treats the two as
// duplicates. `path` is the locale-agnostic tail ("" for home, "/work/slug"…).
function localizedEntries(path: string, extra: Omit<Entry, "url" | "alternates">): MetadataRoute.Sitemap {
  const languages = {
    en: `${base}/en${path}`,
    fr: `${base}/fr${path}`,
    "x-default": `${base}/en${path}`,
  };
  return LOCALES.map((l) => ({
    url: `${base}/${l}${path}`,
    alternates: { languages },
    ...extra,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  // No lastModified on home/work/index: a build-time "now" on every entry just
  // teaches crawlers to ignore the field. Dispatches keep their honest dates.
  const workEntries = work.flatMap((item) =>
    localizedEntries(`/work/${item.slug}`, { changeFrequency: "monthly", priority: 0.8 }),
  );

  const dispatchEntries = dispatches.flatMap((post) =>
    localizedEntries(`/dispatches/${post.slug}`, {
      lastModified: new Date(post.date),
      changeFrequency: "yearly",
      priority: 0.6,
    }),
  );

  return [
    ...localizedEntries("", { changeFrequency: "monthly", priority: 1 }),
    ...localizedEntries("/work", { changeFrequency: "monthly", priority: 0.7 }),
    ...localizedEntries("/dispatches", { changeFrequency: "monthly", priority: 0.7 }),
    ...workEntries,
    ...dispatchEntries,
  ];
}
