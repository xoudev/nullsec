import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Locale } from "@/lib/locale";

const OG_SIZE = { width: 1200, height: 630 };

async function loadFonts() {
  const [interRegular, instrumentSerifItalic] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/Inter-Regular.ttf")),
    readFile(join(process.cwd(), "public/fonts/InstrumentSerif-Italic.ttf")),
  ]);
  return [
    { name: "Inter", data: interRegular, style: "normal" as const, weight: 400 as const },
    { name: "InstrumentSerif", data: instrumentSerifItalic, style: "italic" as const, weight: 400 as const },
  ];
}

const HOME_COPY: Record<Locale, { line: string; role: string; alt: string }> = {
  en: {
    line: "I map the blind spots.",
    role: "Cybersecurity · DevSecOps & GRC",
    alt: "Jordan Turnaco, cybersecurity portfolio: I map the blind spots.",
  },
  fr: {
    line: "Je cartographie les angles morts.",
    role: "Cybersécurité · DevSecOps & GRC",
    alt: "Jordan Turnaco, portfolio cybersécurité : je cartographie les angles morts.",
  },
};

export function homeCardAlt(l: Locale) {
  return HOME_COPY[l].alt;
}

/**
 * The homepage card: the hero's own line, then the owner's name, which is the
 * point of the card. The root route renders it in English (the bare domain and
 * the global 404 have no language); each locale's home renders its own.
 */
export async function homeCard(l: Locale) {
  const c = HOME_COPY[l];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0F0F12",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
        }}
      >
        {/* Top row: site brand + handle */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: '"Inter"', fontSize: 28, color: "#FF6B1A", letterSpacing: "0.12em" }}>
            NULLSEC
          </div>
          <div style={{ fontFamily: '"Inter"', fontSize: 24, color: "#8A8A8A", letterSpacing: "0.08em" }}>
            {"// xoudev"}
          </div>
        </div>

        {/* Centre: the hero line + rule */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", gap: 40 }}>
          <div
            style={{
              fontFamily: '"InstrumentSerif"',
              fontStyle: "italic",
              fontSize: c.line.length > 24 ? 84 : 96,
              lineHeight: 0.95,
              color: "#F2EFE8",
              letterSpacing: "-2px",
            }}
          >
            {c.line}
          </div>
          <div style={{ height: 1, width: "100%", backgroundColor: "rgba(138,138,138,0.3)" }} />
        </div>

        {/* Bottom row: the owner's name is the point of the card */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontFamily: '"Inter"', fontSize: 30, color: "#F2EFE8" }}>Jordan Turnaco</div>
            <div style={{ fontFamily: '"Inter"', fontSize: 22, color: "#8A8A8A" }}>{c.role}</div>
          </div>
          <div style={{ fontFamily: '"Inter"', fontSize: 24, color: "#FF6B1A", letterSpacing: "0.06em" }}>
            nullsec.fr
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() },
  );
}

/**
 * Shared NULLSEC social card. Used by the per-project and per-dispatch
 * opengraph-image routes so every share is branded and specific instead of
 * reusing the homepage card.
 */
export async function ogCard(opts: {
  eyebrow: string; // e.g. "// FIELDWORK · 003"
  title: string;
  meta: string; // e.g. tags or date + read time
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0F0F12",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
        }}
      >
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: '"Inter"', fontSize: 26, color: "#FF6B1A", letterSpacing: "0.12em" }}>
            NULLSEC
          </div>
          <div style={{ fontFamily: '"Inter"', fontSize: 22, color: "#8A8A8A", letterSpacing: "0.08em" }}>
            {opts.eyebrow}
          </div>
        </div>

        {/* Centre: title */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", gap: 32 }}>
          <div
            style={{
              fontFamily: '"InstrumentSerif"',
              fontStyle: "italic",
              fontSize: 84,
              lineHeight: 0.95,
              color: "#F2EFE8",
              letterSpacing: "-2px",
            }}
          >
            {opts.title}
          </div>
          <div style={{ height: 2, width: 220, backgroundColor: "#FF6B1A" }} />
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontFamily: '"Inter"', fontSize: 22, color: "#8A8A8A", maxWidth: 820 }}>
            {opts.meta}
          </div>
          <div style={{ fontFamily: '"Inter"', fontSize: 22, color: "#FF6B1A", letterSpacing: "0.06em" }}>
            nullsec.fr
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() },
  );
}
