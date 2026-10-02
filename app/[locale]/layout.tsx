import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { profile } from "@/profile";
import { fontVariables } from "../fonts";
import { LOCALES, isLocale, type Locale } from "@/lib/locale";
import { LocaleProvider } from "@/lib/i18n";
import { ogBase } from "@/lib/seo";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScanHUD } from "@/components/ScanHUD";
import { CustomCursor } from "@/components/CustomCursor";
import { AudioBootstrap } from "@/components/AudioBootstrap";
import { EasterEgg } from "@/components/EasterEgg";
import { LanguageToggle } from "@/components/LanguageToggle";
import { SkipLink } from "@/components/SkipLink";
import { SiteFooter } from "@/components/SiteFooter";
import { AudioControl } from "@/components/AudioControl";
import { PageTransition } from "@/components/PageTransition";
import { curtainLabels } from "@/lib/curtain-labels";
import { Analytics } from "@vercel/analytics/next";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

// Only /en and /fr exist. Without this, any first segment (/wp-login.php,
// /.env, a typo) was treated as a locale to render on demand: a function call
// per junk URL, answered with a blank error shell that needed JavaScript to
// show the 404. Now the router answers with the static 404 page directly.
export const dynamicParams = false;

// The name comes first: it is what a recruiter types, and the only part of a
// long title Google is sure to show. Inner pages read "<page> · Jordan Turnaco"
// through the template; `absolute` keeps the root template off the home title,
// which used to end in "· NULLSEC" twice.
const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: `${profile.fullName} · Cybersecurity, DevSecOps & GRC · NULLSEC`,
    description: `ISMS apprentice at Arvato: EBIOS RM risk analyses, ISO 27001 alignment. A DevSecOps and GRC profile, available full-time from ${profile.available.en}.`,
  },
  fr: {
    title: `${profile.fullName} · Cybersécurité, DevSecOps & GRC · NULLSEC`,
    description: `Alternant SMSI chez Arvato : analyses de risques EBIOS RM, alignement ISO 27001. Un profil DevSecOps et GRC, disponible en CDI dès ${profile.available.fr}.`,
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
    title: { absolute: m.title, template: `%s · ${profile.fullName}` },
    description: m.description,
    alternates: {
      canonical: `${base}/${l}`,
      languages: { en: `${base}/en`, fr: `${base}/fr`, "x-default": `${base}/en` },
      types: { "application/rss+xml": "/feed.xml" },
    },
    // og:image comes from app/[locale]/opengraph-image; twitter:card follows
    // from it (summary_large_image) without being set here.
    openGraph: {
      ...ogBase(l),
      url: `${base}/${l}`,
      title: m.title,
      description: m.description,
    },
  };
}

/* ─── JSON-LD Person schema (rendered on every content page) ─── */
const current = profile.experience[0];
function personJsonLd(l: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    givenName: profile.name,
    // The title on the contract, from the same entry the Experience section shows.
    jobTitle: current.title[l],
    worksFor: { "@type": "Organization", name: current.company },
    knowsAbout: ["DevSecOps", "GRC", l === "fr" ? "SMSI" : "ISMS", "ISO 27001", "EBIOS RM", "CI/CD", "NIS2", "Zero Trust"],
    url: `${profile.siteUrl}/${l}`,
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
}

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)) }}
        />
      </head>
      <body>
        <LocaleProvider locale={locale}>
          <SkipLink />
          <SmoothScroll>
            <AudioBootstrap />
            <EasterEgg />
            <CustomCursor />
            <ScanHUD />
            <AudioControl />
            <LanguageToggle />
            {/* Inside SmoothScroll: it holds Lenis still while it runs. The
                labels are built here, on the server, so the client gets a
                title per page and none of the content behind it. */}
            <PageTransition labels={curtainLabels(locale)} />
            {children}
            <SiteFooter />
          </SmoothScroll>
        </LocaleProvider>
        {/* Vercel Web Analytics — cookieless, first-party (/_vercel/insights,
            same-origin, so the strict CSP needs no change). */}
        <Analytics />
      </body>
    </html>
  );
}
