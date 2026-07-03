import type { Metadata } from "next";
import { NotFoundBody } from "@/components/NotFoundBody";

export const metadata: Metadata = {
  title: "404 — Not found",
  description: "The page you requested does not exist.",
};

export default function NotFound() {
  return <NotFoundBody />;
}
