"use client";

import { useSyncExternalStore } from "react";

// useSyncExternalStore is the React-idiomatic way to subscribe to external
// stores like matchMedia. It avoids synchronous setState inside effects.

function subscribe(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Server/first-paint default: animations enabled (no layout shift on hydration).
function getServerSnapshot() {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
