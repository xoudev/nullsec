"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

/** Localized 404 body — the route itself stays a server component. */
export function NotFoundBody() {
  const { tr, lp } = useT();

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
          fontSize: "0.65rem",
          color: "var(--color-blood)",
          letterSpacing: "0.1em",
          marginBottom: "2rem",
        }}
      >
        {tr("// ERROR 404", "// ERREUR 404")}
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
        {tr("Not found.", "Introuvable.")}
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
        {tr(
          "// the path you requested does not exist in this system.",
          "// le chemin demandé n'existe pas dans ce système.",
        )}
      </p>

      <Link
        href={lp("/")}
        className="hover-to-bone"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.7rem",
          letterSpacing: "0.06em",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {tr("← return to NULLSEC", "← retour à NULLSEC")}
      </Link>
    </div>
  );
}
