"use client";

import { createContext, useCallback, useContext, useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { type Locale, type Localized, DEFAULT_LOCALE, localePath } from "./locale";

/**
 * Route-driven i18n. The locale is the first URL segment (/en or /fr), so the
 * server renders each language on its own URL (indexable, hreflang-linked).
 * Content lives in the typed data modules as `Localized<T>` ({ en, fr }) and is
 * picked via `t()`; inline chrome strings use `tr(en, fr)`.
 *
 * The pure primitives (LOCALES, isLocale, localePath, the Locale/Localized
 * types) live in ./locale — a server-safe module — because THIS file carries
 * "use client". Re-exporting them keeps the client-facing API stable, while
 * server components import them straight from ./locale (importing from a client
 * module hands the server a proxy and breaks LOCALES.map at build time).
 */
export { LOCALES, DEFAULT_LOCALE, isLocale, localePath } from "./locale";
export type { Locale, Localized } from "./locale";

/** Swap the locale segment of the current pathname. */
function swapLocale(pathname: string, target: Locale): string {
  const rest = pathname.replace(/^\/(en|fr)(?=\/|$)/, "");
  return `/${target}${rest || ""}` || `/${target}`;
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  toggle: () => {},
});

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Keep <html lang> in sync (the root layout can't know the locale).
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (l: Locale) => {
      if (l !== locale) router.push(swapLocale(pathname, l));
    },
    [locale, pathname, router],
  );

  const toggle = useCallback(() => {
    setLocale(locale === "en" ? "fr" : "en");
  }, [locale, setLocale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggle }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}

/**
 * Translation helpers bound to the active locale.
 * - `t(value)` picks the active locale from a `Localized<T>`.
 * - `tr(en, fr)` returns the active-locale string for inline chrome.
 * - `lp(path)` prefixes an internal path with the current locale.
 */
export function useT() {
  const { locale } = useLocale();
  const t = useCallback(<T,>(value: Localized<T>): T => value[locale], [locale]);
  const tr = useCallback(
    (en: string, fr: string): string => (locale === "fr" ? fr : en),
    [locale],
  );
  const lp = useCallback((path: string): string => localePath(locale, path), [locale]);
  return { locale, t, tr, lp };
}
