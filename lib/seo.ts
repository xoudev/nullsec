import type { Locale } from "@/lib/locale";

/** og:locale for each site language. */
const OG_LOCALE: Record<Locale, string> = { en: "en_US", fr: "fr_FR" };

/**
 * The Open Graph fields every page has to repeat.
 *
 * Next.js merges metadata key by key, so a page that sets `openGraph` replaces
 * its layout's block wholesale: every inner page used to ship without
 * og:site_name or og:locale. Spread this first, then add the page's own title,
 * description and url (and `type: "article"` where it applies).
 */
export function ogBase(l: Locale) {
  const other: Locale = l === "fr" ? "en" : "fr";
  return {
    type: "website" as const,
    siteName: "NULLSEC",
    locale: OG_LOCALE[l],
    alternateLocale: [OG_LOCALE[other]],
  };
}
