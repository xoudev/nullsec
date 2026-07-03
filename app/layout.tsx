import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/profile";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScanHUD } from "@/components/ScanHUD";
import { CustomCursor } from "@/components/CustomCursor";
import { AudioBootstrap } from "@/components/AudioBootstrap";
import { LocaleProvider } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { SkipLink } from "@/components/SkipLink";
import { SiteFooter } from "@/components/SiteFooter";
import { AudioControl } from "@/components/AudioControl";

/* ─── Fonts ─── */
const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/* ─── Metadata ─── */
// SEO ships the EN copy (single-URL site, EN default); profile.tagline is a
// Localized object so the EN variant must be picked explicitly here.
const siteDescription = `Cybersecurity portfolio by ${profile.fullName} — apprentice security engineer in GRC, blue team detection, and zero trust. ${profile.tagline.en}`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `NULLSEC — ${profile.fullName} · Cybersecurity portfolio`,
    template: "%s · NULLSEC",
  },
  description: siteDescription,
  keywords: ["cybersecurity", "GRC", "blue team", "zero trust", "portfolio", "security engineer", "ISO 27001", "EBIOS RM", "cybersécurité", "alternance"],
  authors: [{ name: profile.fullName, url: profile.siteUrl }],
  creator: profile.fullName,
  // Self-referencing canonical on every route (resolved against metadataBase).
  alternates: {
    canonical: "./",
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    type:     "website",
    locale:   "en_US",
    url:      profile.siteUrl,
    siteName: "NULLSEC",
    title:    `NULLSEC — ${profile.fullName} · Cybersecurity portfolio`,
    description: siteDescription,
  },
  // Card type only — title/description/image fall back to the og:* tags, so
  // detail pages keep their own titles instead of inheriting the homepage's.
  twitter: { card: "summary_large_image" },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:              true,
      follow:             true,
      "max-image-preview": "large",
      "max-snippet":      -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0F0F12",
  colorScheme: "dark",
};

/* ─── JSON-LD Person schema ─── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.fullName,
  givenName: profile.name,
  jobTitle: "Cybersecurity Apprentice — GRC / Blue Team / DevSecOps",
  url: profile.siteUrl,
  email: `mailto:${profile.email}`,
  sameAs: [profile.github, profile.linkedin],
  alumniOf: [...new Set(profile.education.map((e) => e.school))].map((name) => ({
    "@type": "EducationalOrganization",
    name,
  })),
  address: {
    "@type": "PostalAddress",
    addressLocality: profile.city,
    addressCountry: profile.country,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <LocaleProvider>
          {/* Skip link — visible on :focus for keyboard users */}
          <SkipLink />
          <SmoothScroll>
            <AudioBootstrap />
            <CustomCursor />
            <ScanHUD />
            <AudioControl />
            <LanguageToggle />
            {children}
            <SiteFooter />
          </SmoothScroll>
        </LocaleProvider>
      </body>
    </html>
  );
}
