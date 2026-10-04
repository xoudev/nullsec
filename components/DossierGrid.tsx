import Image from "next/image";
import Link from "next/link";
import { getT } from "@/lib/i18n-static";
import type { Locale } from "@/lib/locale";
import { orderedWork, type WorkItem } from "@/content/work";
import { parseYouTube, youtubeThumbnail } from "@/lib/youtube";

/**
 * The projects as case files: one card per project, and on it the evidence
 * the file holds. Shared by the homepage section (SectionFieldwork) and the
 * /work index, so the two never disagree. A server component: every effect
 * is CSS (.dossier* in globals.css), the entrance is data-reveal
 * (components/Reveal.tsx).
 *
 * The picture says what kind of proof is inside: the project's own mark, a
 * frame of its video, the first page of its document tucked in the file.
 * Third-party artwork and photos are printed in the palette (bone at rest,
 * blood once scanned); a project with nothing to show gets its number and
 * its markers, never a made-up screenshot.
 *
 * On a wide screen, a grid in rows of two, two, three and two. On a phone,
 * the homepage gets a row to swipe, which keeps the nine projects to one
 * screen; the index page, which is the list, stacks them (`stack`).
 */

type Visual = { kind: "mark" | "print" | "poster"; src: string } | { kind: "type" };

function visualOf(item: WorkItem): Visual {
  if (item.image) return { kind: item.ownMark ? "mark" : "print", src: item.image };
  const v = item.video;
  if (v) {
    const poster = "youtube" in v ? (v.poster ?? youtubeThumbnail(parseYouTube(v.youtube))) : v.poster;
    return { kind: "poster", src: poster };
  }
  return { kind: "type" };
}

type Exhibit = { label: string; live?: boolean };

/** What the file holds besides its case study. */
function exhibits(item: WorkItem, tr: (en: string, fr: string) => string): Exhibit[] {
  return [
    ...(item.documents ?? []).map((d) => ({ label: `PDF · ${d.pages} pages` })),
    ...(item.video ? [{ label: tr("Video demo", "Démo vidéo") }] : []),
    ...(item.repoUrl ? [{ label: tr("Source code", "Code source") }] : []),
    ...(item.liveUrl ? [{ label: tr("Live", "En ligne"), live: true }] : []),
  ];
}

// The wide grid's rows, in twelfths: two large cards, two large, three, two.
const ROWS = [[7, 5], [5, 7], [4, 4, 4], [6, 6]];

/** Each card's width in the wide grid, its place in its row (the entrance
 *  staggers along it) and whether it sits in the first two rows, which get a
 *  taller picture. A last row left short shares the full width. */
