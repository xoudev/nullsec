import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import { NotFoundBody } from "@/components/NotFoundBody";

export const metadata: Metadata = {
  title: "404 — Not found",
  description: "The page you requested does not exist.",
};

// Global 404 (unmatched paths / invalid locale). It renders OUTSIDE the
// [locale] segment — under the passthrough root layout — so it must supply its
// own <html>/<body>/fonts shell. NotFoundBody falls back to English via the
// default locale context (no provider here); a valid-locale 404 is instead
// handled by app/[locale]/not-found, which is localized.
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <NotFoundBody />
      </body>
    </html>
  );
}
