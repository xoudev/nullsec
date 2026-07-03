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
    icons: [{ src: "/icon.svg", type: "image/svg+xml", sizes: "any" }],
  };
}
