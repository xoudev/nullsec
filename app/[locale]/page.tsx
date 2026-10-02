import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/locale";
import { GSAPInit } from "@/components/GSAPInit";
import { SectionShortcuts } from "@/components/SectionShortcuts";
import { BootTicker } from "@/components/BootTicker";
import { OffscreenPause } from "@/components/OffscreenPause";
import { SectionCounter } from "@/components/SectionCounter";
import { Reveal } from "@/components/Reveal";
import { SectionIdentity } from "@/components/sections/SectionIdentity";
import { KeyFigures } from "@/components/sections/KeyFigures";
import { SectionExperience } from "@/components/sections/SectionExperience";
import { SectionFieldwork } from "@/components/sections/SectionFieldwork";
import { SectionToolkit, type ToolkitEvidence } from "@/components/sections/SectionToolkit";
import { SectionClearance } from "@/components/sections/SectionClearance";
import { SectionAbout } from "@/components/sections/SectionAbout";
import { SectionDispatches } from "@/components/sections/SectionDispatches";
import { SectionOffDuty } from "@/components/sections/SectionOffDuty";
import { SectionHandshake } from "@/components/sections/SectionHandshake";
import { toolkitDomains, domainEvidence } from "@/content/toolkit";
import { work } from "@/content/work";

// A server component. Seven of the nine sections are too: they only ever
// rendered markup, plus a scroll reveal now handled once by <Reveal />. Only
// what is genuinely interactive ships as client code: the toolkit (hover
// proofs), the clearance radar, the terminal, and the small islands below.
// The page used to be one client component, so the browser downloaded and
// ran every section, and the full text of every case study, to show it.
//
// No boot gate. The hero is painted straight from the HTML; the boot
// sequence survives as a one-line ticker that runs over it (BootTicker).
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l: Locale = locale;

  // Where each toolkit domain's proofs come from, resolved here so the client
  // toolkit receives titles, not the case studies they belong to.
  const evidence: ToolkitEvidence = toolkitDomains.map((d) => {
    const ev = domainEvidence(d);
    return {
      contexts: ev.contexts,
      works: ev.works.map((slug) => ({
        slug,
        title: work.find((w) => w.slug === slug)?.title ?? { en: slug, fr: slug },
      })),
    };
  });

  return (
    <>
      <GSAPInit />
      <SectionShortcuts />
      <BootTicker />
      <OffscreenPause />
      <SectionCounter />
      <Reveal />
      <main id="main-content" tabIndex={-1}>
        <SectionIdentity l={l} />
        <KeyFigures l={l} />
        {/* Experience first: it is what a recruiter came for, and it used to
            start on the tenth screen of a phone, behind 44 skills. The order
            here and lib/sections.ts must match; every number follows. */}
        <SectionExperience l={l} />
        <SectionFieldwork l={l} />
        <SectionToolkit evidence={evidence} />
        <SectionClearance />
        <SectionAbout l={l} />
        <SectionDispatches l={l} />
        <SectionOffDuty l={l} />
        <SectionHandshake />
      </main>
    </>
  );
}
