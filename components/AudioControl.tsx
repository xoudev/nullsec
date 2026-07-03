"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getMuted, onMuteChange, toggleMute } from "@/lib/audio";
import { useT } from "@/lib/i18n";

// Subscribe to the audio module's mute state the React-idiomatic way.
function subscribeMute(cb: () => void) {
  return onMuteChange(() => cb());
}
function serverSnapshot() {
  return false;
}

/**
 * Standalone mute toggle for the contexts where the ScanHUD (which hosts the
 * desktop volume/mute controls) does not exist: viewports under 768px and
 * prefers-reduced-motion. Without it those visitors get the ambient loop with
 * no way to stop it (WCAG 1.4.2). Visibility is CSS-driven (.audio-control);
 * reduced motion forces it on at any viewport.
 */
export function AudioControl() {
  const prefersReduced = useReducedMotion();
  const { tr } = useT();
  const muted = useSyncExternalStore(subscribeMute, getMuted, serverSnapshot);

  return (
    <button
      type="button"
      onClick={toggleMute}
      className={`audio-control${prefersReduced ? " audio-control--force" : ""}`}
      aria-label={
        muted
          ? tr("Unmute ambient sound", "Rétablir le son ambiant")
          : tr("Mute ambient sound", "Couper le son ambiant")
      }
      aria-pressed={muted}
      style={{
        position: "fixed",
        top: "0.75rem",
        right: "0.75rem",
        zIndex: 60,
        background: "rgba(15,15,18,0.85)",
        border: "1px solid rgba(107,107,107,0.3)",
        // ≥44px tap target; the label itself stays small.
        minWidth: "2.75rem",
        minHeight: "2.75rem",
        padding: "0.5rem 0.75rem",
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: "0.62rem",
        letterSpacing: "0.08em",
        color: muted ? "var(--color-blood)" : "var(--color-ash)",
        transition: "color 0.2s ease",
      }}
    >
      {muted ? tr("[ SND OFF ]", "[ SON OFF ]") : tr("[ SND ON ]", "[ SON ON ]")}
    </button>
  );
}
