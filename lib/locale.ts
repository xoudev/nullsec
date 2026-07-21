/**
 * Server-safe i18n primitives.
 *
 * These live OUTSIDE lib/i18n.tsx (which is a "use client" module) on purpose:
 * server components — layouts, pages, the sitemap, the OG-image routes — import
 * the real values from here. Importing them from a "use client" module hands the
 * server a client-reference proxy instead of the actual array/function, so
 * `LOCALES.map(...)` / `isLocale(...)` explode at build time ("LOCALES.flatMap
 * is not a function"). Client components can import these too (re-exported from
 * lib/i18n for convenience).
 */

export type Locale = "en" | "fr";
export const LOCALES: Locale[] = ["en", "fr"];
export const DEFAULT_LOCALE: Locale = "en";

/** A value that exists in both locales. */
export type Localized<T> = { en: T; fr: T };

export function isLocale(v: string | undefined): v is Locale {
  return v === "en" || v === "fr";
}

/** Prefix an app-absolute path with the locale segment. */
export function localePath(locale: Locale, path: string): string {
  if (!path.startsWith("/")) return path; // hash / mailto / external — untouched
  return `/${locale}${path === "/" ? "" : path}`;
}
