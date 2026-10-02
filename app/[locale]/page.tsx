"use client";

import dynamic from "next/dynamic";
import { GSAPInit } from "@/components/GSAPInit";
import { SectionShortcuts } from "@/components/SectionShortcuts";
import { BootTicker } from "@/components/BootTicker";
import { OffscreenPause } from "@/components/OffscreenPause";
import { SectionCounter } from "@/components/SectionCounter";
import { SectionIdentity } from "@/components/sections/SectionIdentity";
import { KeyFigures } from "@/components/sections/KeyFigures";
import { SectionExperience } from "@/components/sections/SectionExperience";

// Below-the-fold sections load as split chunks (SSR still prerenders their
// HTML), so the critical bundle stops paying for the whole page up front.
const SectionFieldwork = dynamic(() => import("@/components/sections/SectionFieldwork").then((m) => m.SectionFieldwork));
const SectionToolkit = dynamic(() => import("@/components/sections/SectionToolkit").then((m) => m.SectionToolkit));
const SectionClearance = dynamic(() => import("@/components/sections/SectionClearance").then((m) => m.SectionClearance));
const SectionAbout = dynamic(() => import("@/components/sections/SectionAbout").then((m) => m.SectionAbout));
const SectionDispatches = dynamic(() => import("@/components/sections/SectionDispatches").then((m) => m.SectionDispatches));
const SectionOffDuty = dynamic(() => import("@/components/sections/SectionOffDuty").then((m) => m.SectionOffDuty));
const SectionHandshake = dynamic(() => import("@/components/sections/SectionHandshake").then((m) => m.SectionHandshake));

// No boot gate. The hero is painted straight from the HTML; the boot
// sequence survives as a one-line ticker that runs over it (BootTicker). The
// old full-screen preloader held the page for 5 to 6.6 s on a first visit,
// when the HTML itself was ready in 0.2 s.
export default function Home() {
  return (
    <>
      <GSAPInit />
      <SectionShortcuts />
      <BootTicker />
      <OffscreenPause />
      <SectionCounter />
      <main id="main-content" tabIndex={-1}>
        <SectionIdentity />
        <KeyFigures />
        {/* Experience first: it is what a recruiter came for, and it used to
            start on the tenth screen of a phone, behind 44 skills. The order
            here and lib/sections.ts must match; every number follows. */}
        <SectionExperience />
        <SectionFieldwork />
        <SectionToolkit />
        <SectionClearance />
        <SectionAbout />
        <SectionDispatches />
        <SectionOffDuty />
        <SectionHandshake />
      </main>
    </>
  );
}
