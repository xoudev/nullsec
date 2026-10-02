import type { Locale } from "@/lib/locale";

const WORDS: Record<Locale, string[]> = {
  en: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
  fr: ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"],
};

/**
 * A small count spelled out, so a heading computed from the data still reads
 * like prose ("Six domaines", "Une certification obtenue"). Ten and above stay
 * digits, as both French and English typography prefer.
 */
export function spell(
  n: number,
  l: Locale,
  opts: { feminine?: boolean; capital?: boolean } = {},
): string {
  let w = Number.isInteger(n) && n >= 0 && n < 10 ? WORDS[l][n] : String(n);
  if (l === "fr" && n === 1 && opts.feminine) w = "une";
  return opts.capital ? w.charAt(0).toUpperCase() + w.slice(1) : w;
}
