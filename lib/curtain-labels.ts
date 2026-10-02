import { localePath, type Locale } from "@/lib/locale";
import { sectionLabel } from "@/lib/sections";
import type { CurtainLabels } from "@/lib/curtain";
import { profile } from "@/profile";
import { work } from "@/content/work";
import { dispatches } from "@/content/dispatches";

/**
 * Every page a link can lead to, with the line and the title the curtain
 * shows on the way there. Built on the server (app/[locale]/layout.tsx) from
 * the content the pages render, so the curtain never announces a page that
 * does not exist: a link whose path is missing here navigates without it.
 */
export function curtainLabels(l: Locale): CurtainLabels {
  const fr = l === "fr";
  const upper = (s: string) => s.toLocaleUpperCase(l);
  const day = (iso: string) =>
    upper(
      new Date(iso).toLocaleDateString(fr ? "fr-FR" : "en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    );

  const labels: CurtainLabels = {
    [localePath(l, "/")]: {
      eyebrow: sectionLabel("identity", l),
      title: profile.fullName,
    },
    [localePath(l, "/work")]: {
      eyebrow: `${sectionLabel("fieldwork", l)} · ${work.length} ${fr ? "PROJETS" : "PROJECTS"}`,
      title: fr ? "Travaux de terrain" : "Fieldwork",
    },
    [localePath(l, "/dispatches")]: {
      eyebrow: `${sectionLabel("dispatches", l)} · ${dispatches.length} ${fr ? "TEXTES" : "PIECES"}`,
      title: fr ? "Dépêches" : "Dispatches",
    },
  };
  for (const w of work) {
    labels[localePath(l, `/work/${w.slug}`)] = {
      eyebrow: `${sectionLabel("fieldwork", l)} · ${w.index}`,
      title: w.title[l],
    };
  }
  for (const d of dispatches) {
    labels[localePath(l, `/dispatches/${d.slug}`)] = {
      eyebrow: `${sectionLabel("dispatches", l)} · ${day(d.date)}`,
      title: d.title[l],
    };
  }
  return labels;
}
