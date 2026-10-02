import Link from "next/link";
import { profile } from "@/profile";
import { clearances } from "@/content/clearances";
import { work } from "@/content/work";
import { getT } from "@/lib/i18n-static";
import type { Locale } from "@/lib/locale";

/**
 * Five figures right under the hero, so the first scroll answers "what has
 * this person actually done" before any slogan does.
 *
 * Set as type, not as dashboard cards: a serif numeral and a mono caption, the
 * same pairing the rest of the page uses. Every figure is read from the data
 * it summarises or must match it word for word:
 * - 5 and 28: the first Arvato bullet in profile.ts ("5 analyses de risques
 *   EBIOS RM ... dont une de 28 scénarios");
 * - the score: the obtained clearance in content/clearances.ts;
 * - the products: work items that exist, linked to their case studies;
 * - the date: profile.available.
 * Not a <section>: it has no number, no place in the HUD index, and the
 * section shortcuts must keep counting nine.
 */

const PRODUCTS: { slug: string; name: string }[] = [
  { slug: "toron", name: "Toron" },
  { slug: "hune", name: "Hune" },
  { slug: "cyberlearn", name: "CyberLearn" },
].filter((p) => work.some((w) => w.slug === p.slug));

const held = clearances.find((c) => c.status === "GRANTED" && c.score);

export function KeyFigures({ l }: { l: Locale }) {
  const { t, tr, lp } = getT(l);

  // "80%" in the data; French sets a narrow no-break space before the sign.
  const score = held?.score ? tr(held.score, held.score.replace("%", "\u202F%")) : null;

  const figures: { value: string; label: React.ReactNode }[] = [
    { value: "5", label: tr("EBIOS RM risk analyses at Arvato", "analyses de risques EBIOS RM chez Arvato") },
    { value: "28", label: tr("risk scenarios in one of them", "scénarios de risque dans l'une d'elles") },
    ...(score ? [{ value: score, label: tr("on the Stormshield CSNA", "à la certification CSNA Stormshield") }] : []),
    {
      value: String(PRODUCTS.length),
      label: (
        <>
          {tr("products designed: ", "produits conçus : ")}
          {PRODUCTS.map((p, i) => (
            <span key={p.slug}>
              {i > 0 && ", "}
              <Link href={lp(`/work/${p.slug}`)} className="key-figures-link">
                {p.name}
              </Link>
            </span>
          ))}
        </>
      ),
    },
    { value: t(profile.available), label: tr("available full-time", "disponible en CDI") },
  ];

  return (
    <div className="key-figures" role="region" aria-labelledby="key-figures-title">
      <h2 id="key-figures-title" className="key-figures-title">
        <span aria-hidden="true">{"// "}</span>
        {tr("By the numbers", "En chiffres")}
      </h2>
      <ul className="key-figures-list">
        {figures.map((f) => (
          <li key={f.value} className="key-figures-item">
            <span className="key-figures-value">{f.value}</span>{" "}
            <span className="key-figures-label">{f.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
