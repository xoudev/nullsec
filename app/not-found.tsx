import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Not found",
  description: "The page you requested does not exist.",
};

export default function NotFound() {
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
        {"// ERROR 404"}
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
        Not found.
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
        {"// the path you requested does not exist in this system."}
      </p>

      <Link
        href="/"
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
        ← return to NULLSEC
      </Link>
    </div>
  );
}
