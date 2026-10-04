"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, loadScrollTrigger } from "@/lib/gsap";
import { softReveal } from "@/lib/softReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useT } from "@/lib/i18n";
import { section, sectionLabel } from "@/lib/sections";
import { clearances } from "@/content/clearances";
import type { ClearanceStatus } from "@/content/clearances";
import { ClearanceRadar } from "@/components/sections/ClearanceRadar";
import { spell } from "@/lib/spell";
import { docPath, docSlug } from "@/lib/doc-routes";

// The status tag, in the page's language: "[GRANTED]" on the French site was
// one of a dozen English labels left over from before the translation.
const STATUS_LABEL: Record<ClearanceStatus, { en: string; fr: string }> = {
  GRANTED: { en: "GRANTED", fr: "OBTENUE" },
  PENDING: { en: "PENDING", fr: "EN COURS" },
  EXPIRED: { en: "EXPIRED", fr: "EXPIRÉE" },
  REVOKED: { en: "REVOKED", fr: "RÉVOQUÉE" },
};

const HELD = clearances.filter((c) => c.status === "GRANTED").length;
const PENDING = clearances.filter((c) => c.status === "PENDING").length;

function statusColor(status: ClearanceStatus): string {
  switch (status) {
    case "GRANTED":          return "var(--color-bone)";
    case "PENDING":          return "var(--color-blood)";
    case "EXPIRED":
    case "REVOKED":          return "var(--color-ash)";
  }
}

