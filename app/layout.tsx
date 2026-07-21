import type { Metadata, Viewport } from "next";
import "./globals.css";
import { profile } from "@/profile";

/**
 * Passthrough root layout. The real document shell (<html lang> · <body> ·
 * fonts · site chrome) lives in app/[locale]/layout so each language gets the
 * correct `lang` at SSR — a root layout can't read the [locale] param. The
 * global 404 (app/not-found) renders its own shell for the same reason.
 *
 * Global-default metadata still belongs here: it applies to every route and is
 * merged with (and overridden by) each segment's own generateMetadata.
 */
export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `NULLSEC — ${profile.fullName} · Cybersecurity portfolio`,
    template: "%s · NULLSEC",
  },
  description: `Cybersecurity portfolio by ${profile.fullName} — Assistant LISO in GRC, blue-team detection, and zero trust.`,
  keywords: ["cybersecurity", "GRC", "blue team", "zero trust", "portfolio", "security engineer", "ISO 27001", "EBIOS RM", "cybersécurité", "alternance"],
  authors: [{ name: profile.fullName, url: profile.siteUrl }],
  creator: profile.fullName,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#0F0F12",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
