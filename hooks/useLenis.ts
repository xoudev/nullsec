"use client";

// Thin re-export so the rest of the app imports from @/hooks/useLenis
// rather than the vendor path — makes future swaps painless.
export { useLenis } from "lenis/react";
