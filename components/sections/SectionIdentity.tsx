"use client";

import { profile } from "@/profile";
import { useT } from "@/lib/i18n";
import { BlindSpotScan } from "@/components/BlindSpotScan";
import { section, sectionLabel } from "@/lib/sections";

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
      data-section-id={section("identity").id}
      aria-label={tr("Identity", "Identité")}
      style={{
        minHeight:       "100dvh",
        backgroundColor: "var(--color-void)",
        display:         "flex",
        flexDirection:   "column",
        padding:         "clamp(1.5rem, 4vw, 3rem)",
        position:        "relative",
        overflow:        "hidden",
      }}
    >
      {/* The map under the headline, revealed by the pointer (or one radar
          sweep on a phone). Decorative; see BlindSpotScan. */}
      <BlindSpotScan />

      {/* Section number */}
      <div
        aria-hidden="true"
        data-hero-label=""
        style={{
          position:      "absolute",
          top:           "clamp(1.5rem, 4vw, 3rem)",
          left:          "clamp(1.5rem, 4vw, 3rem)",
          fontFamily:    "var(--font-jetbrains-mono)",
          fontSize:      "0.75rem",
          color:         "var(--color-blood)",
          letterSpacing: "0.1em",
          zIndex:        2,
        }}
      >
        {tr(sectionLabel("identity", "en"), sectionLabel("identity", "fr"))}
      </div>

      {/* Title block: takes the height the bottom row leaves and centres
          itself in it. The bottom row used to be absolutely positioned, so on
          a short phone (360 × 640) the two overlapped; in the flow, the hero
          simply grows instead. */}
      <div
        style={{
          flex:           1,
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "center",
          padding:        "clamp(3rem, 7vw, 4.5rem) 0 clamp(2rem, 4vw, 3rem)",
        }}
      >
      {/* The h1 is the name. It used to be the slogan, with the name only in
          an aria-label: a recruiter landing here could read "I map the blind
          spots" and nowhere, above the fold, whose page this was. */}
      <h1
        style={{
          position:     "relative",
          zIndex:       2,
          margin:       "0 0 clamp(1.25rem, 2.6vw, 2.25rem)",
          fontWeight:   400,
        }}
      >
        <span
          style={{
            display:       "block",
            fontFamily:    "var(--font-sans)",
            fontSize:      "clamp(1.6rem, 3.2vw, 3rem)",
            lineHeight:    1.05,
            letterSpacing: "-0.02em",
            color:         "var(--color-bone)",
          }}
        >
          {profile.fullName}
        </span>
        <span className="sr-only">, </span>
        <span
          style={{
            display:       "block",
            marginTop:     "0.7rem",
            fontFamily:    "var(--font-jetbrains-mono)",
            fontSize:      "clamp(0.75rem, 1vw, 0.875rem)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color:         "var(--color-blood)",
          }}
        >
          {tr("Cybersecurity · GRC & ISMS", "Cybersécurité · GRC & SMSI")}
        </span>
      </h1>

      {/* The display line: what the name does, at the scale of a headline */}
      <p style={{ position: "relative", zIndex: 2, margin: 0 }}>
        <span
          style={{
            display:       "block",
            fontFamily:    "var(--font-instrument-serif)",
            fontStyle:     "italic",
            fontSize:      "clamp(4rem, 11vw, 18rem)",
            lineHeight:    0.85,
            color:         "var(--color-bone)",
            letterSpacing: "-0.02em",
          }}
        >
          {tr("I map the", "Je cartographie")}{" "}
          <span style={{ display: "block" }}>{tr("blind spots.", "les angles morts.")}</span>
        </span>
        {/* The rule under the line, in the accent. It used to be the violet
            of the ghost numerals: a second accent the palette never needed. */}
        <span
          aria-hidden="true"
          className="hero-rule"
          style={{
            display: "block",
            height: "2px",
            width: "clamp(6rem, 20vw, 20rem)",
            backgroundColor: "var(--color-blood)",
            marginTop: "clamp(1.25rem, 3vw, 2.5rem)",
          }}
        />
      </p>
      </div>

      {/* Bottom row: metadata + scroll arrow, in the flow */}
      <div
        style={{
          position:       "relative",
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
            fontSize:      "clamp(0.75rem, 0.9vw, 0.85rem)",
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
          <div>{tr("// apprentice assistant LISO @ arvato", "// assistant LISO en alternance @ arvato")}</div>
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
