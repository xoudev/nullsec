"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { toolkitDomains, toolkitEntryCount } from "@/content/toolkit";

const DEFAULT_HINT = "// hover an entry for its proof";

// Initial clip for the bone title panel's reveal, depending on which side it sits.
// Percent units throughout so GSAP interpolates the wipe cleanly.
function hiddenClip(side: "left" | "right") {
  return side === "left" ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)";
}

// Glyphs cycled during the hover "decode" scramble on domain titles.
const SCRAMBLE_GLYPHS = "ABCDEFGHKMNPRSTUVWXYZ0123456789#%/&";

// Animate `el`'s text from scrambled glyphs to `text`, locking in left-to-right.
// Character count stays constant (only letters/digits scramble) to limit reflow.
// Returns a cancel function that restores the final text.
function runScramble(el: HTMLElement, text: string): () => void {
  const chars = [...text];
  const lockStep = 26; // ms between each character locking in
  const start = performance.now();
  let raf = 0;
  const frame = (now: number) => {
    const t = now - start;
    let allLocked = true;
    let out = "";
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      if (c === " " || c === "/") { out += c; continue; }
      if (t >= 90 + i * lockStep) {
        out += c;
      } else {
        allLocked = false;
        out += SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
      }
    }
    el.textContent = out;
    if (allLocked) { el.textContent = text; return; }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); el.textContent = text; };
}