export function SectionClearance() {
  const sectionRef    = useRef<HTMLElement>(null);
  const entryRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const ruleRefs      = useRef<(HTMLSpanElement | null)[]>([]);
  const radarColRef   = useRef<HTMLDivElement>(null);

  // The radar column sticks centred in the window, unless that would put its
  // top under the HUD: its measured half height sets the floor of its sticky
  // top (.clearance-radar-col in globals.css).
  useEffect(() => {
    const col = radarColRef.current;
    if (!col || !("ResizeObserver" in window)) return;
    const ro = new ResizeObserver(() => {
      col.style.setProperty("--radar-half", `${Math.round(col.offsetHeight / 2)}px`);
    });
    ro.observe(col);
    return () => ro.disconnect();
  }, []);
  const prefersReduced = useReducedMotion();
  const { t, tr, lp } = useT();

  // ── Radar active cert (null = show aggregate) ───────────────────
  const [activeCertIndex, setActiveCertIndex] = useState<number | null>(null);

  // ── Mobile IntersectionObserver: most-visible entry drives radar ─
  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const entries = entryRefs.current.filter(Boolean) as HTMLDivElement[];
    const ratioMap = new Map<Element, number>();

    const observer = new IntersectionObserver(
      (ioEntries) => {
        ioEntries.forEach(e => ratioMap.set(e.target, e.intersectionRatio));
        let max = 0;
        let maxIdx = -1;
        entries.forEach((el, i) => {
          const r = ratioMap.get(el) ?? 0;
          if (r > max) { max = r; maxIdx = i; }
        });
        if (maxIdx >= 0) setActiveCertIndex(maxIdx);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1.0] },
    );

    entries.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── GSAP: initial states + scroll reveal ────────────────────────
  useEffect(() => {

    if (prefersReduced) {
      // Soft opacity fade-in for the clearance entries — no horizontal slide.
      const entries = entryRefs.current.filter(Boolean) as HTMLElement[];
      return softReveal(entries);
    }

    entryRefs.current.forEach((el) => {
      if (el) gsap.set(el, { x: -40, opacity: 0 });
    });
    ruleRefs.current.forEach((el) => {
      if (el) gsap.set(el, { scaleX: 0 });
    });

    let isMounted = true;
    let ctx: ReturnType<typeof gsap.context> | undefined;

    loadScrollTrigger().then((ScrollTrigger) => {
      if (!isMounted) return;

      ctx = gsap.context(() => {
        const entries = entryRefs.current.filter(Boolean) as HTMLElement[];
        if (entries.length) {
          gsap.to(entries, {
            x: 0, opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              toggleActions: "play none none none",
            },
          });
        }

        ruleRefs.current.forEach((rule, i) => {
          if (!rule) return;
          gsap.to(rule, {
            scaleX: 1,
            duration: 0.8,
            ease: "power3.out",
            delay: i * 0.15 + 0.2,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              toggleActions: "play none none none",
            },
          });
        });
      });
    });

    return () => { isMounted = false; ctx?.revert(); };
  }, [prefersReduced]);

  // ── Hover: the radar follows the plate under the pointer (desktop) ──
  const handleEnter = (i: number) => {
    if (window.innerWidth < 768) return;
    setActiveCertIndex(i);
  };

  const handleLeave = () => {
    if (window.innerWidth < 768) return;
    setActiveCertIndex(null);
  };

  return (
    <section
      id="clearance"
      ref={sectionRef}
      data-section-id={section("clearance").id}
      aria-label={tr("Clearance: certifications", "Habilitations : certifications")}
      style={{
        backgroundColor: "var(--color-void)",
        padding: "clamp(5rem, 9vw, 8rem) clamp(1.5rem, 4vw, 3rem)",
        position: "relative",
      }}
    >
      {/* The grid: title and entries left, radar right (areas in globals.css). */}
      <div className="clearance-grid">
        {/* Section header: the grid's left column, over the entries, so the
              radar beside it starts level with the title (and clear of the HUD:
              .clearance-radar-col in globals.css). */}
        <div className="clearance-head" style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
          <div
            aria-hidden="true"
            style={{
              fontFamily:    "var(--font-jetbrains-mono)",
              fontSize:      "0.75rem",
              color:         "var(--color-blood)",
              letterSpacing: "0.1em",
              marginBottom:  "1.25rem",
            }}
          >
            {tr(sectionLabel("clearance", "en"), sectionLabel("clearance", "fr"))}
          </div>
          {/* Says what the section holds, counted from the data, rather than
              one more slogan: every section used to open on one. */}
          <h2
            style={{
              fontFamily:    "var(--font-instrument-serif)",
              fontStyle:     "italic",
              fontSize:      "clamp(2rem, 5vw, 4rem)",
              fontWeight:    400,
              lineHeight:    1.05,
              color:         "var(--color-bone)",
              letterSpacing: "-0.02em",
              margin:        0,
            }}
          >
            {tr(
              `${spell(HELD, "en", { capital: true })} certification${HELD > 1 ? "s" : ""} held,`,
              `${spell(HELD, "fr", { feminine: true, capital: true })} certification${HELD > 1 ? "s" : ""} obtenue${HELD > 1 ? "s" : ""},`,
            )}
            <br />
            {tr(
              `${spell(PENDING, "en")} in preparation.`,
              `${spell(PENDING, "fr", { feminine: true })} en préparation.`,
            )}
          </h2>
        </div>


        {/* ── Left: cert entries ── */}
        <div
          className="clearance-entries-col"
          style={{
            display:       "flex",
            flexDirection: "column",
            gap:           "clamp(1.75rem, 3.5vw, 2.75rem)",
          }}
        >
          {clearances.map((item, i) => {
            const isPending  = item.status === "PENDING";
            const isInactive = item.status === "EXPIRED" || item.status === "REVOKED";

            return (
              <div
                key={i}
                ref={(el) => { entryRefs.current[i] = el; }}
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={handleLeave}
                className={isPending ? "clearance-pending" : undefined}
                style={{
                  // Pending rows rest on the dim end of the pulse; the bright
                  // end is a ::before layer whose opacity the compositor
                  // animates (see .clearance-pending in globals.css).
                  borderLeft:  isPending
                    ? "2px solid rgba(255,107,26,0.25)"
                    : "2px solid rgba(107,107,107,0.22)",
                  paddingLeft: "clamp(1rem, 2vw, 1.5rem)",
                }}
              >
                {/* Status / date / rule / level row — real data (status, score,
                    date, level), so it must reach assistive technology. */}
                <div
                  style={{
                    display:       "flex",
                    alignItems:    "center",
                    gap:           "0.75rem",
                    marginBottom:  "0.55rem",
                    fontFamily:    "var(--font-jetbrains-mono)",
                    fontSize:      "0.75rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  <span style={{ color: statusColor(item.status), flexShrink: 0 }}>
                    [{tr(STATUS_LABEL[item.status].en, STATUS_LABEL[item.status].fr)}]
                  </span>
                  {item.score && (
                    <span style={{ color: "var(--color-blood)", flexShrink: 0 }}>
                      {tr(item.score, item.score.replace("%", "\u202F%"))}
                    </span>
                  )}
                  <span style={{ color: "var(--color-ash)", flexShrink: 0 }}>
                    {item.date}
                  </span>

                  {/* Animated horizontal rule */}
                  <span
                    ref={(el) => { ruleRefs.current[i] = el; }}
                    aria-hidden="true"
                    style={{
                      flex:            1,
                      display:         "block",
                      height:          "1px",
                      backgroundColor: "rgba(107,107,107,0.25)",
                      transformOrigin: "left center",
                    }}
                  />

                  <span style={{ color: "var(--color-ash)", flexShrink: 0 }}>
                    {tr("LEVEL", "NIVEAU")} {item.level}
                  </span>
                </div>

                {/* Title */}
                <div
                  style={{
                    fontFamily:     "var(--font-jetbrains-mono)",
                    fontSize:       "clamp(0.85rem, 1.6vw, 1.1rem)",
                    color:          isInactive ? "var(--color-ash)" : "var(--color-bone)",
                    letterSpacing:  "0.04em",
                    textDecoration: isInactive ? "line-through" : "none",
                    marginBottom:   "0.3rem",
                  }}
                >
                  {t(item.title)}
                </div>

                {/* Issuer + credential ID */}
                <div
                  style={{
                    fontFamily:    "var(--font-jetbrains-mono)",
                    fontSize:      "0.75rem",
                    color:         "var(--color-ash)",
                    letterSpacing: "0.04em",
                    marginBottom:  "0.2rem",
                  }}
                >
                  {item.issuer}
                  {item.credentialId && (
                    <>
                      {tr(" · Credential ID: ", " · Identifiant de la certification : ")}
                      {item.credentialUrl ? (
                        <a
                          href={item.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "var(--color-blood)", textDecoration: "underline" }}
                        >
                          {item.credentialId}
                        </a>
                      ) : (
                        item.credentialId
                      )}
                    </>
                  )}
                </div>

                {/* What it validates, in view at all times: it used to open on
                    hover only, so on a desktop the plates said nothing. */}
                <div className="clearance-validates">
                  {/* The visible copy is collapsed and animated, so it is hidden
                      from assistive tech and the text is exposed here instead.
                      This used to be an aria-label on the wrapper, which is
                      prohibited on a div with no role: screen readers dropped it
                      and the content reached nobody. */}
                  <span className="sr-only">
                    {tr(`Validates: ${t(item.validates)}`, `Valide : ${t(item.validates)}`)}
                  </span>
                  <div
                    aria-hidden="true"
                    style={{
                      fontFamily:    "var(--font-jetbrains-mono)",
                      fontSize:      "0.75rem",
                      color:         "var(--color-ash)",
                      letterSpacing: "0.04em",
                      paddingTop:    "0.3rem",
                    }}
                  >
                    {tr(`// validates: ${t(item.validates)}`, `// valide : ${t(item.validates)}`)}
                  </div>
                </div>

                {/* The certificate itself, when there is one: its first page
                    printed in the palette, like a case file's document
                    (.dossier-sheet), and the way to read it in the site's
                    reader. A claim with its evidence beside it. */}
                {item.document && (
                  <Link
                    href={lp(docPath(docSlug(item.document.href)))}
                    className="clearance-exhibit"
                    data-cursor-lock=""
                  >
                    <span className="clearance-sheet" aria-hidden="true">
                      <Image
                        src={item.document.cover}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 11rem, 8rem"
                        style={{ objectFit: "cover" }}
                      />
                    </span>
                    <span className="clearance-exhibit-text">
                      <span className="clearance-exhibit-label" aria-hidden="true">
                        {tr("// EXHIBIT", "// PIÈCE")}
                      </span>
                      <span>
                        {tr(
                          `Certificate · PDF · ${item.document.pages} page${item.document.pages > 1 ? "s" : ""}`,
                          `Certificat · PDF · ${item.document.pages} page${item.document.pages > 1 ? "s" : ""}`,
                        )}
                        {item.expires ? tr(` · valid to ${item.expires}`, ` · valable jusqu'en ${item.expires}`) : ""}
                      </span>
                      <span className="clearance-exhibit-link">
                        {tr("[ read the certificate → ]", "[ lire le certificat → ]")}
                      </span>
                    </span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Right: sticky radar ── */}
        <div className="clearance-radar-col" ref={radarColRef}>
          <ClearanceRadar
            clearances={clearances}
            activeCertIndex={activeCertIndex}
            prefersReduced={prefersReduced}
          />
        </div>

      </div>
    </section>
  );
}
