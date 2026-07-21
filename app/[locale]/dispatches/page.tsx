import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dispatches } from "@/content/dispatches";
import { profile } from "@/profile";
import { LOCALES, isLocale, localePath, type Locale } from "@/lib/locale";

/* ─── Static generation ─── */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const COPY = {
  en: {
    title: "Dispatches",
    heading: "Notes from the noise floor.",
    intro:
      "Short field notes on the parts of security that rarely get written down: what a control actually costs, what a certification actually tests, what the second line actually does.",
    description: `Field notes on GRC, detection engineering and security certifications by ${profile.fullName}.`,
    aria: "Writing",
    read: "read",
  },
  fr: {
    title: "Dépêches",
    heading: "Des notes prises au ras du bruit.",
    intro:
      "Notes de terrain sur ce qui s'écrit rarement en sécurité : ce qu'un contrôle coûte vraiment, ce qu'une certification teste vraiment, ce que fait vraiment la seconde ligne.",
    description: `Notes de terrain sur la GRC, l'ingénierie de détection et les certifications sécurité par ${profile.fullName}.`,
    aria: "Écrits",
    read: "de lecture",
  },
} as const;

function formatDate(iso: string, l: Locale): string {
  return new Date(iso).toLocaleDateString(l === "fr" ? "fr-FR" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "en";
  const c = COPY[l];
  const base = profile.siteUrl;
  return {
    title: c.title,
    description: c.description,
    alternates: {
      canonical: `${base}/${l}/dispatches`,
      languages: {
        en: `${base}/en/dispatches`,
        fr: `${base}/fr/dispatches`,
        "x-default": `${base}/en/dispatches`,
      },
    },
    openGraph: {
      title: `${c.title} · NULLSEC`,
      description: c.description,
      url: `${base}/${l}/dispatches`,
    },
  };
}

/* ─── Page ─── */
export default async function DispatchesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l: Locale = locale;
  const c = COPY[l];

  return (
    <main
      id="main-content"
      tabIndex={-1}
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--color-void)",
        color: "var(--color-bone)",
        padding: "clamp(1.5rem, 4vw, 3rem)",
      }}
    >
      {/* Top nav */}
      <nav
        aria-label={l === "fr" ? "Navigation du site" : "Site navigation"}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "clamp(3rem, 7vw, 6rem)",
        }}
      >
        <Link
          href={localePath(l, "/")}
          className="hover-to-bone"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.06em",
          }}
        >
          ← NULLSEC
        </Link>
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.65rem",
            color: "var(--color-blood)",
            letterSpacing: "0.1em",
          }}
        >
          07 // DISPATCHES
        </span>
      </nav>

      {/* Header */}
      <header style={{ marginBottom: "clamp(2rem, 4vw, 3rem)", maxWidth: "62rem" }}>
        <div
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.65rem",
            color: "var(--color-blood)",
            letterSpacing: "0.1em",
            marginBottom: "1.25rem",
          }}
        >
          {"// DISPATCHES"}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-instrument-serif)",
            fontStyle: "italic",
            fontSize: "clamp(2.4rem, 6vw, 5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: "var(--color-bone)",
            margin: "0 0 clamp(1.25rem, 2.5vw, 2rem)",
            maxWidth: "18ch",
          }}
        >
          {c.heading}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(0.95rem, 1.15vw, 1.1rem)",
            color: "rgba(242,239,232,0.72)",
            lineHeight: 1.7,
            margin: 0,
            maxWidth: "60ch",
          }}
        >
          {c.intro}
        </p>
      </header>

      {/* Dispatch list */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }} aria-label={c.aria}>
        {dispatches.map((post, i) => (
          <li key={post.slug} style={{ borderTop: "1px solid rgba(107,107,107,0.2)" }}>
            <Link href={localePath(l, `/dispatches/${post.slug}`)} className="dispatch-row">
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Date + read time */}
                <div
                  aria-hidden="true"
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "0.65rem",
                    color: "var(--color-ash)",
                    letterSpacing: "0.06em",
                    marginBottom: "0.75rem",
                  }}
                >
                  <time dateTime={post.date}>{formatDate(post.date, l)}</time>
                  <span>{post.readTime} {c.read}</span>
                </div>

                {/* Title */}
                <h2
                  className="dispatch-title"
                  style={{
                    fontFamily: "var(--font-instrument-serif)",
                    fontStyle: "italic",
                    fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
                    fontWeight: 400,
                    margin: "0 0 0.75rem",
                    lineHeight: 1.1,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {post.title[l]}
                </h2>

                {/* Excerpt */}
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(0.85rem, 1.1vw, 0.95rem)",
                    color: "var(--color-ash)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {post.excerpt[l]}
                </p>
              </div>

              {/* Ghost article number */}
              <span aria-hidden="true" className="dispatch-number">
                {String(i + 1).padStart(3, "0")}
              </span>
            </Link>
          </li>
        ))}
        <li style={{ borderTop: "1px solid rgba(107,107,107,0.2)", height: 0 }} />
      </ul>
    </main>
  );
}
