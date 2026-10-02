import { localePath, type Locale, type Localized } from "@/lib/locale";

/**
 * useT() for server components: the same t / tr / lp, bound to a locale
 * passed in rather than read from React context (server components have
 * none). Lets a section render on the server with the same code it had as a
 * client component, minus the hook.
 */
export function getT(locale: Locale) {
  return {
    locale,
    t: <T,>(value: Localized<T>): T => value[locale],
    tr: (en: string, fr: string): string => (locale === "fr" ? fr : en),
    lp: (path: string): string => localePath(locale, path),
  };
}
