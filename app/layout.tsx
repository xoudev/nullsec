import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/profile";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScanHUD } from "@/components/ScanHUD";
import { CustomCursor } from "@/components/CustomCursor";

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
export const metadata: Metadata = {
  title: {
    default: "NULLSEC — Jordan",
    template: "%s · NULLSEC",
  },
  description: profile.tagline,
  metadataBase: new URL(profile.siteUrl),
  openGraph: {
    type: "website",
    locale: "en_FR",
    url: profile.siteUrl,
    siteName: "NULLSEC",
    title: "NULLSEC — Jordan",
    description: profile.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: "NULLSEC — Jordan",
    description: profile.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  authors: [{ name: profile.name }],
};

/* ─── JSON-LD Person schema ─── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Cybersecurity Apprentice — GRC / Blue Team / DevSecOps",
  url: profile.siteUrl,
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
        {/* Skip link — visible on :focus for keyboard users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SmoothScroll>
          <CustomCursor />
          <ScanHUD />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
