// NULLSEC CV — compiled from source.
// Data comes from cv/data-<lang>.json, generated out of profile.ts by
// scripts/build-cv.mjs (single source of truth: the site's typed data).
// Compile: node scripts/build-cv.mjs
//
// Layout is deliberately ATS-friendly: a single column (no reading-order
// ambiguity for parsers), standard section names, plain hyphens in dates,
// all information as real text (nothing lives in images).

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
  tracking: 0.05em, body,
)

#set page(
  paper: "a4",
  fill: bone,
  margin: (x: 1.5cm, top: 1.05cm, bottom: 0.95cm),
  footer: align(center, mono(size: 6pt,
    data.footer + " · " + builddate,
  )),
)
#set text(font: "Inter", size: 8.1pt, fill: void)
#set par(leading: 0.52em)

// ── Header ──────────────────────────────────────────────────────────────────
#grid(
  columns: (1fr, auto),
  align: (left, right + bottom),
  [
    #text(font: "Instrument Serif", style: "italic", size: 25pt, fill: void)[Jordan Turnaco]
    #v(1pt)
    #mono(size: 7.6pt, fill: void, weight: 700, upper(data.role))
  ],
  [
    #mono(size: 6.8pt, data.contact.email) \
    #mono(size: 6.8pt, "nullsec.fr · github.com/xoudev") \
    #mono(size: 6.8pt, "linkedin.com/in/jordan-turnaco") \
    #mono(size: 6.8pt, data.contact.location)
  ],
)
#v(4pt)
#rect(width: 4.2cm, height: 2pt, fill: blood)
#v(1pt)
#text(size: 8.3pt, fill: void.lighten(14%), data.pitch)
#v(1pt)
#mono(size: 6.8pt, fill: blood, weight: 700, data.availability)
#v(2pt)

// ── Section heading helper ──────────────────────────────────────────────────
#let section(title) = {
  v(2pt)
  mono(size: 7pt, fill: blood, weight: 700, "// " + upper(title))
  v(-3.5pt)
  line(length: 100%, stroke: 0.5pt + ash.lighten(45%))
  v(0pt)
}

// ═ Experience ═
#section(data.labels.experience)
#for xp in data.experience [
  #grid(
    columns: (1fr, auto),
    align: (left, right),
    [#text(size: 8.8pt, weight: 600, xp.title) #h(5pt) #mono(size: 6.8pt, fill: blood, weight: 700, xp.company)],
    mono(size: 6.6pt, upper(xp.period)),
  )
  #v(-2.5pt)
  #for f in xp.focus [
    #box(baseline: -1pt, circle(radius: 1pt, fill: blood)) #h(3pt) #text(size: 7.8pt, f) \
  ]
  #v(1.5pt)
]

// ═ Projects ═
#section(data.labels.projects)
#for p in data.projects [
  #grid(
    columns: (1fr, auto),
    align: (left, right),
    [#text(size: 8.6pt, weight: 600, p.name) #h(5pt) #mono(size: 6.3pt, p.stack)],
    mono(size: 6.6pt, p.year),
  )
  #v(-2pt)
  #text(size: 7.8pt, p.line)
  #if p.at("link", default: "") != "" [
    #h(4pt) #mono(size: 6.4pt, fill: blood, p.link)
  ]
  #v(1.5pt)
]

// ═ Certifications ═
#section(data.labels.certifications)
#for c in data.certifications [
  #text(size: 8.4pt, weight: 600, c.name) #h(6pt) #mono(size: 6.6pt, upper(c.status)) \
]
#v(-1pt)
#text(size: 7.8pt, fill: void.lighten(14%), data.certPreparing)
#v(1pt)

// ═ Skills ═
#section(data.labels.skills)
#for s in data.skills [
  #grid(
    columns: (2.6cm, 1fr),
    column-gutter: 0.35cm,
    mono(size: 6.6pt, fill: void, weight: 700, upper(s.domain)),
    text(size: 7.8pt, fill: void.lighten(10%), s.items),
  )
  #v(1.5pt)
]

// ═ Education ═
#section(data.labels.education)
#for e in data.education [
  #grid(
    columns: (1fr, auto),
    align: (left, right),
    text(size: 8.2pt, weight: 600, e.degree),
    mono(size: 6.6pt, upper(e.school + " · " + e.period)),
  )
  #v(1.5pt)
]

// ═ Languages ═
#section(data.labels.languages)
#text(size: 7.9pt, data.languagesLine)
