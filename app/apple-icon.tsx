import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS home-screen / pinned-tab icon — same "//" mark as icon.svg, on-token void.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0F0F12",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          fontSize: 84,
          color: "#E63946",
          letterSpacing: "-6px",
        }}
      >
        {"//"}
      </div>
    ),
    { ...size },
  );
}
