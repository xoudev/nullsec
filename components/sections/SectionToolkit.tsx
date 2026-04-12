"use client";

import { useEffect, useRef } from "react";
import { gsap, loadScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// NOTE: The · separators break the list into visual "clusters" — Infrastructure,
// Standards, Tooling, Forensics. They're a design rhythm choice, not punctuation.
const TOOLS = [
  "WAZUH",
  "·",
  "SURICATA",
  "·",
  "EBIOS RM",
  "·",
  "ISO 27001",
  "·",
  "PFSENSE",
  "·",
  "PROXMOX",
  "·",
  "TERRAFORM",
  "·",
  "PYTHON",
  "·",
  "GHIDRA",
  "·",
  "NMAP",
  "·",
  "SPLUNK",
  "·",
  "WIRESHARK",
  "·",
  "LINUX",
];

export function SectionToolkit() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;
    if (prefersReduced) return;

    const track = trackRef.current;
    const section = sectionRef.current;

    // ── Mobile: native horizontal momentum scroll ──
    if (window.innerWidth < 768) {
      track.style.flexWrap = "nowrap";
      track.style.overflowX = "auto";
      // DO NOT change section.style.overflow — touching it causes CSS spec
      // overflow-x:visible + overflow-y:hidden → overflow-x computes to auto,
      // making the section a second scroll container and creating void past content.

      // Mirror desktop centre-word highlight on scroll
      const highlightCenter = () => {
        const cx = track.clientWidth / 2 + track.scrollLeft;
        let closestIdx = -1;
        let closestDist = Infinity;
        wordRefs.current.forEach((el, i) => {
          if (!el || TOOLS[i] === "·") return;
          const mid = el.offsetLeft + el.offsetWidth / 2;
          const dist = Math.abs(mid - cx);
          if (dist < closestDist) { closestDist = dist; closestIdx = i; }
        });
        wordRefs.current.forEach((el, i) => {
          if (!el || TOOLS[i] === "·") return;
          el.style.color = i === closestIdx ? "var(--color-blood)" : "var(--color-bone)";
        });
      };

      highlightCenter(); // set initial state
      track.addEventListener("scroll", highlightCenter, { passive: true });
      return () => track.removeEventListener("scroll", highlightCenter);
    }

    // ── Desktop: GSAP ScrollTrigger pin + scrub ──
    // isMounted guards against the race condition where the component unmounts
    // before loadScrollTrigger()'s promise resolves. Without this flag the
    // dangling .then() callback creates an orphaned ScrollTrigger instance that
    // is never cleaned up, then collides with the fresh instance on re-mount.
    let isMounted = true;
    let ctx: ReturnType<typeof gsap.context> | undefined;

    loadScrollTrigger().then((ScrollTrigger) => {
      if (!isMounted) return;

      ctx = gsap.context(() => {
        // Switch to nowrap so items overflow horizontally for the scroll.
        track.style.flexWrap = "nowrap";
        const totalX = track.scrollWidth - window.innerWidth;
        if (totalX <= 0) return; // guard: content fits, no scroll needed

        const anim = gsap.to(track, { x: -totalX, ease: "none" });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${totalX}`,
          pin: true,
          scrub: 1.2,
          animation: anim,
          onUpdate() {
            // Highlight the word whose centre is closest to viewport centre.
            const viewCX = window.innerWidth / 2;
            let closestIdx = -1;
            let closestDist = Infinity;

            wordRefs.current.forEach((el, i) => {
              if (!el || TOOLS[i] === "·") return;
              const rect = el.getBoundingClientRect();
              const dist = Math.abs(rect.left + rect.width / 2 - viewCX);
              if (dist < closestDist) {
                closestDist = dist;
                closestIdx = i;
              }
            });

            wordRefs.current.forEach((el, i) => {
              if (!el) return;
              if (TOOLS[i] === "·") return;
              el.style.color =
                i === closestIdx
                  ? "var(--color-blood)"
                  : "var(--color-bone)";
            });
          },
        });
      });
    });

    return () => {
      isMounted = false;
      ctx?.revert();
    };
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      data-section-id="03"
      aria-label="Toolkit"
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--color-void)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Section label */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "clamp(1.5rem, 4vw, 3rem)",
          left: "clamp(1.5rem, 4vw, 3rem)",
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.65rem",
          color: "var(--color-blood)",
          letterSpacing: "0.1em",
          zIndex: 2,
        }}
      >
        {"03 // TOOLKIT"}
      </div>

      {/* Track — snaps horizontally on mobile, GSAP-pinned on desktop */}
      <div
        ref={trackRef}
        className="toolkit-track-scroll"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(1.5rem, 3vw, 3rem)",
          padding: "0 clamp(1.5rem, 4vw, 3rem)",
          willChange: "transform",
          // Default wrap (mobile-first). useEffect overrides per breakpoint.
          flexWrap: "wrap",
        }}
      >
        {TOOLS.map((tool, i) => (
          <span
            key={`${tool}-${i}`}
            ref={(el) => { wordRefs.current[i] = el; }}
            aria-hidden={tool === "·" ? "true" : undefined}
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize:
                tool === "·"
                  ? "clamp(1.5rem, 4vw, 3rem)"
                  : "clamp(2rem, 5.5vw, 7rem)",
              color:
                tool === "·"
                  ? "rgba(107,107,107,0.35)"
                  : "var(--color-bone)",
              whiteSpace: "nowrap",
              letterSpacing: tool === "·" ? "0" : "0.02em",
              transition: "color 0.15s ease",
              willChange: "color",
              lineHeight: 1,
              userSelect: "none",
              flexShrink: 0,
            }}
          >
            {tool}
          </span>
        ))}
      </div>

      {/* Accessible text list for screen readers */}
      <ul
        aria-label="Tools and technologies"
        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
      >
        {TOOLS.filter((t) => t !== "·").map((tool) => (
          <li key={tool}>{tool}</li>
        ))}
      </ul>
    </section>
  );
}
