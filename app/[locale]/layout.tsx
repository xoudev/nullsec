import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { profile } from "@/profile";
import { fontVariables } from "../fonts";
import { LOCALES, isLocale, type Locale } from "@/lib/locale";
import { LocaleProvider } from "@/lib/i18n";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScanHUD } from "@/components/ScanHUD";
import { CustomCursor } from "@/components/CustomCursor";
import { AudioBootstrap } from "@/components/AudioBootstrap";
import { LanguageToggle } from "@/components/LanguageToggle";
import { SkipLink } from "@/components/SkipLink";
import { SiteFooter } from "@/components/SiteFooter";
import { AudioControl } from "@/components/AudioControl";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const META: Record<Locale, { title: string; description: string; ogLocale: string }> = {
  en: {
    title: `NULLSEC — ${profile.fullName} · Cybersecurity portfolio`,
    description: `Cybersecurity portfolio by ${profile.fullName} — Assistant LISO in GRC, blue-team detection, and zero trust. ${profile.tagline.en}`,
    ogLocale: "en_US",
  },
  fr: {
    title: `NULLSEC — ${profile.fullName} · Portfolio cybersécurité`,
    description: `Portfolio cybersécurité de ${profile.fullName} — Assistant LISO en GRC, détection blue team et zero trust. ${profile.tagline.fr}`,
    ogLocale: "fr_FR",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "en";
  const m = META[l];
  const base = profile.siteUrl;
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `${base}/${l}`,
      languages: { en: `${base}/en`, fr: `${base}/fr`, "x-default": `${base}/en` },
      types: { "application/rss+xml": "/feed.xml" },
    },
    openGraph: {
      type: "website",
      locale: m.ogLocale,
      url: `${base}/${l}`,
      siteName: "NULLSEC",
      title: m.title,
      description: m.description,
    },
  };
}

/* ─── JSON-LD Person schema (locale-agnostic; rendered on every content page) ─── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.fullName,
  givenName: profile.name,
  jobTitle: "Assistant LISO — GRC / Blue Team / Zero Trust",
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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={fontVariables}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <LocaleProvider locale={locale}>
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
