import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0A0A0B",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          fontSize: 15,
          fontWeight: 400,
          color: "#E63946",
          letterSpacing: "-1px",
        }}
      >
        //
      </div>
    ),
    { ...size },
  );
}
