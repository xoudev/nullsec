import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { work, getAdjacentWork } from "@/content/work";
import { profile } from "@/profile";
import { ReadingProgress } from "@/components/ReadingProgress";

/* ─── Static generation ─── */
export function generateStaticParams() {
  return work.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = work.find((w) => w.slug === slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.excerpt,
    openGraph: {
      title: `${item.title} · NULLSEC`,
      description: item.excerpt,
      url: `${profile.siteUrl}/work/${item.slug}`,
    },
  };
}

/* ─── Page ─── */
export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = work.find((w) => w.slug === slug);
  if (!item) notFound();

  const { prev, next } = getAdjacentWork(slug);

  return (
    <>
    <ReadingProgress />
    <article
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
        aria-label="Site navigation"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "clamp(4rem, 8vw, 7rem)",
        }}
      >
        <Link
          href="/"
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
      <header>
        <div
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.65rem",
            color: "var(--color-ash)",
            letterSpacing: "0.1em",
            marginBottom: "1.25rem",
          }}
        >
          {item.index}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-instrument-serif)",
            fontStyle: "italic",
            fontSize: "clamp(2.8rem, 7.5vw, 7rem)",
            lineHeight: 0.88,
            color: "var(--color-bone)",
            letterSpacing: "-0.025em",
            margin: "0 0 clamp(1.5rem, 3vw, 2.5rem)",
          }}
        >
          {item.title}
        </h1>

        {/* Meta row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            alignItems: "center",
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.06em",
            marginBottom: "clamp(2rem, 4vw, 3.5rem)",
          }}
        >
          <span style={{ color: "var(--color-blood)" }}>[{item.year}]</span>
          {item.tags.map((tag) => (
            <span key={tag} style={{ color: "var(--color-ash)" }}>
              {tag}
            </span>
          ))}
        </div>

        <div
          aria-hidden="true"
          style={{
            height: "1px",
            backgroundColor: "rgba(107,107,107,0.25)",
            marginBottom: "clamp(2.5rem, 5vw, 4rem)",
          }}
        />
      </header>


      {/* ── Two-column body ── */}
      <div className="article-grid">
        {/* Body copy */}
        <section aria-label="Case study">
          {item.body.map((paragraph, i) => (
            <p
              key={i}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(1rem, 1.15vw, 1.1rem)",
                color: "rgba(242,239,232,0.82)",
                lineHeight: 1.82,
                margin: 0,
                marginBottom: i < item.body.length - 1 ? "1.9rem" : 0,
              }}
            >
              {paragraph}
            </p>
          ))}
        </section>

        {/* Sticky sidebar */}
        <aside className="article-sidebar" aria-label="Project metadata">
          {/* Project image — small, contained, void bg so white logos read cleanly.
              No asset yet → a typographic placeholder cover generated from the
              project's own index + title (never a fabricated screenshot). */}
          {item.image ? (
            <div
              style={{
                backgroundColor: "var(--color-void)",
                border: "1px solid rgba(107,107,107,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1.25rem",
                marginBottom: "clamp(1.5rem, 2.5vw, 2rem)",
              }}
            >
              <Image
                src={item.image}
                alt=""
                width={320}
                height={180}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  maxHeight: "140px",
                  objectFit: "contain",
                }}
              />
            </div>
          ) : (
            <div
              aria-hidden="true"
              style={{
                position: "relative",
                overflow: "hidden",
                backgroundColor: "var(--color-void)",
                border: "1px solid rgba(107,107,107,0.18)",
                minHeight: "clamp(120px, 22vw, 168px)",
                padding: "1.1rem 1.25rem",
                marginBottom: "clamp(1.5rem, 2.5vw, 2rem)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  position: "relative",
                  zIndex: 1,
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: "0.6rem",
                  color: "var(--color-blood)",
                  letterSpacing: "0.12em",
                }}
              >
                {item.index} {"//"}
              </span>

              {/* Oversized ghost index — the cover's only graphic. */}
              <span
                style={{
                  position: "absolute",
                  right: "-0.5rem",
                  bottom: "-2.2rem",
                  fontFamily: "var(--font-instrument-serif)",
                  fontStyle: "italic",
                  fontSize: "clamp(6rem, 16vw, 9rem)",
                  lineHeight: 1,
                  color: "rgba(107,107,107,0.10)",
                  letterSpacing: "-0.03em",
                  userSelect: "none",
                }}
              >
                {item.index}
              </span>

              <span
                style={{
                  position: "relative",
                  zIndex: 1,
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: "0.62rem",
                  color: "var(--color-ash)",
                  letterSpacing: "0.06em",
                }}
              >
                {`// ${item.title.toLowerCase()}`}
              </span>
            </div>
          )}

          {/* Live link — only when the project has a public site */}
          {item.liveUrl && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "0.7rem",
                color: "var(--color-blood)",
                letterSpacing: "0.08em",
                textDecoration: "none",
                marginBottom: "clamp(1.5rem, 2.5vw, 2rem)",
              }}
            >
              {"[ live → ]"}
            </a>
          )}

          {/* Pull quote */}
          <blockquote
            style={{
              margin: "0 0 clamp(2rem, 3vw, 2.5rem)",
              padding: "0 0 0 1.25rem",
              borderLeft: "2px solid var(--color-blood)",
              fontFamily: "var(--font-instrument-serif)",
              fontStyle: "italic",
              fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
              color: "rgba(242,239,232,0.65)",
              lineHeight: 1.65,
            }}
          >
            {item.excerpt}
          </blockquote>

          {/* Divider */}
          <div
            aria-hidden="true"
            style={{
              height: "1px",
              backgroundColor: "rgba(107,107,107,0.2)",
              marginBottom: "clamp(1.5rem, 2.5vw, 2rem)",
            }}
          />

          {/* Stack label */}
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.55rem",
              color: "var(--color-ash)",
              letterSpacing: "0.15em",
              marginBottom: "1rem",
            }}
          >
            STACK
          </div>

          {/* Tags — vertical list */}
          <ul
            aria-label="Technologies used"
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 clamp(2.5rem, 4vw, 3.5rem)",
              display: "flex",
              flexDirection: "column",
              gap: "0.55rem",
            }}
          >
            {item.tags.map((tag) => (
              <li
                key={tag}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "block",
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    backgroundColor: "var(--color-blood)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "0.7rem",
                    color: "var(--color-ash)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {tag}
                </span>
              </li>
            ))}
          </ul>

          {/* Year — large ghost */}
          <div
            aria-hidden="true"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              fontStyle: "italic",
              fontSize: "clamp(4rem, 7vw, 7rem)",
              lineHeight: 1,
              color: "rgba(107,107,107,0.12)",
              letterSpacing: "-0.03em",
              userSelect: "none",
            }}
          >
            {item.year}
          </div>
        </aside>
      </div>

      {/* Bottom divider */}
      <div
        aria-hidden="true"
        style={{
          height: "1px",
          backgroundColor: "rgba(107,107,107,0.25)",
          margin: "clamp(3rem, 6vw, 5rem) 0",
        }}
      />

      {/* Project navigation */}
      <nav
        aria-label="Adjacent projects"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "2rem",
        }}
      >
        {prev ? (
          <Link
            href={`/work/${prev.slug}`}
            aria-label={`Previous project: ${prev.title}`}
            style={{
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "0.6rem",
                color: "var(--color-ash)",
                letterSpacing: "0.08em",
              }}
            >
              ← prev
            </span>
            <span
              className="hover-to-blood"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
                letterSpacing: "0.03em",
              }}
            >
              {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/work/${next.slug}`}
            aria-label={`Next project: ${next.title}`}
            style={{
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.35rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "0.6rem",
                color: "var(--color-ash)",
                letterSpacing: "0.08em",
              }}
            >
              next →
            </span>
            <span
              className="hover-to-blood"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
                letterSpacing: "0.03em",
                textAlign: "right",
              }}
            >
              {next.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
    </>
  );
}
