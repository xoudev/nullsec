"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/profile";
import { useT } from "@/lib/i18n";

const MONO = "var(--font-jetbrains-mono)";

/**
 * Compact shared footer — rendered on every route so detail pages are no
 * longer dead-ends: contact, socials, CV and a one-line colophon are always
 * one scroll away. Deliberately quiet so it does not compete with the
 * handshake terminal above it on the homepage.
 */
export function SiteFooter() {
  const { t, tr } = useT();
  const pathname = usePathname();

  const links = [
    { label: "email", href: `mailto:${profile.email}` },
    { label: "github", href: profile.github },
    { label: "linkedin", href: profile.linkedin },
    { label: "cv", href: t(profile.cvUrl) },
    { label: "rss", href: "/feed.xml" },
  ];

  return (
    <footer
      aria-label={tr("Site footer", "Pied de page")}
      className="site-footer"
      style={{
        backgroundColor: "var(--color-void)",
        borderTop: "1px solid rgba(107,107,107,0.18)",
        padding: "clamp(1.5rem, 3vw, 2.25rem) clamp(1.5rem, 4vw, 3rem)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: "1rem 2rem",
        fontFamily: MONO,
        fontSize: "0.65rem",
        color: "var(--color-ash)",
        letterSpacing: "0.06em",
      }}
    >
      {/* Contact + socials */}
      <nav
        aria-label={tr("Contact links", "Liens de contact")}
        style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem 1.5rem" }}
      >
        {links.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") || href.endsWith(".pdf") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="hover-to-bone"
            style={{ whiteSpace: "nowrap" }}
          >
            [ {label} ]
          </a>
        ))}
      </nav>

      {/* Colophon — the no-tracker line is true: there is no analytics code. */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem 1.5rem" }}>
        <span style={{ whiteSpace: "nowrap" }}>
          {tr("// no cookies · no trackers", "// pas de cookies · pas de traceurs")}
        </span>
        <span style={{ whiteSpace: "nowrap" }}>
          {tr("// 4 colours · 3 typefaces", "// 4 couleurs · 3 typographies")}
        </span>
        {pathname !== "/" && (
          <Link href="/" className="hover-to-bone" style={{ whiteSpace: "nowrap" }}>
            {"// NULLSEC ←"}
          </Link>
        )}
      </div>
    </footer>
  );
}
