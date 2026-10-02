import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { orderedWork } from "@/content/work";
import { profile } from "@/profile";
import { LOCALES, isLocale, localePath, type Locale } from "@/lib/locale";
import { ogBase } from "@/lib/seo";
import { section, sectionLabel } from "@/lib/sections";

/* ─── Static generation ─── */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const COPY = {
  en: {
    title: "Fieldwork",
    metaTitle: "Security projects and case studies",
    heading: "Proof over promises.",
    intro:
      "Case studies from GRC, detection engineering, homelab infrastructure and a few creative builds. Each entry keeps the same shape: context, role, what shipped, and the outcome.",
    description: `Projects by ${profile.fullName}: Toron and Hune, two products designed for compliance and security, CyberLearn, GRC dossiers, a cryptographic audit, a homelab.`,
    aria: "Selected projects",
    side: "// SIDE PROJECTS · CREATIVE ENGINEERING",
  },
  fr: {
    title: "Travaux de terrain",
    metaTitle: "Projets et études de cas cybersécurité",
    heading: "Des preuves, pas des promesses.",
    intro:
      "Études de cas en GRC, ingénierie de détection, infrastructure homelab et quelques projets créatifs. Chaque fiche suit la même trame : contexte, rôle, livrables et résultat.",
    description: `Projets de ${profile.fullName} : Toron et Hune, deux produits de conformité et de sécurité, CyberLearn, des dossiers GRC, un audit cryptographique, un homelab.`,
    aria: "Projets sélectionnés",
    side: "// PROJETS ANNEXES · INGÉNIERIE CRÉATIVE",
  },
} as const;

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
    title: c.metaTitle,
    description: c.description,
    alternates: {
      canonical: `${base}/${l}/work`,
      languages: {
        en: `${base}/en/work`,
        fr: `${base}/fr/work`,
        "x-default": `${base}/en/work`,
      },
    },
    // og:image comes from app/[locale]/work/opengraph-image.
    openGraph: {
      ...ogBase(l),
      title: `${c.metaTitle} · ${profile.fullName}`,
      description: c.description,
      url: `${base}/${l}/work`,
    },
  };
}

/* ─── Page ─── */
export default async function WorkIndexPage({
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
        minHeight: "100svh",
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
            fontSize: "0.8rem",
            letterSpacing: "0.06em",
          }}
        >
          ← NULLSEC
        </Link>
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.75rem",
            color: "var(--color-blood)",
            letterSpacing: "0.1em",
          }}
        >
          {sectionLabel("fieldwork", l)}
        </span>
      </nav>

      {/* Header */}
      <header style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)", maxWidth: "62rem" }}>
        <div
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.75rem",
            color: "var(--color-blood)",
            letterSpacing: "0.1em",
            marginBottom: "1.25rem",
          }}
        >
          {`// ${section("fieldwork")[l]}`}
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

      {/* Project list */}
      <nav aria-label={c.aria}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {orderedWork.map((item, i) => (
            <li key={item.slug}>
              {/* Divider before the first side project. */}
              {item.tier === "side" && orderedWork[i - 1]?.tier !== "side" && (
                <div
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "0.75rem",
                    color: "var(--color-ash)",
                    letterSpacing: "0.14em",
                    padding: "clamp(2.5rem, 5vw, 4rem) 0 clamp(1rem, 2vw, 1.5rem)",
                    borderTop: "1px solid rgba(107,107,107,0.2)",
                  }}
                >
                  {c.side}
                </div>
              )}
              <Link
                href={localePath(l, `/work/${item.slug}`)}
                className="index-row"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "clamp(1rem, 3vw, 2.5rem)",
                  padding: "clamp(1.5rem, 3.5vw, 2.5rem) 0",
                  borderTop: "1px solid rgba(107,107,107,0.2)",
                }}
              >
                {/* Index */}
                <span
                  className="index-index"
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "clamp(0.75rem, 0.9vw, 0.85rem)",
                    color: "var(--color-ash)",
                    minWidth: "2.5rem",
                    letterSpacing: "0.05em",
                    flexShrink: 0,
                  }}
                >
                  {item.index}
                </span>

                {/* Title + excerpt */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <span
                    className="index-title"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "clamp(1.05rem, 2.6vw, 2.1rem)",
                      fontWeight: 400,
                      color: "var(--color-bone)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item.title[l]}
                  </span>
                  {/* Reading size, in the sans: the full excerpt lives here, so
                      it must be comfortable to read (it was 12.8 px mono). */}
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "clamp(0.9375rem, 1.05vw, 1rem)",
                      color: "rgba(242,239,232,0.68)",
                      lineHeight: 1.6,
                      maxWidth: "64ch",
                    }}
                  >
                    {item.excerpt[l]}
                    <span className="sr-only">{`, ${item.year}`}</span>
                  </span>
                </div>

                {/* Tags — md+ */}
                <span
                  aria-hidden="true"
                  className="hidden md:flex"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "0.75rem",
                    color: "var(--color-ash)",
                    letterSpacing: "0.04em",
                    gap: "0.5rem",
                  }}
                >
                  {item.tags.slice(0, 2).join(" · ")}
                </span>

                {/* Year */}
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "clamp(0.75rem, 0.9vw, 0.85rem)",
                    color: "var(--color-ash)",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  [{item.year}]{"  →"}
                </span>
              </Link>
            </li>
          ))}
          <li style={{ borderTop: "1px solid rgba(107,107,107,0.2)", height: 0 }} />
        </ul>
      </nav>
    </main>
  );
}
