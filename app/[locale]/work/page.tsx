import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { orderedWork } from "@/content/work";
import { profile } from "@/profile";
import { LOCALES, isLocale, localePath, type Locale } from "@/lib/locale";

/* ─── Static generation ─── */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const COPY = {
  en: {
    title: "Fieldwork",
    heading: "Proof over promises.",
    intro:
      "Case studies from GRC, detection engineering, homelab infrastructure and a few creative builds. Each entry keeps the same shape: context, role, what shipped, and the outcome.",
    description: `Selected security and engineering case studies by ${profile.fullName}: GRC, blue-team detection, homelab infrastructure and creative builds.`,
    aria: "Selected projects",
    side: "// SIDE PROJECTS · CREATIVE ENGINEERING",
  },
  fr: {
    title: "Travaux de terrain",
    heading: "Des preuves, pas des promesses.",
    intro:
      "Études de cas en GRC, ingénierie de détection, infrastructure homelab et quelques projets créatifs. Chaque fiche suit la même trame : contexte, rôle, livrables et résultat.",
    description: `Études de cas sécurité et ingénierie de ${profile.fullName} : GRC, détection blue team, infrastructure homelab et projets créatifs.`,
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
    title: c.title,
    description: c.description,
    alternates: {
      canonical: `${base}/${l}/work`,
      languages: {
        en: `${base}/en/work`,
        fr: `${base}/fr/work`,
        "x-default": `${base}/en/work`,
      },
    },
    openGraph: {
      title: `${c.title} · NULLSEC`,
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
          02 // FIELDWORK
        </span>
      </nav>

      {/* Header */}
      <header style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)", maxWidth: "62rem" }}>
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
          {"// FIELDWORK"}
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
                    fontSize: "0.6rem",
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
                aria-label={`${item.title[l]}, ${item.year}`}
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
                    fontSize: "clamp(0.65rem, 0.9vw, 0.8rem)",
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
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains-mono)",
                      fontSize: "0.68rem",
                      color: "var(--color-ash)",
                      lineHeight: 1.55,
                      letterSpacing: "0.02em",
                      maxWidth: "72ch",
                    }}
                  >
                    {item.excerpt[l]}
                  </span>
                </div>

                {/* Tags — md+ */}
                <span
                  aria-hidden="true"
                  className="hidden md:flex"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "0.6rem",
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
                    fontSize: "clamp(0.65rem, 0.9vw, 0.8rem)",
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
