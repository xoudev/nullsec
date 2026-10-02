import { LOCALES, isLocale } from "@/lib/locale";
import { homeCard } from "@/lib/og";

// Without this file the locale homes had no og:image at all: the layout's
// `openGraph` block replaced the root one, image included. The root card is
// English; this one speaks the page's language. `alt` is a static export and
// cannot follow the locale, so it stays a name both languages share.
export const alt = "NULLSEC · Jordan Turnaco";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

// Cards exist for the generated paths only: an unknown one is a 404, not a
// freshly rendered image per request.
export const dynamicParams = false;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return homeCard(isLocale(locale) ? locale : "en");
}
