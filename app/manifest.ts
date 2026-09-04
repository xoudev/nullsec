import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NULLSEC — Jordan Turnaco",
    short_name: "NULLSEC",
    description:
      "Cybersecurity portfolio — GRC, blue team detection, and zero trust.",
    start_url: "/",
    display: "browser",
    background_color: "#0F0F12",
    theme_color: "#0F0F12",
    // The SVG scales to any tab or shortcut size; the two PNGs are what
    // Android actually installs to the home screen, and "maskable" lets the
    // launcher crop them into its own shape without eating into the mark
    // (the "//" sits inside a 4-unit inset on all sides for exactly that).
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icon-192.png", type: "image/png", sizes: "192x192", purpose: "any" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512", purpose: "any" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
    ],
  };
}
