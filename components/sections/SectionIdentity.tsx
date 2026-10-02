"use client";

import { profile } from "@/profile";
import { useT } from "@/lib/i18n";

/**
 * The hero is painted straight from the HTML and never hidden.
 *
 * It used to wait for the boot gate, then split both title lines into single
 * characters and fly each one in from opacity 0, with the metadata and the
 * call-to-action buttons held invisible until the last letter landed. Name,
 * role and buttons were unreadable for 5 to 6.6 s, and the title was the LCP
 * element, so 86 % of the LCP was render delay. Splitting the title into
 * spans was also a large share of the start-up main-thread work on mobile.
 *
 * What remains is motion that never hides content, and all of it is CSS
 * (app/globals.css): the rule under the title draws itself, and the scroll
 * arrow bobs six times, then rests. The arrow used to bob through a GSAP tween
 * with `repeat: -1`, which rewrote its style 62 times a second for as long as
 * the tab stayed open, on mobile too where the arrow is not even displayed;
 * that one tween kept a third of a throttled phone's main thread busy with
 * nobody touching the page.
 */
export function SectionIdentity() {
  const { t, tr } = useT();

  return (
    <section
      data-section-id="01"
      aria-label={tr("Identity", "Identité")}
      style={{
        minHeight:       "100dvh",
        backgroundColor: "var(--color-void)",
        display:         "flex",
        flexDirection:   "column",
        justifyContent:  "center",
        padding:         "clamp(1.5rem, 4vw, 3rem)",
        position:        "relative",
        overflow:        "hidden",
      }}
    >
      {/* Section number */}
      <div
        aria-hidden="true"
        style={{
          position:      "absolute",
          top:           "clamp(1.5rem, 4vw, 3rem)",
          left:          "clamp(1.5rem, 4vw, 3rem)",
          fontFamily:    "var(--font-jetbrains-mono)",
          fontSize:      "0.65rem",
          color:         "var(--color-blood)",
          letterSpacing: "0.1em",
          zIndex:        2,
        }}
      >
        01 // IDENTITY
      </div>

      {/* Ghost numeral — bottom-right so it balances the left-anchored title */}
      <span
        aria-hidden="true"
        className="ghost-numeral"
        style={{ top: "auto", bottom: "clamp(4rem, 10vw, 8rem)" }}
      >
        01
      </span>

      {/* Title — the page's real h1 (the preloader wordmark is decorative) */}
      <h1
        style={{ position: "relative", zIndex: 2, margin: 0, fontWeight: 400 }}
        aria-label={tr(
          `${profile.fullName} — cybersecurity portfolio. I map the blind spots.`,
          `${profile.fullName}, portfolio cybersécurité. Je cartographie les angles morts.`,
        )}
      >
        <div
          aria-hidden="true"
          style={{
            fontFamily:    "var(--font-instrument-serif)",
            fontStyle:     "italic",
            fontSize:      "clamp(4rem, 11vw, 18rem)",
            lineHeight:    0.85,
            color:         "var(--color-bone)",
            letterSpacing: "-0.02em",
          }}
        >
          {tr("I map the", "Je cartographie")}
        </div>
        <div
          aria-hidden="true"
          style={{
            fontFamily:    "var(--font-instrument-serif)",
            fontStyle:     "italic",
            fontSize:      "clamp(4rem, 11vw, 18rem)",
            lineHeight:    0.85,
            color:         "var(--color-bone)",
            letterSpacing: "-0.02em",
          }}
        >
          {tr("blind spots.", "les angles morts.")}
        </div>
        {/* The page's one deliberate large-scale colour moment — the violet
            signature that pairs with the orange accents. */}
        <div
          aria-hidden="true"
          className="hero-rule"
          style={{
            height: "2px",
            width: "clamp(6rem, 20vw, 20rem)",
            backgroundColor: "var(--color-violet)",
            marginTop: "clamp(1.25rem, 3vw, 2.5rem)",
          }}
        />
      </h1>

      {/* Bottom row: metadata + scroll arrow */}
      <div
        style={{
          position:       "absolute",
          bottom:         "clamp(1.5rem, 4vw, 3rem)",
          left:           "clamp(1.5rem, 4vw, 3rem)",
          right:          "clamp(1.5rem, 4vw, 3rem)",
          display:        "flex",
          alignItems:     "flex-end",
          justifyContent: "space-between",
          zIndex:         2,
        }}
      >
        <div
          style={{
            position:      "relative",
            zIndex:        1,
            fontFamily:    "var(--font-jetbrains-mono)",
            fontSize:      "clamp(0.6rem, 0.9vw, 0.75rem)",
            color:         "var(--color-ash)",
            letterSpacing: "0.06em",
            lineHeight:    1.8,
          }}
        >
          <div>
            {"// "}{profile.handle}
            {" · "}{profile.city.toLowerCase()}
            {tr(" · full-time from ", " · temps plein dès ")}{t(profile.available).toLowerCase()}
          </div>
          <div>{"// GRC · BLUE TEAM · DEVSECOPS"}</div>
          <div style={{ marginTop: "0.4rem" }}>
            {"// "}{t(profile.tagline)}
          </div>
          {/* Primary actions — a recruiter should never have to hunt. */}
          <div
            style={{
              marginTop: "0.9rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.6rem 0.75rem",
            }}
          >
            <a
              href="#fieldwork"
              data-cursor="jump"
              style={{
                color: "var(--color-bone)",
                textDecoration: "none",
                letterSpacing: "0.08em",
                border: "1px solid rgba(138,138,138,0.4)",
                padding: "0.5em 0.9em",
                whiteSpace: "nowrap",
              }}
            >
              {tr("[ view projects ↓ ]", "[ voir les projets ↓ ]")}
            </a>
            <a
              href={`mailto:${profile.email}`}
              data-cursor="mail"
              style={{
                color: "var(--color-void)",
                backgroundColor: "var(--color-blood)",
                textDecoration: "none",
                letterSpacing: "0.08em",
                border: "1px solid var(--color-blood)",
                padding: "0.5em 0.9em",
                whiteSpace: "nowrap",
              }}
            >
              {tr("[ contact me ]", "[ me contacter ]")}
            </a>
            <a
              href={t(profile.cvUrl)}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="open ↗"
              style={{
                color: "var(--color-blood)",
                textDecoration: "none",
                letterSpacing: "0.08em",
                border: "1px solid rgba(255,107,26,0.45)",
                padding: "0.5em 0.9em",
                whiteSpace: "nowrap",
              }}
            >
              {"[ CV ↗ ]"}
            </a>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="hero-scroll-arrow"
          style={{
            fontFamily:    "var(--font-jetbrains-mono)",
            fontSize:      "clamp(1rem, 2vw, 1.5rem)",
            color:         "var(--color-ash)",
            paddingBottom: "0.25rem",
          }}
        >
          ↓
        </div>
      </div>
    </section>
  );
}
