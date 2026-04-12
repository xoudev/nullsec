import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "NULLSEC — Jordan — Securing what others overlook.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Load Inter (always committed). Instrument Serif italic TTF is optional —
  // download the .ttf from Google Fonts and place it at public/fonts/InstrumentSerif-Italic.ttf.
  // The OG card will use it automatically once the file exists.
  const [interRegular, interBold] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/Inter-Regular.ttf")),
    readFile(join(process.cwd(), "public/fonts/Inter-Bold.ttf")),
  ]);

  let instrumentSerifItalic: Buffer | null = null;
  try {
    instrumentSerifItalic = await readFile(
      join(process.cwd(), "public/fonts/InstrumentSerif-Italic.ttf")
    );
  } catch {
    // Font not committed yet — OG card falls back to Inter Bold.
  }

  type OgFont = {
    name: string;
    data: Buffer;
    style: "normal" | "italic";
    weight: 400 | 800;
  };

  const fonts: OgFont[] = [
    { name: "Inter", data: interRegular, style: "normal", weight: 400 },
    { name: "Inter", data: interBold, style: "normal", weight: 800 },
  ];
  if (instrumentSerifItalic) {
    fonts.push({
      name: "InstrumentSerif",
      data: instrumentSerifItalic,
      style: "italic",
      weight: 400,
    });
  }

  const displayFont = instrumentSerifItalic
    ? '"InstrumentSerif", Georgia, serif'
    : '"Inter", system-ui, sans-serif';

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0A0A0B",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: '"Inter", system-ui, sans-serif',
          overflow: "hidden",
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 64,
            bottom: 64,
            width: 4,
            backgroundColor: "#E63946",
          }}
        />

        {/* Faint background watermark */}
        <div
          style={{
            position: "absolute",
            right: -20,
            bottom: -60,
            fontSize: 280,
            fontWeight: 800,
            color: "rgba(242,239,232,0.025)",
            letterSpacing: "-10px",
            lineHeight: 1,
          }}
        >
          NULLSEC
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: 112,
            paddingTop: 120,
            gap: 32,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 400,
              color: "#6B6B6B",
              letterSpacing: "0.12em",
            }}
          >
            {"// CYBERSECURITY PORTFOLIO"}
          </div>

          <div
            style={{
              fontSize: instrumentSerifItalic ? 148 : 136,
              fontWeight: instrumentSerifItalic ? 400 : 800,
              fontStyle: instrumentSerifItalic ? "italic" : "normal",
              fontFamily: displayFont,
              color: "#F2EFE8",
              letterSpacing: instrumentSerifItalic ? "-4px" : "-6px",
              lineHeight: 1,
            }}
          >
            NULLSEC
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: 300,
              color: "rgba(242,239,232,0.5)",
              letterSpacing: "0.01em",
              maxWidth: 680,
            }}
          >
            Securing what others overlook.
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            position: "absolute",
            bottom: 64,
            left: 112,
            right: 64,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 400,
              color: "#6B6B6B",
              letterSpacing: "0.1em",
            }}
          >
            GRC · BLUE TEAM · DEVSECOPS
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 400,
              color: "#E63946",
              letterSpacing: "0.1em",
            }}
          >
            jordan.sys
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  );
}
