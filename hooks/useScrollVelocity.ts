"use client";

import { useRef } from "react";
import { useLenis } from "@/hooks/useLenis";

/**
 * Returns a ref whose .current holds the latest scroll velocity (px/s)
 * as reported by Lenis. Using a ref (not state) avoids re-rendering
 * every scroll tick — consumers read .current imperatively (e.g. in
 * a rAF loop or directly in the ScanHUD via DOM mutation).
 */
export function useScrollVelocity(): React.RefObject<number> {
  const velocityRef = useRef<number>(0);

  useLenis((lenis) => {
    velocityRef.current = lenis.velocity;
  }, []);

  return velocityRef;
}
