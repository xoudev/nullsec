import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCALES, isLocale, localePath, type Locale } from "@/lib/locale";
import { documents, getDoc, docEyebrow } from "@/lib/documents";
import { docPath } from "@/lib/doc-routes";
import { ogBase } from "@/lib/seo";
import { profile } from "@/profile";
import { DocumentViewer } from "@/components/DocumentViewer";

/* ─── Static generation: one reader page per document and locale ─── */
export function generateStaticParams() {
  return LOCALES.flatMap((locale) => documents().map((d) => ({ locale, doc: d.slug })));
}
export const dynamicParams = false;

type Params = { params: Promise<{ locale: string; doc: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, doc: slug } = await params;
  const l: Locale = isLocale(locale) ? locale : "en";
  const doc = getDoc(slug);
  if (!doc) return {};
  const fr = l === "fr";
  const isCv = !doc.project;
  const title = isCv ? "CV" : doc.title[l];
  const description = isCv
    ? fr
      ? `Le CV de ${profile.fullName}, alternant SMSI chez Arvato, à lire en ligne ou à télécharger en PDF.`
      : `${profile.fullName}'s CV, ISMS apprentice at Arvato, to read online or download as a PDF.`
    : fr
      ? `${doc.title[l]} : le document du projet, ${doc.pages} pages, à lire en ligne ou à télécharger en PDF.`
      : `${doc.title[l]}: the project's document, ${doc.pages} pages, to read online or download as a PDF.`;
  const url = `${profile.siteUrl}${localePath(l, docPath(doc.slug))}`;
  return {
    title,
    description,
    // The PDF itself is what a search engine should list: this page is a
    // way to read it, not a second copy to rank.
    robots: { index: false, follow: true },
    alternates: { canonical: url },
    openGraph: { ...ogBase(l), url, title: `${title} · ${profile.fullName}`, description },
  };
}

export default async function DocPage({ params }: Params) {
  const { locale, doc: slug } = await params;
  if (!isLocale(locale)) notFound();
  const l: Locale = locale;
  const doc = getDoc(slug);
  if (!doc) notFound();
  const fr = l === "fr";
  const lp = (path: string) => localePath(l, path);
  const src = doc.src[l];
  const otherLanguage = doc.lang && doc.lang !== l;

  return (
    <main id="main-content" tabIndex={-1} className="doc-article">
      <nav aria-label={fr ? "Fil d'Ariane" : "Breadcrumb"} className="doc-crumbs">
        <Link href={lp("/")} className="hover-to-bone">
          ← NULLSEC
        </Link>
        <span aria-hidden="true">/</span>
        {doc.project ? (
          <>
            <Link href={lp("/work")} className="hover-to-bone">
              {fr ? "travaux" : "fieldwork"}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={lp(`/work/${doc.project.slug}`)} className="hover-to-bone">
              {doc.project.title[l].toLowerCase()}
            </Link>
          </>
        ) : (
          <span>cv</span>
        )}
      </nav>

      <header className="doc-head">
        <div className="doc-eyebrow">
          {docEyebrow(doc, l)}
          {otherLanguage ? (fr ? " · EN ANGLAIS" : " · IN FRENCH") : ""}
        </div>
        <h1 className="doc-title">{doc.title[l]}</h1>
        {/* The PDF itself, always one click away, JavaScript or not. */}
        <a href={src} target="_blank" rel="noopener" className="doc-raw">
          {fr ? "[ ouvrir le PDF ↗ ]" : "[ open the PDF ↗ ]"}
        </a>
      </header>

      <DocumentViewer src={src} title={doc.title[l]} />
    </main>
  );
}
