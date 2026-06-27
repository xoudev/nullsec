"use client";

import { useEffect } from "react";
import { unlockAudio, preloadSound, playAmbient } from "@/lib/audio";

/**
 * Initialises audio on the first user gesture of EVERY page load — not just the
 * preloader's. The preloader only runs once per tab session (and never on
 * /work or /dispatches), so without this the AudioContext is never created on
 * a refresh or a detail page, and every sound silently no-ops. A single
 * pointerdown/keydown anywhere unlocks the context, preloads the click sound,
 * and starts the ambient loop (all idempotent — safe alongside the preloader).
 */
export function AudioBootstrap() {
  useEffect(() => {
    let done = false;
    const init = () => {
      if (done) return;
      done = true;
      try {
        unlockAudio();
        void preloadSound("/click.wav");
        void playAmbient("/sound.wav");
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
