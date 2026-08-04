import { profile } from "@/profile";
import { dispatches } from "@/content/dispatches";

export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// RSS 2.0 feed for the dispatches — generated from the same typed data as the
// pages. EN copy, matching the site's indexable language.
export function GET(): Response {
  const base = profile.siteUrl;
  const items = [...dispatches]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((post) => {
      // Locale-prefixed: the bare /dispatches/<slug> path now 307-redirects,
      // so linking it here made every feed reader spend two requests per item.
      const url = `${base}/en/dispatches/${post.slug}`;
      return [
        "    <item>",
        `      <title>${escapeXml(post.title.en)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(post.excerpt.en)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    "    <title>NULLSEC — Dispatches</title>",
    `    <link>${base}/en</link>`,
    `    <description>Field notes on GRC, blue team detection, and zero trust — by ${profile.fullName}.</description>`,
    "    <language>en</language>",
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      // Feed readers poll on a timer. An explicit CDN TTL keeps a badly
      // behaved poller from turning into sustained origin traffic.
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
