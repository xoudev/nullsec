import { homeCard, homeCardAlt } from "@/lib/og";

// The bare domain and the global 404 have no language: English card. Each
// locale's home has its own (app/[locale]/opengraph-image).
export const alt = homeCardAlt("en");
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return homeCard("en");
}
