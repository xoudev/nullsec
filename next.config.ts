import type { NextConfig } from "next";
import { execSync } from "node:child_process";

const isDev = process.env.NODE_ENV === "development";

// Real build provenance for the ScanHUD BUILD readout: Vercel injects the
// commit SHA; local builds fall back to `git rev-parse`, then "unknown".
function buildId(): string {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  }
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "unknown";
  }
}

// NOTE on CSP: script-src keeps 'unsafe-inline' because Next.js App Router
// emits inline flight-data scripts on statically prerendered pages, and this
// site deliberately stays fully prerendered. The strict alternative (per-request
// nonces via middleware) forces dynamic rendering of every route — a real
// trade-off, documented here honestly rather than papered over. style-src
// 'unsafe-inline' is required by the inline style props used throughout.
const csp = [
  "default-src 'self'",
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  // Audio plays through fetch + Web Audio (connect-src), but 'self' keeps a
  // future <audio> refactor from being silently killed by the policy.
  "media-src 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "worker-src 'self' blob:",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
]
  .filter(Boolean)
  .join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Self-contained HSTS: Vercel injects one at the edge, but the config must
  // not silently lose it on a provider move. Preload-ready values.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_BUILD_ID: buildId(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // /public assets are not content-hashed, so give the heavy static
        // media a long cache and bump filenames on change.
        source: "/:file(sound|click|loading)\\.:ext(mp3)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Bare list URLs (people trim shared links) land on the matching
      // homepage section instead of a 404.
      { source: "/work", destination: "/#fieldwork", permanent: false },
      { source: "/dispatches", destination: "/#dispatches", permanent: false },
    ];
  },
};

export default nextConfig;