function cells(n: number) {
  const out: { span: number; col: number; lead: boolean }[] = [];
  for (let r = 0; out.length < n; r++) {
    const row = ROWS[r % ROWS.length];
    const k = Math.min(row.length, n - out.length);
    (k === row.length ? row : Array<number>(k).fill(12 / k)).forEach((span, col) =>
      out.push({ span, col, lead: r < 2 }),
    );
  }
  return out;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** How many files, and how many exhibits in them: the section's count. */
export function dossierCount(l: Locale): string {
  const { tr } = getT(l);
  const pieces = orderedWork.reduce((n, w) => n + exhibits(w, tr).length, 0);
  return `${pad(orderedWork.length)} ${tr("FILES", "DOSSIERS")} · ${pad(pieces)} ${tr("EXHIBITS", "PIÈCES JOINTES")}`;
}

export function DossierGrid({ l, stack = false }: { l: Locale; stack?: boolean }) {
  const { t, tr, lp } = getT(l);
  const layout = cells(orderedWork.length);
  const count = `${pad(orderedWork.length)} ${tr("FILES", "DOSSIERS")}`;

  return (
    <nav aria-label={tr("Selected projects", "Projets sélectionnés")} className="dossiers-nav" data-layout={stack ? "stack" : undefined}>
      <ul className="dossiers">
        {orderedWork.map((item, i) => {
          const { span, col, lead } = layout[i];
          const visual = visualOf(item);
          const sheet = item.documents?.find((d) => d.cover)?.cover;
          const ex = exhibits(item, tr);
          return (
            <li
              key={item.slug}
              className="dossier"
              data-reveal=""
              data-lead={lead ? "" : undefined}
              data-sheet={sheet ? "" : undefined}
              style={{
                "--span": span,
                "--reveal-y": "40px",
                "--reveal-duration": "0.75s",
                "--reveal-delay": `${col * 0.1}s`,
              } as React.CSSProperties}
            >
              {/* One link, the whole card: the reticle locks around it
                  whatever its height (components/CustomCursor). */}
              <Link href={lp(`/work/${item.slug}`)} className="dossier-link" data-cursor-lock="">
                <span className="dossier-strip" aria-hidden="true">
                  <span className="dossier-no">{`${tr("FILE", "DOSSIER")} ${item.index}`}</span>
                  {item.tier === "side" && <span className="dossier-annex">{tr("SIDE PROJECT", "ANNEXE")}</span>}
                  <span className="dossier-year">{`[${item.year}]`}</span>
                </span>

                <span className="dossier-visual" data-kind={visual.kind} aria-hidden="true">
                  {visual.kind === "type" ? (
                    <span className="dossier-type">
                      <span className="dossier-readout">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span key={tag}>{`› ${tag}`}</span>
                        ))}
                      </span>
                      {/* Generated content (.cover-ghost), like the case
                          study's cover: it is decoration, not text. */}
                      <span className="dossier-ghost cover-ghost" data-numeral={item.index} />
                    </span>
                  ) : (
                    <span className="dossier-media">
                      <Image
                        src={visual.src}
                        alt=""
                        fill
                        sizes={`(min-width: 1024px) ${Math.round((span / 12) * 100)}vw, (min-width: 768px) 50vw, ${stack ? "100vw" : "80vw"}`}
                        style={{ objectFit: visual.kind === "poster" ? "cover" : "contain" }}
                      />
                    </span>
                  )}
                  {sheet && (
                    <span className="dossier-sheet">
                      <Image
                        src={sheet}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 15vw, 35vw"
                        style={{ objectFit: "cover", objectPosition: "top" }}
                      />
                    </span>
                  )}
                  {visual.kind === "poster" && <span className="dossier-play">{`▶ ${tr("DEMO", "DÉMO")}`}</span>}
                  <span className="dossier-veil" />
                  <span className="dossier-sweep" />
                  <span className="dossier-corners">
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="dossier-shutter" />
                </span>

                <span className="dossier-body">
                  <span className="dossier-title">{t(item.title)}</span>
                  {/* The short summary (meta.description, at most ~155
                      characters): a card is for scanning, the case study
                      keeps the long version. */}
                  <span className="dossier-summary">
                    {t(item.meta.description)}
                    <span className="sr-only">{`, ${item.year}`}</span>
                  </span>
                  {/* The markers, unless the picture already lists them. */}
                  {visual.kind !== "type" && (
                    <span className="dossier-tags" aria-hidden="true">
                      {item.tags.slice(0, 3).join("  ·  ")}
                    </span>
                  )}
                </span>

                <span className="dossier-foot">
                  {ex.length > 0 && (
                    <span className="dossier-exhibits">
                      <span className="sr-only">{tr("Exhibits: ", "Pièces : ")}</span>
                      {ex.map((e) => (
                        <span key={e.label} className="dossier-chip" data-live={e.live ? "" : undefined}>
                          {e.label}
                        </span>
                      ))}
                    </span>
                  )}
                  <span className="dossier-open" aria-hidden="true">
                    {tr("OPEN FILE", "OUVRIR LE DOSSIER")}
                    <span className="dossier-arrow">→</span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* On a phone, the swiped row: how many, how far along, which way. */}
      {!stack && (
        <div className="dossiers-rail" aria-hidden="true">
          <span>{count}</span>
          <span className="dossiers-progress" />
          <span className="dossiers-hint">
            {tr("swipe", "glisser")}
            <span className="dossiers-hint-arrow">→</span>
          </span>
        </div>
      )}
    </nav>
  );
}
