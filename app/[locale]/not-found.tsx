import type { Metadata } from "next";
import { NotFoundBody } from "@/components/NotFoundBody";

export const metadata: Metadata = {
  // `absolute`: the layout template would otherwise append the owner's name.
  title: { absolute: "404 · NULLSEC" },
  description: "The page you requested does not exist. La page demandée n'existe pas.",
};

// Rendered inside app/[locale]/layout (LocaleProvider present) for notFound()
// raised on a valid-locale route — e.g. an unknown /en/work/<slug>. The body
// reads the active locale from context, so this 404 is properly localized.
export default function LocaleNotFound() {
  return <NotFoundBody />;
}
