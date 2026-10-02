"use client";

import { useEffect } from "react";
import { unlockAudio, preloadSound, playAmbient } from "@/lib/audio";

/**
 * Initialises audio on the first user gesture of every page load. Browsers
 * keep an AudioContext suspended until a real gesture, so without this every
 * sound silently no-ops. A single pointerdown/keydown anywhere unlocks the
 * context, preloads the click sound and starts the ambient loop (all
 * idempotent).
 *
 * There is no boot gate any more to own the ambient start, so this is the
 * only place that starts it, on every route alike.
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
        void playAmbient("/sound.mp3");
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
