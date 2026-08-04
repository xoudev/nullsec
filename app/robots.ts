import type { MetadataRoute } from "next";
import { profile } from "@/profile";

/**
 * Hardened robots.txt.
 *
 * Context: on 2026-07-30 the site took ~3M edge requests in a day against ~60
 * real visitors, which exhausted the hosting quota and took the site offline.
 * Well-behaved crawlers (including most AI scrapers) do honour robots.txt, so
 * this file removes the standing invitation the previous `Allow: /` for `*`
 * represented.
 *
 * IMPORTANT — this is only half the defence. A malicious flood ignores
 * robots.txt entirely; only an edge firewall stops that. See docs/OPS.md.
 *
 * Two rules that must never regress:
 *  - Search engines stay fully allowed (the whole /en · /fr SEO effort depends
 *    on it). Google-Extended / Applebot-Extended are AI-training tokens only:
 *    blocking them does NOT affect Googlebot or Applebot search ranking.
 *  - Social link-preview bots stay allowed, or shared links lose their OG card
 *    (LinkedInBot in particular — the portfolio is promoted there).
 */

// Search + social preview: explicitly welcome.
const ALLOWED = [
  // Search engines
  "Googlebot",
  "Googlebot-Image",
  "Googlebot-News",
  "Bingbot",
  "DuckDuckBot",
  "Applebot",
  "Slurp",
  "Qwantbot",
  // Link-preview / unfurling bots — these render the OG card when a URL is
  // shared. facebookexternalhit is the preview fetcher and is NOT the same as
  // Meta's AI crawler (meta-externalagent), which is blocked below.
  "LinkedInBot",
  "Twitterbot",
  "facebookexternalhit",
  "Slackbot",
  "Slackbot-LinkExpanding",
  "Discordbot",
  "TelegramBot",
  "WhatsApp",
  "Mastodon",
];

// AI training / bulk scraping / SEO-spam crawlers: denied.
const DENIED = [
  // LLM training + AI answer engines
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "FacebookBot",
  "Amazonbot",
  "Bytespider",
  "YouBot",
  "cohere-ai",
  "Webzio-Extended",
  "Timpibot",
  "img2dataset",
  // Bulk crawl / dataset harvesting
  "CCBot",
  "Diffbot",
  "ImagesiftBot",
  "Omgili",
  "Omgilibot",
  "Scrapy",
  // Commercial SEO crawlers — heavy, and this site gains nothing from them
  "AhrefsBot",
  "SemrushBot",
  "DataForSeoBot",
  "MJ12bot",
  "DotBot",
  "BLEXBot",
  "Barkrowler",
  "PetalBot",
  "ZoominfoBot",
  "VelenPublicWebCrawler",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: ALLOWED, allow: "/" },
      { userAgent: DENIED, disallow: "/" },
      // Everything else: allowed, but paced. Google ignores crawl-delay (its
      // rate is tuned in Search Console); Bing, Yandex and most small crawlers
      // respect it, which is exactly the long tail worth slowing down.
      { userAgent: "*", allow: "/", crawlDelay: 10 },
    ],
    sitemap: `${profile.siteUrl}/sitemap.xml`,
  };
}
