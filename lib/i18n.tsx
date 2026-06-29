"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Lightweight client-side i18n.
 *
 * Content lives in the typed data modules as `Localized<T>` ({ en, fr }) and is
 * picked at render time via the `t()` helper. UI chrome strings hardcoded in
 * components use the inline `tr(en, fr)` helper. EN is the default; the choice
 * is persisted in localStorage. SSR renders EN (the default) to avoid a
 * hydration mismatch, then the client swaps to the saved locale on mount.
 */

export type Locale = "en" | "fr";

/** A value that exists in both locales. */
export type Localized<T> = { en: T; fr: T };

const STORAGE_KEY = "nullsec_locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
  toggle: () => {},
});

function persist(l: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, l);
  } catch {
    // ignore (private mode / storage disabled)
  }
  if (typeof document !== "undefined") document.documentElement.lang = l;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  // SSR-safe default — must match the server render (always "en").
  const [locale, setLocaleState] = useState<Locale>("en");

  // On mount, adopt the persisted choice (if any).
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      saved = null;
    }
    if (saved === "fr" || saved === "en") {
      setLocaleState(saved);
      if (typeof document !== "undefined") document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    persist(l);
  }, []);

  const toggle = useCallback(() => {
    setLocaleState((prev) => {
      const next: Locale = prev === "en" ? "fr" : "en";
      persist(next);
      return next;
    });
  }, []);

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
 */
export function useT() {
  const { locale } = useLocale();
  const t = useCallback(
    <T,>(value: Localized<T>): T => value[locale],
    [locale],
  );
  const tr = useCallback(
    (en: string, fr: string): string => (locale === "fr" ? fr : en),
    [locale],
  );
  return { locale, t, tr };
}
