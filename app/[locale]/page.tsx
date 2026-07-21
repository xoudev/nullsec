"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { GSAPInit } from "@/components/GSAPInit";
import { SectionShortcuts } from "@/components/SectionShortcuts";
import { Preloader } from "@/components/sections/Preloader";
import { SectionIdentity } from "@/components/sections/SectionIdentity";
import { SectionFieldwork } from "@/components/sections/SectionFieldwork";

// Below-the-fold sections load as split chunks (SSR still prerenders their
// HTML). The preloader gate hides any hydration gap, and the critical bundle
// stops paying for the whole page up front.
const SectionToolkit = dynamic(() => import("@/components/sections/SectionToolkit").then((m) => m.SectionToolkit));
const SectionClearance = dynamic(() => import("@/components/sections/SectionClearance").then((m) => m.SectionClearance));
const SectionAbout = dynamic(() => import("@/components/sections/SectionAbout").then((m) => m.SectionAbout));
const SectionExperience = dynamic(() => import("@/components/sections/SectionExperience").then((m) => m.SectionExperience));
const SectionDispatches = dynamic(() => import("@/components/sections/SectionDispatches").then((m) => m.SectionDispatches));
const SectionOffDuty = dynamic(() => import("@/components/sections/SectionOffDuty").then((m) => m.SectionOffDuty));
const SectionHandshake = dynamic(() => import("@/components/sections/SectionHandshake").then((m) => m.SectionHandshake));

// Key stored in sessionStorage — survives client-side navigation,
// cleared on tab close / hard refresh, so the preloader shows exactly once per session.
const SESSION_KEY = "nullsec_booted";

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  // On mount: if this session already ran the boot sequence, skip immediately.
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setBooted(true);
      setShowPreloader(false);
    }
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    try {
      // Returning visitors skip the wait at the boot prompt (see Preloader).
      localStorage.setItem("nullsec_returning", "1");
    } catch { /* storage unavailable */ }
    setBooted(true);
    setShowPreloader(false);
    document.getElementById("main-content")?.focus();
  };

  return (
    <>
      <GSAPInit />
      <SectionShortcuts />
      {showPreloader && <Preloader onComplete={handleComplete} />}
      <main id="main-content" tabIndex={-1}>
        <SectionIdentity booted={booted} />
        <SectionFieldwork />
        <SectionToolkit />
        <SectionClearance />
        <SectionAbout />
        <SectionExperience />
        <SectionDispatches />
        <SectionOffDuty />
        <SectionHandshake />
      </main>
    </>
  );
}
