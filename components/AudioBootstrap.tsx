"use client";

import { useEffect } from "react";
import { unlockAudio, preloadSound, playAmbient } from "@/lib/audio";

/**
 * Initialises audio on the first user gesture of EVERY page load — not just the
 * preloader's. The preloader only runs once per tab session (and never on
 * /work or /dispatches), so without this the AudioContext is never created on
 * a refresh or a detail page, and every sound silently no-ops. A single
 * pointerdown/keydown anywhere unlocks the context and preloads the click
 * sound (all idempotent — safe alongside the preloader).
 *
 * The ambient loop is only started here when the preloader is NOT about to run:
 * on first visits to the homepage the same gesture that unlocks audio also
 * starts the boot sequence, and the Preloader owns the ambient start at boot
 * complete — starting it here too made ambient and the boot sound overlap.
 */
export function AudioBootstrap() {
  useEffect(() => {
    let done = false;
    const init = () => {
      if (done) return;
      done = true;
      try {
        unlockAudio();
        void preloadSound("/click.mp3");
        const p = window.location.pathname;
        const preloaderPending =
          (p === "/en" || p === "/fr") &&
          sessionStorage.getItem("nullsec_booted") !== "1";
        if (!preloaderPending) {
          void playAmbient("/sound.mp3");
        }
      } catch {
        // Audio is optional — never let it break interaction.
      }
      window.removeEventListener("pointerdown", init);
      window.removeEventListener("keydown", init);
    };
    window.addEventListener("pointerdown", init);
    window.addEventListener("keydown", init);
    return () => {
      window.removeEventListener("pointerdown", init);
      window.removeEventListener("keydown", init);
    };
  }, []);

  return null;
}
