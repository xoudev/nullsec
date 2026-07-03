// NULLSEC CV — compiled from source.
// Data comes from cv/data-<lang>.json, generated out of profile.ts by
// scripts/build-cv.mjs (single source of truth: the site's typed data).
// Compile: node scripts/build-cv.mjs

#let lang = sys.inputs.at("lang", default: "en")
#let builddate = sys.inputs.at("builddate", default: "")
#let data = json("data-" + lang + ".json")

// ── NULLSEC tokens ──────────────────────────────────────────────────────────
#let void = rgb("#0F0F12")
#let bone = rgb("#F2EFE8")
#let blood = rgb("#E63946")
#let ash = rgb("#6E6E6E")

#let mono(body, size: 7pt, fill: ash, weight: 400) = text(
  font: "JetBrains Mono", size: size, fill: fill, weight: weight,
  tracking: 0.06em, body,
)

#set page(
  paper: "a4",
  fill: bone,
  margin: (x: 1.35cm, top: 1.25cm, bottom: 1.15cm),
  footer: align(center, mono(size: 6pt,
    data.footer + " · " + builddate,
  )),
)
#set text(font: "Inter", size: 8.4pt, fill: void)
#set par(leading: 0.62em)

// ── Header ──────────────────────────────────────────────────────────────────
#grid(
  columns: (1fr, auto),
  align: (left, right + bottom),
  [
    #text(font: "Instrument Serif", style: "italic", size: 30pt, fill: void)[Jordan Turnaco]
    #v(2pt)
    #mono(size: 8pt, fill: void, weight: 700, upper(data.role))
  ],
  [
    #mono(size: 7pt, data.contact.email) \
    #mono(size: 7pt, "nullsec.fr · github.com/xoudev") \
    #mono(size: 7pt, "linkedin.com/in/jordan-turnaco") \
    #mono(size: 7pt, data.contact.location)
  ],
)
#v(6pt)
#rect(width: 4.2cm, height: 2pt, fill: blood)
#v(2pt)
#text(size: 8.6pt, fill: void.lighten(18%), style: "italic", data.pitch)
#v(2pt)
#mono(size: 7pt, fill: blood, weight: 700, data.availability)
#v(6pt)

// ── Section heading helper ──────────────────────────────────────────────────
#let section(num, title) = {
  v(5pt)
  mono(size: 7pt, fill: blood, weight: 700, num + " // " + upper(title))
  v(-3pt)
  line(length: 100%, stroke: 0.5pt + ash.lighten(45%))
  v(1pt)
}

// ── Body: main column + rail ────────────────────────────────────────────────
#grid(
  columns: (1.62fr, 1fr),
  column-gutter: 0.75cm,
  [
    // ═ Experience ═
    #section("01", data.labels.experience)
    #for xp in data.experience [
      #grid(
        columns: (1fr, auto),
        align: (left, right),
        [#text(size: 9pt, weight: 600, xp.title) #h(4pt) #mono(size: 7pt, fill: blood, weight: 700, xp.company)],
        mono(size: 6.6pt, upper(xp.period)),
      )
      #v(-2pt)
      #for f in xp.focus [
        #box(baseline: -1pt, circle(radius: 1.1pt, fill: blood)) #h(3pt) #text(size: 7.9pt, f) \
      ]
      #v(4pt)
    ]

    // ═ Projects ═
    #section("02", data.labels.projects)
    #for p in data.projects [
      #grid(
        columns: (1fr, auto),
        align: (left, right),
        [#text(size: 9pt, weight: 600, p.name) #h(4pt) #mono(size: 6.4pt, p.stack)],
        mono(size: 6.6pt, p.year),
      )
      #v(-1pt)
      #text(size: 7.9pt, p.line)
      #if p.at("link", default: "") != "" [
        #h(4pt) #mono(size: 6.6pt, fill: blood, p.link)
      ]
      #v(4pt)
    ]
  ],
  [
    // ═ Certifications ═
    #section("03", data.labels.certifications)
    #for c in data.certifications [
      #text(size: 8.4pt, weight: 600, c.name) \
      #mono(size: 6.6pt, upper(c.status))
      #v(3pt)
    ]

    // ═ Education ═
    #section("04", data.labels.education)
    #for e in data.education [
      #text(size: 8pt, weight: 600, e.degree) \
      #mono(size: 6.6pt, upper(e.school + " · " + e.period))
      #v(3pt)
    ]

    // ═ Skills ═
    #section("05", data.labels.skills)
    #for s in data.skills [
      #mono(size: 6.6pt, fill: void, weight: 700, upper(s.domain)) \
      #text(size: 7.6pt, fill: void.lighten(12%), s.items)
      #v(3pt)
    ]

    // ═ Languages ═
    #section("06", data.labels.languages)
    #for l in data.languages [
      #grid(
        columns: (1fr, auto),
        text(size: 7.9pt, l.name),
        mono(size: 6.6pt, upper(l.level)),
      )
      #v(1.5pt)
    ]
  ],
)
