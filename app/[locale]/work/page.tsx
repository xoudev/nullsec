import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DossierGrid } from "@/components/DossierGrid";
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
  },
  fr: {
    title: "Travaux de terrain",
    metaTitle: "Projets et études de cas cybersécurité",
    heading: "Des preuves, pas des promesses.",
    intro:
      "Études de cas en GRC, ingénierie de détection, infrastructure homelab et quelques projets créatifs. Chaque fiche suit la même trame : contexte, rôle, livrables et résultat.",
    description: `Projets de ${profile.fullName} : Toron et Hune, deux produits de conformité et de sécurité, CyberLearn, des dossiers GRC, un audit cryptographique, un homelab.`,
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

      {/* The cards, as on the homepage, stacked on a phone (the index is the list). */}
      <DossierGrid l={l} stack />
    </main>
  );
}
