import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt  = "NULLSEC — Jordan Turnaco · Cybersecurity portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [interRegular, instrumentSerifItalic] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/Inter-Regular.ttf")),
    readFile(join(process.cwd(), "public/fonts/InstrumentSerif-Italic.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width:           "100%",
          height:          "100%",
          backgroundColor: "#0F0F12",
          display:         "flex",
          flexDirection:   "column",
          padding:         "80px",
        }}
      >
        {/* Top row — site brand + handle */}
        <div
          style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "baseline",
          }}
        >
          <div
            style={{
              fontFamily:    '"Inter"',
              fontSize:      28,
              color:         "#E63946",
              letterSpacing: "0.12em",
            }}
          >
            NULLSEC
          </div>
          <div
            style={{
              fontFamily:    '"Inter"',
              fontSize:      24,
              color:         "#8A8A8A",
              letterSpacing: "0.08em",
            }}
          >
            {"// xoudev"}
          </div>
        </div>

        {/* Centre — title + rule */}
        <div
          style={{
            display:        "flex",
            flexDirection:  "column",
            flex:           1,
            justifyContent: "center",
            gap:            40,
          }}
        >
          <div
            style={{
              fontFamily:    '"InstrumentSerif"',
              fontStyle:     "italic",
              fontSize:      96,
              lineHeight:    0.9,
              color:         "#F2EFE8",
              letterSpacing: "-2px",
            }}
          >
            I map the blind spots.
          </div>

          {/* Horizontal rule */}
          <div
            style={{
              height:          1,
              width:           "100%",
              backgroundColor: "rgba(138,138,138,0.3)",
            }}
          />
        </div>

        {/* Bottom row — the owner's name is the point of the card */}
        <div
          style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "flex-end",
          }}
        >
          <div
            style={{
              display:       "flex",
              flexDirection: "column",
              gap:           8,
            }}
          >
            <div
              style={{
                fontFamily: '"Inter"',
                fontSize:   30,
                color:      "#F2EFE8",
              }}
            >
              Jordan Turnaco
            </div>
            <div
              style={{
                fontFamily: '"Inter"',
                fontSize:   22,
                color:      "#8A8A8A",
              }}
            >
              Cybersecurity — GRC · Blue Team · DevSecOps
            </div>
          </div>

          <div
            style={{
              fontFamily:    '"Inter"',
              fontSize:      24,
              color:         "#E63946",
              letterSpacing: "0.06em",
            }}
          >
            nullsec.fr
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter",           data: interRegular,          style: "normal", weight: 400 },
        { name: "InstrumentSerif", data: instrumentSerifItalic, style: "italic", weight: 400 },
      ],
    },
  );
}
