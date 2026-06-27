"use client";

import { useState, useEffect } from "react";
import { GSAPInit } from "@/components/GSAPInit";
import { Preloader } from "@/components/sections/Preloader";
import { SectionIdentity } from "@/components/sections/SectionIdentity";
import { SectionFieldwork } from "@/components/sections/SectionFieldwork";
import { SectionToolkit } from "@/components/sections/SectionToolkit";
import { SectionClearance } from "@/components/sections/SectionClearance";
import { SectionAbout } from "@/components/sections/SectionAbout";
import { SectionExperience } from "@/components/sections/SectionExperience";
import { SectionDispatches } from "@/components/sections/SectionDispatches";
import { SectionOffDuty } from "@/components/sections/SectionOffDuty";
import { SectionHandshake } from "@/components/sections/SectionHandshake";

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
    setBooted(true);
    setShowPreloader(false);
    document.getElementById("main-content")?.focus();
  };

  return (
    <>
      <GSAPInit />
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
