import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const OG_SIZE = { width: 1200, height: 630 };

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
  const [interRegular, instrumentSerifItalic] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/Inter-Regular.ttf")),
    readFile(join(process.cwd(), "public/fonts/InstrumentSerif-Italic.ttf")),
  ]);

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
          <div style={{ fontFamily: '"Inter"', fontSize: 26, color: "#E63946", letterSpacing: "0.12em" }}>
            NULLSEC
          </div>
          <div style={{ fontFamily: '"Inter"', fontSize: 22, color: "#8A8A8A", letterSpacing: "0.08em" }}>
            {opts.eyebrow}
          </div>
        </div>

        {/* Centre — title */}
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
          <div style={{ height: 2, width: 220, backgroundColor: "#E63946" }} />
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontFamily: '"Inter"', fontSize: 22, color: "#8A8A8A", maxWidth: 820 }}>
            {opts.meta}
          </div>
          <div style={{ fontFamily: '"Inter"', fontSize: 22, color: "#E63946", letterSpacing: "0.06em" }}>
            nullsec.fr
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Inter", data: interRegular, style: "normal", weight: 400 },
        { name: "InstrumentSerif", data: instrumentSerifItalic, style: "italic", weight: 400 },
      ],
    },
  );
}
