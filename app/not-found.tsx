import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import { NotFoundBody } from "@/components/NotFoundBody";

export const metadata: Metadata = {
  title: { absolute: "404 · NULLSEC" },
  description: "The page you requested does not exist. La page demandée n'existe pas.",
};

// Runs before first paint, so the reader never sees the wrong language flash.
// /fr/... and /en/... decide; a path with no locale follows the browser, like
// the bare-root redirect in app/page does with Accept-Language.
const PICK_LANG = `(function(){try{var p=location.pathname,fr=/^\\/fr(\\/|$)/.test(p)||(!/^\\/en(\\/|$)/.test(p)&&/^fr/i.test(navigator.language||""));if(fr)document.documentElement.lang="fr";}catch(e){}})();`;

// Global 404 (unmatched paths, /fr/<anything unknown> included, and invalid
// locales). It renders OUTSIDE the [locale] segment, under the passthrough
// root layout, so it supplies its own <html>/<body>/fonts shell and has no
// locale to read: both languages ship in the one static page and the script
// above picks. A valid-locale notFound() (an unknown /fr/work/<slug>) is
// handled by app/[locale]/not-found instead, inside the locale provider.
export default function GlobalNotFound() {
  return (
    // The script rewrites `lang` before hydration; React must not fight it.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PICK_LANG }} />
      </head>
      <body>
        <NotFoundBody bilingual />
      </body>
    </html>
  );
}