export function SectionToolkit() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  // entryRefs.current[domainIndex][entryIndex]
  const entryRefs = useRef<HTMLElement[][]>([]);
  const titleTextRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const indexRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrambleCancels = useRef<(() => void)[]>([]);
  const prefersReduced = useReducedMotion();

  // [domainIndex, entryIndex] of the entry currently hovered/focused — drives proof reveal.
  const [active, setActive] = useState<[number, number] | null>(null);

  useEffect(() => {
    const rows = rowRefs.current;

    // Reduced motion — including a runtime flip to "reduce" while rows are still
    // below the fold: force the visible resting state so nothing stays stuck in a
    // hidden start state, then bail before wiring any scroll animation.
    if (prefersReduced) {
      titleRefs.current.forEach((el) => el && gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)" }));
      entryRefs.current.forEach((items) =>
        items?.forEach((el) => el && gsap.set(el, { opacity: 1, y: 0 })),
      );
      return;
    }

    // Lock hidden initial states (section is below the fold, so this runs before it
    // scrolls in; the one-frame first-paint flash is occluded by the preloader).
    titleRefs.current.forEach((cell, i) => {
      if (cell) gsap.set(cell, { clipPath: hiddenClip(i % 2 === 0 ? "left" : "right") });
    });
    entryRefs.current.forEach((items) => {
      items?.forEach((el) => { if (el) gsap.set(el, { opacity: 0, y: 14 }); });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const i = rows.indexOf(entry.target as HTMLDivElement);
          if (i === -1) return;

          const title = titleRefs.current[i];
          if (title) {
            gsap.to(title, {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.7,
              ease: "expo.out",
            });
          }

          const items = entryRefs.current[i]?.filter(Boolean) ?? [];
          if (items.length) {
            gsap.to(items, {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: "power3.out",
              stagger: 0.045,
              delay: 0.12,
            });
          }

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" },
    );

    rows.forEach((row) => { if (row) observer.observe(row); });

    return () => {
      observer.disconnect();
      titleRefs.current.forEach((el) => el && gsap.killTweensOf(el));
      entryRefs.current.forEach((items) => items?.forEach((el) => el && gsap.killTweensOf(el)));
    };
  }, [prefersReduced]);

  // Cancel any in-flight title scrambles on unmount.
  useEffect(() => () => { scrambleCancels.current.forEach((c) => c()); }, []);

  // Hover the bone title panel → "decode" the title + flip its index to blood.
  const enterTitle = (d: number) => {
    const idx = indexRefs.current[d];
    if (idx) idx.style.color = "var(--color-blood)";
    if (prefersReduced) return;
    const h = titleTextRefs.current[d];
    if (!h) return;
    scrambleCancels.current[d]?.();
    scrambleCancels.current[d] = runScramble(h, toolkitDomains[d].title);
  };
  const leaveTitle = (d: number) => {
    const idx = indexRefs.current[d];
    if (idx) idx.style.color = "rgba(10,10,11,0.45)";
  };

  return (
    <section
      ref={sectionRef}
      data-section-id="03"
      aria-label="Toolkit — competence domains"
      style={{
        backgroundColor: "var(--color-void)",
        padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 4vw, 3rem)",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "1rem",
          marginBottom: "clamp(2.5rem, 5vw, 4rem)",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.65rem",
            color: "var(--color-blood)",
            letterSpacing: "0.1em",
          }}
        >
          {"03 // TOOLKIT"}
        </span>
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.6rem",
            color: "var(--color-ash)",
            letterSpacing: "0.1em",
            whiteSpace: "nowrap",
          }}
        >
          {`${toolkitEntryCount} ENTRIES — ${String(toolkitDomains.length).padStart(2, "0")} DOMAINS`}
        </span>
      </div>

      {/* Display quote */}
      <h2
        style={{
          fontFamily: "var(--font-instrument-serif)",
          fontStyle: "italic",
          fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
          lineHeight: 1.0,
          color: "var(--color-bone)",
          letterSpacing: "-0.02em",
          margin: "0 0 clamp(2.5rem, 5vw, 4rem)",
          maxWidth: "16ch",
        }}
      >
        Nothing here without a trace.
      </h2>

      {/* Top rule */}
      <div
        aria-hidden="true"
        style={{ height: "1px", backgroundColor: "rgba(107,107,107,0.2)" }}
      />

      {/* ── Domain checkerboard ── */}
      <div>
        {toolkitDomains.map((domain, d) => {
          const side = d % 2 === 0 ? "left" : "right";
          if (!entryRefs.current[d]) entryRefs.current[d] = [];

          const activeEntry =
            active && active[0] === d ? domain.entries[active[1]] : null;
          const hint = activeEntry?.proof
            ? `// ${activeEntry.proof}${activeEntry.proofHref ? "  →" : ""}`
            : DEFAULT_HINT;

          return (
            <div
              key={domain.title}
              ref={(el) => { rowRefs.current[d] = el; }}
              className="toolkit-row"
              data-title-side={side}
            >
              {/* Title panel (bone) */}
              <div
                ref={(el) => { titleRefs.current[d] = el; }}
                className="toolkit-cell toolkit-title"
                style={{ willChange: "clip-path" }}
                onMouseEnter={() => enterTitle(d)}
                onMouseLeave={() => leaveTitle(d)}
              >
                <div
                  ref={(el) => { indexRefs.current[d] = el; }}
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "0.6rem",
                    color: "rgba(10,10,11,0.45)",
                    letterSpacing: "0.12em",
                    marginBottom: "0.85rem",
                    transition: "color 0.2s ease",
                  }}
                >
                  {String(d + 1).padStart(2, "0")} {"//"}
                </div>
                <h3
                  ref={(el) => { titleTextRefs.current[d] = el; }}
                  style={{
                    fontFamily: "var(--font-instrument-serif)",
                    fontSize: "clamp(1.7rem, 3.6vw, 3.1rem)",
                    fontWeight: 400,
                    lineHeight: 1.02,
                    color: "var(--color-void)",
                    letterSpacing: "-0.01em",
                    margin: 0,
                  }}
                >
                  {domain.title}
                </h3>
              </div>

              {/* Entries panel (void) */}
              <div className="toolkit-cell toolkit-entries">
                <ul
                  aria-label={domain.title}
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.55rem 1.25rem",
                  }}
                >
                  {domain.entries.map((entry, e) => {
                    const isActive = active?.[0] === d && active?.[1] === e;
                    const setRef = (el: HTMLElement | null) => {
                      if (el) entryRefs.current[d][e] = el;
                    };
                    const enter = () => setActive([d, e]);
                    const leave = () =>
                      setActive((cur) => (cur && cur[0] === d && cur[1] === e ? null : cur));

                    const itemStyle: React.CSSProperties = {
                      fontFamily: "var(--font-jetbrains-mono)",
                      fontSize: "clamp(0.68rem, 0.85vw, 0.8rem)",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: isActive ? "var(--color-blood)" : "var(--color-bone)",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      transform: isActive ? "translateX(3px)" : "translateX(0)",
                      transition: "color 0.18s ease, transform 0.18s ease",
                      willChange: "transform",
                      display: "inline-block",
                    };

                    return (
                      <li key={entry.label}>
                        {entry.proofHref ? (
                          <Link
                            href={entry.proofHref}
                            ref={setRef}
                            aria-label={entry.proof ? `${entry.label} — ${entry.proof}` : entry.label}
                            onMouseEnter={enter}
                            onMouseLeave={leave}
                            onFocus={enter}
                            onBlur={leave}
                            style={itemStyle}
                          >
                            {entry.label}
                          </Link>
                        ) : (
                          <span
                            ref={setRef}
                            onMouseEnter={enter}
                            onMouseLeave={leave}
                            style={itemStyle}
                          >
                            {entry.label}
                            {/* Proof reaches the accessible tree even though the
                                animated hint line is aria-hidden. */}
                            {entry.proof && (
                              <span className="sr-only"> — {entry.proof}</span>
                            )}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {/* Proof hint — swaps to the hovered entry's proof */}
                <div
                  aria-hidden="true"
                  style={{
                    marginTop: "clamp(0.9rem, 2vw, 1.4rem)",
                    minHeight: "1.1em",
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "0.62rem",
                    letterSpacing: "0.04em",
                    color: activeEntry?.proof
                      ? "rgba(242,239,232,0.78)"
                      : "rgba(107,107,107,0.7)",
                    transition: "color 0.18s ease",
                  }}
                >
                  {hint}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom rule */}
      <div
        aria-hidden="true"
        style={{ height: "1px", backgroundColor: "rgba(107,107,107,0.2)" }}
      />

      {/* Footer row */}
      <div
        aria-hidden="true"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "clamp(1.25rem, 2.5vw, 2rem)",
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.6rem",
          color: "rgba(107,107,107,0.5)",
          letterSpacing: "0.08em",
        }}
      >
        <span>{"// INDEX 03"}</span>
        <span>{"// ENV prod.nullsec"}</span>
      </div>
    </section>
  );
}
