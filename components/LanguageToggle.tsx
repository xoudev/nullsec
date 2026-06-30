"use client";

import { useLocale } from "@/lib/i18n";

/**
 * Discreet fixed EN / FR switch — bottom-right so it clears the ScanHUD
 * (top-right) and the hero metadata (bottom-left). Active locale is bone,
 * the other is ash. Visible on every viewport.
 */
export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  const btn = (active: boolean): React.CSSProperties => ({
    background: "none",
    border: "none",
    padding: "0.15em 0.1em",
    margin: 0,
    // No inline cursor: let the global `cursor: none` rule win so the custom
    // reticle takes over (an inline cursor:pointer leaks the native cursor).
    pointerEvents: "auto",
    fontFamily: "inherit",
    fontSize: "inherit",
    letterSpacing: "inherit",
    lineHeight: 1,
    color: active ? "var(--color-bone)" : "var(--color-ash)",
    transition: "color 0.2s ease",
  });

  return (
    <div
      role="group"
      aria-label="Language / Langue"
      style={{
        position: "fixed",
        bottom: "1.25rem",
        right: "1.5rem",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        gap: "0.35em",
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: "0.62rem",
        letterSpacing: "0.12em",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        data-cursor="EN"
        style={btn(locale === "en")}
      >
        EN
      </button>
      <span aria-hidden="true" style={{ color: "rgba(138,138,138,0.5)" }}>
        /
      </span>
      <button
        type="button"
        onClick={() => setLocale("fr")}
        aria-pressed={locale === "fr"}
        data-cursor="FR"
        style={btn(locale === "fr")}
      >
        FR
      </button>
    </div>
  );
}
