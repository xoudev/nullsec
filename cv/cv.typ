// NULLSEC CV — compiled from source.
// Data comes from cv/data-<lang>.json, generated out of profile.ts by
// scripts/build-cv.mjs (single source of truth: the site's typed data).
// Compile: node scripts/build-cv.mjs
//
// Layout is deliberately ATS-friendly: a single column (no reading-order
// ambiguity for parsers), standard section names, plain hyphens in dates,
// all information as real text (nothing lives in images).

#let lang = sys.inputs.at("lang", default: "en")
#let data = json("data-" + lang + ".json")

// ── NULLSEC tokens ──────────────────────────────────────────────────────────
#let void = rgb("#0F0F12")
#let bone = rgb("#F2EFE8")
// Deepened form of the site accent (--color-blood #FF6B1A). The site value
// itself only reaches 2.5:1 on this ivory page, and the accent carries small
// 6.4-7pt mono text, not just rules. Same hue (21deg) and saturation, lowered
// lightness: 4.6:1, WCAG AA for small text, and it survives print.
#let blood = rgb("#BD4300")
#let ash = rgb("#6E6E6E")

#let mono(body, size: 7pt, fill: ash, weight: 400) = text(
  font: "JetBrains Mono", size: size, fill: fill, weight: weight,
  tracking: 0.05em, body,
)

// Contact line: a real PDF link annotation around unchanged printed text.
// Deliberately not recoloured — the header palette was chosen for contrast on
// this ivory page, and three orange lines would shout.
#let clink(url, label) = link(url, mono(size: 6.8pt, label))

#set page(
  paper: "a4",
  fill: bone,
  margin: (x: 1.5cm, top: 1.0cm, bottom: 0.8cm),
)
#set text(font: "Inter", size: 8.1pt, fill: void)
#set par(leading: 0.49em)

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
    #clink("mailto:" + data.contact.email, data.contact.email) \
    #clink(data.contact.site.url, data.contact.site.label) #mono(size: 6.8pt, "·") #clink(data.contact.github.url, data.contact.github.label) \
    #clink(data.contact.linkedin.url, data.contact.linkedin.label) \
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
  #if p.at("link", default: none) != none [
    #h(4pt) #link(p.link.url, mono(size: 6.4pt, fill: blood, p.link.label))
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
    columns: (3.4cm, 1fr),
    column-gutter: 0.35cm,
    mono(size: 6.5pt, fill: void, weight: 700, upper(s.domain)),
    text(size: 7.7pt, fill: void.lighten(10%), s.items),
  )
  #v(1.5pt)
]

// ═ Education ═
#section(data.labels.education)
#for e in data.education [
  #grid(
    columns: (1fr, auto),
    column-gutter: 0.3cm,
    align: (left, right),
    text(size: 8.0pt, weight: 600, e.degree),
    mono(size: 6.6pt, upper(e.school + " · " + e.period)),
  )
  #v(1.5pt)
]

