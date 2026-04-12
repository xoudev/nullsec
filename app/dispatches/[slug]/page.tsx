import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dispatches, getAdjacentDispatch } from "@/content/dispatches";
import { profile } from "@/profile";
import { ReadingProgress } from "@/components/ReadingProgress";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatYear(iso: string): string {
  return new Date(iso).getFullYear().toString();
}

/* ─── Static generation ─── */
export function generateStaticParams() {
  return dispatches.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = dispatches.find((d) => d.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} · NULLSEC`,
      description: post.excerpt,
      url: `${profile.siteUrl}/dispatches/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

/* ─── Page ─── */
export default async function DispatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = dispatches.find((d) => d.slug === slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentDispatch(slug);

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
          06 // DISPATCHES
        </span>
      </nav>

      {/* Header */}
      <header>
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.65rem",
            color: "var(--color-ash)",
            letterSpacing: "0.06em",
            marginBottom: "1.25rem",
          }}
        >
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-label={`${post.readTime} read`}>{post.readTime} read</span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-instrument-serif)",
            fontStyle: "italic",
            fontSize: "clamp(2.2rem, 6vw, 5.5rem)",
            lineHeight: 0.92,
            color: "var(--color-bone)",
            letterSpacing: "-0.02em",
            margin: "0 0 clamp(2rem, 4vw, 3rem)",
            maxWidth: "62rem",
          }}
        >
          {post.title}
        </h1>

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
        <section aria-label="Article body">
          {post.body.map((paragraph, i) => (
            <p
              key={i}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(1rem, 1.15vw, 1.1rem)",
                color: "rgba(242,239,232,0.82)",
                lineHeight: 1.82,
                margin: 0,
                marginBottom: i < post.body.length - 1 ? "1.9rem" : 0,
              }}
            >
              {paragraph}
            </p>
          ))}
        </section>

        {/* Sticky sidebar */}
        <aside className="article-sidebar" aria-label="Article metadata">
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
            {post.excerpt}
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

          {/* Published label */}
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.55rem",
              color: "var(--color-ash)",
              letterSpacing: "0.15em",
              marginBottom: "0.6rem",
            }}
          >
            PUBLISHED
          </div>
          <time
            dateTime={post.date}
            style={{
              display: "block",
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.72rem",
              color: "var(--color-bone)",
              letterSpacing: "0.04em",
              marginBottom: "clamp(1.5rem, 2.5vw, 2rem)",
            }}
          >
            {formatDate(post.date)}
          </time>

          {/* Read time label */}
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.55rem",
              color: "var(--color-ash)",
              letterSpacing: "0.15em",
              marginBottom: "0.6rem",
            }}
          >
            READ TIME
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.72rem",
              color: "var(--color-bone)",
              letterSpacing: "0.04em",
              marginBottom: "clamp(2.5rem, 4vw, 3.5rem)",
            }}
          >
            {post.readTime}
          </div>

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
            {formatYear(post.date)}
          </div>
        </aside>
      </div>

      {/* Divider */}
      <div
        aria-hidden="true"
        style={{
          height: "1px",
          backgroundColor: "rgba(107,107,107,0.25)",
          margin: "clamp(3rem, 6vw, 5rem) 0",
        }}
      />

      {/* Dispatch navigation */}
      <nav
        aria-label="Adjacent dispatches"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "2rem",
        }}
      >
        {prev ? (
          <Link
            href={`/dispatches/${prev.slug}`}
            aria-label={`Previous: ${prev.title}`}
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
                fontFamily: "var(--font-instrument-serif)",
                fontStyle: "italic",
                fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)",
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
            href={`/dispatches/${next.slug}`}
            aria-label={`Next: ${next.title}`}
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
                fontFamily: "var(--font-instrument-serif)",
                fontStyle: "italic",
                fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)",
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
