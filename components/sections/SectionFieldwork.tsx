import { ViewTransition } from "react";
import Link from "next/link";
import { getT } from "@/lib/i18n-static";
import type { Locale } from "@/lib/locale";
import { workTitleTransition } from "@/lib/transitions";
import { section, sectionLabel } from "@/lib/sections";
import { orderedWork } from "@/content/work";

/**
 * The project list. A server component: the hover (a bone wipe across the
 * row, the text turning dark over it) is pure CSS (.fw-* in globals.css), and
 * the staggered entrance is data-reveal (components/Reveal.tsx). It used to
 * be a client component whose GSAP handlers did both, which also shipped the
 * whole case-study content to the browser to render nine rows.
 */
export function SectionFieldwork({ l }: { l: Locale }) {
  const { t, tr, lp } = getT(l);

  return (
    <section
      id="fieldwork"
      data-section-id={section("fieldwork").id}
      aria-label={tr("Fieldwork", "Travaux de terrain")}
      style={{
        backgroundColor: "var(--color-void)",
        padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 4vw, 3rem)",
        position: "relative",
      }}
    >
      {/* Section label */}
      <div
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.75rem",
          color: "var(--color-blood)",
          letterSpacing: "0.1em",
          marginBottom: "clamp(2rem, 4vw, 3rem)",
        }}
      >
        {tr(sectionLabel("fieldwork", "en"), sectionLabel("fieldwork", "fr"))}
      </div>

      {/* Display line — every chapter opens the same way */}
      <h2
        style={{
          fontFamily: "var(--font-instrument-serif)",
          fontStyle: "italic",
          fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: "var(--color-bone)",
          margin: "0 0 clamp(2.5rem, 5vw, 4rem)",
          maxWidth: "20ch",
        }}
      >
        {tr("Proof over promises.", "Des preuves, pas des promesses.")}
      </h2>

      <nav aria-label={tr("Selected projects", "Projets sélectionnés")}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {orderedWork.map((item, i) => (
            <li key={item.slug} style={{ position: "relative" }}>
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
                  {tr("// SIDE PROJECTS · CREATIVE ENGINEERING", "// PROJETS ANNEXES · INGÉNIERIE CRÉATIVE")}
                </div>
              )}
              {/* Row wrapper: the bone wipe's positioning context (so it covers
                  only the row, never the divider above), and the unit that
                  reveals on scroll. */}
              <div
                className="fw-row"
                data-reveal=""
                style={{
                  position: "relative",
                  "--reveal-y": "48px",
                  "--reveal-duration": "0.75s",
                  "--reveal-delay": `${i * 0.09}s`,
                } as React.CSSProperties}
              >
                <div aria-hidden="true" className="fw-wipe" />

                <Link
                  href={lp(`/work/${item.slug}`)}
                  className="fw-link"
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "clamp(1rem, 3vw, 2.5rem)",
                    padding: "clamp(1.5rem, 3.5vw, 2.5rem) 0",
                    borderTop: "1px solid rgba(107,107,107,0.2)",
                    textDecoration: "none",
                  }}
                >
                  {/* Index */}
                  <span
                    aria-hidden="true"
                    className="fw-index"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono)",
                      fontSize: "clamp(0.75rem, 0.9vw, 0.85rem)",
                      minWidth: "2.5rem",
                      letterSpacing: "0.05em",
                      flexShrink: 0,
                    }}
                  >
                    {item.index}
                  </span>

                  {/* Title + summary column */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {/* Morphs into the case study's headline on navigation. */}
                    <ViewTransition name={workTitleTransition(item.slug)}>
                      <span
                        className="fw-title"
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "clamp(1.05rem, 2.6vw, 2.1rem)",
                          fontWeight: 400,
                          letterSpacing: "0.04em",
                          // A box as tight as the text, so the morph scales the
                          // title, not a full-width strip of empty row.
                          alignSelf: "flex-start",
                        }}
                      >
                        {t(item.title)}
                      </span>
                    </ViewTransition>
                    {/* The short summary (meta.description, at most ~155
                        characters), not the 200 to 340 character excerpt: a
                        list is for scanning, the case study keeps the long
                        version. Stays visible on mobile: without it the section
                        is nine context-free title rows on a phone. */}
                    <span
                      className="fieldwork-excerpt fw-excerpt"
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "clamp(0.9375rem, 1.05vw, 1rem)",
                        lineHeight: 1.6,
                        maxWidth: "62ch",
                      }}
                    >
                      {t(item.meta.description)}
                      {/* The link's name is its visible text (title, summary);
                          the year, shown aria-hidden on the right, comes last. */}
                      <span className="sr-only">{`, ${item.year}`}</span>
                    </span>
                  </div>

                  {/* Tags, md and up */}
                  <span
                    aria-hidden="true"
                    className="hidden md:flex fw-tags"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono)",
                      fontSize: "0.75rem",
                      letterSpacing: "0.04em",
                      gap: "0.5rem",
                    }}
                  >
                    {item.tags.slice(0, 2).join(" · ")}
                  </span>

                  {/* Year + arrow */}
                  <span
                    aria-hidden="true"
                    className="fw-year"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono)",
                      fontSize: "clamp(0.75rem, 0.9vw, 0.85rem)",
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    [{item.year}]{"  →"}
                  </span>
                </Link>
              </div>
            </li>
          ))}
          <li style={{ borderTop: "1px solid rgba(107,107,107,0.2)", height: 0 }} />
        </ul>
      </nav>
    </section>
  );
}
