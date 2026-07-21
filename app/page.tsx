import { redirect } from "next/navigation";
import { headers } from "next/headers";

// The site lives under /en and /fr. Route the bare root to the visitor's
// language on first hit (Accept-Language), defaulting to English.
export default async function RootRedirect() {
  const accept = (await headers()).get("accept-language")?.toLowerCase() ?? "";
  const prefersFr = accept.startsWith("fr") || accept.includes(",fr");
  redirect(prefersFr ? "/fr" : "/en");
}
