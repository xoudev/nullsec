"use client";

import { useT } from "@/lib/i18n";

/** Localized skip link — visible on :focus for keyboard users. */
export function SkipLink() {
  const { tr } = useT();
  return (
    <a href="#main-content" className="skip-link">
      {tr("Skip to main content", "Aller au contenu principal")}
    </a>
  );
}
