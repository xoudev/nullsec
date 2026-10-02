"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { localePath } from "@/lib/locale";

/**
 * Localized 404 body; the route itself stays a server component.
 *
 * Two hosts render it. app/[locale]/not-found sits inside the locale provider
 * and passes nothing: `tr` picks the language. The global app/not-found has no
 * locale at all: it is one static page served for every unmatched URL,
 * /fr/... included, and must stay static (a dynamic catch-all would bill a
 * function call per 404, which is exactly what a crawler flood is made of). So
 * with `bilingual` it ships both languages, and a pre-paint script in its
 * <head> sets <html lang> from the URL; globals.css then hides the other one.
 */
export function NotFoundBody({ bilingual = false }: { bilingual?: boolean }) {
  const { tr, lp } = useT();

  const say = (en: string, fr: string) =>
    bilingual ? (
      <>
        <span className="nf-en">{en}</span>
        <span className="nf-fr">{fr}</span>
      </>
    ) : (
      tr(en, fr)
    );

  const linkStyle = {
    fontFamily: "var(--font-jetbrains-mono)",
    fontSize: "0.8rem",
    letterSpacing: "0.06em",
    alignItems: "center",
    gap: "0.5rem",
  } as const;

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--color-void)",
        color: "var(--color-bone)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(1.5rem, 4vw, 3rem)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.75rem",
          color: "var(--color-blood)",
          letterSpacing: "0.1em",
          marginBottom: "2rem",
        }}
      >
        {say("// ERROR 404", "// ERREUR 404")}
      </div>

      <h1
        style={{
          fontFamily: "var(--font-instrument-serif)",
          fontStyle: "italic",
          fontSize: "clamp(4rem, 12vw, 12rem)",
          lineHeight: 0.85,
          color: "var(--color-bone)",
          letterSpacing: "-0.02em",
          margin: "0 0 2rem",
        }}
      >
        {say("Not found.", "Introuvable.")}
      </h1>

      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.75rem",
          color: "var(--color-ash)",
          letterSpacing: "0.04em",
          marginBottom: "3rem",
        }}
      >
        {say(
          "// the path you requested does not exist in this system.",
          "// le chemin demandé n'existe pas dans ce système.",
        )}
      </p>

      {bilingual ? (
        <div>
          <Link href={localePath("en", "/")} className="hover-to-bone nf-en" style={linkStyle}>
            ← return to NULLSEC
          </Link>
          <Link href={localePath("fr", "/")} className="hover-to-bone nf-fr" style={linkStyle}>
            ← retour à NULLSEC
          </Link>
        </div>
      ) : (
        <Link href={lp("/")} className="hover-to-bone" style={{ ...linkStyle, display: "inline-flex" }}>
          {tr("← return to NULLSEC", "← retour à NULLSEC")}
        </Link>
      )}
    </div>
  );
}
