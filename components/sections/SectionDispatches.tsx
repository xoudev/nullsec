import Link from "next/link";
import { getT } from "@/lib/i18n-static";
import type { Locale } from "@/lib/locale";
import { section, sectionLabel } from "@/lib/sections";
import { dispatches } from "@/content/dispatches";

function formatDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function SectionDispatches({ l }: { l: Locale }) {
  const { t, tr, lp, locale } = getT(l);


  return (
    <section
      id="dispatches"
      data-section-id={section("dispatches").id}
      aria-label={tr("Dispatches", "Dépêches")}
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
          fontFamily:    "var(--font-jetbrains-mono)",
          fontSize:      "0.75rem",
          color:         "var(--color-blood)",
          letterSpacing: "0.1em",
          marginBottom:  "clamp(2rem, 4vw, 3rem)",
        }}
      >
        {tr(sectionLabel("dispatches", "en"), sectionLabel("dispatches", "fr"))}
      </div>

      {/* Display line — every chapter opens the same way */}
      <h2
        style={{
          fontFamily:    "var(--font-instrument-serif)",
          fontStyle:     "italic",
          fontSize:      "clamp(1.8rem, 4.5vw, 3.5rem)",
          lineHeight:    1.05,
          letterSpacing: "-0.02em",
          color:         "var(--color-bone)",
          margin:        "0 0 clamp(2.5rem, 5vw, 4rem)",
          maxWidth:      "20ch",
        }}
      >
        {tr("Notes from the noise floor.", "Des notes prises au ras du bruit.")}
      </h2>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }} aria-label={tr("Writing", "Écrits")}>
        {dispatches.map((post, i) => (
          <li
            key={post.slug}
            data-reveal=""
            style={{
              borderTop: "1px solid rgba(107,107,107,0.2)",
              "--reveal-y": "50px",
              "--reveal-duration": "0.8s",
              "--reveal-delay": `${Math.min(i, 3) * 0.1}s`,
            } as React.CSSProperties}
          >
            {/* Full-width flex row: text block left, ghost number right */}
            <Link
              href={lp(`/dispatches/${post.slug}`)}
              className="dispatch-row"
            >
              {/* ── Text block ── */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Date + read time */}
                <div
                  aria-hidden="true"
                  style={{
                    display:       "flex",
                    gap:           "1.5rem",
                    fontFamily:    "var(--font-jetbrains-mono)",
                    fontSize:      "0.75rem",
                    color:         "var(--color-ash)",
                    letterSpacing: "0.06em",
                    marginBottom:  "0.75rem",
                  }}
                >
                  <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                  <span>{post.readTime}</span>
                </div>

                {/* Title */}
                <h3
                  className="dispatch-title"
                  style={{
                    fontFamily:    "var(--font-instrument-serif)",
                    fontStyle:     "italic",
                    fontSize:      "clamp(1.25rem, 2.5vw, 2rem)",
                    fontWeight:    400,
                    margin:        "0 0 0.75rem",
                    lineHeight:    1.1,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {t(post.title)}
                </h3>

                {/* Excerpt */}
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize:   "clamp(0.85rem, 1.1vw, 0.95rem)",
                    color:      "var(--color-ash)",
                    lineHeight: 1.7,
                    margin:     0,
                  }}
                >
                  {t(post.excerpt)}
                </p>
              </div>

              {/* ── Ghost article number ── */}
              <span
                aria-hidden="true"
                className="dispatch-number"
                data-numeral={String(i + 1).padStart(3, "0")}
              />
            </Link>
          </li>
        ))}
        <li style={{ borderTop: "1px solid rgba(107,107,107,0.2)", height: 0 }} />
      </ul>
    </section>
  );
}
