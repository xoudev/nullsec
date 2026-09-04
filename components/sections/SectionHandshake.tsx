"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { softReveal } from "@/lib/softReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { profile } from "@/profile";
import { useT } from "@/lib/i18n";

type OutputLine = {
  type: "input" | "output" | "error" | "system";
  text: string;
  // Optional per-segment colouring for aligned art (e.g. neofetch): when set,
  // the line renders these coloured spans instead of `text`.
  parts?: { text: string; color: string }[];
};

type I18n = ReturnType<typeof useT>;
type T = I18n["t"];
type Tr = I18n["tr"];

function buildWelcome(tr: Tr): OutputLine[] {
  return [
    { type: "system", text: "NULLSEC terminal v1.0.0" },
    { type: "system", text: tr(`connected to ${profile.siteUrl}`, `connecté à ${profile.siteUrl}`) },
    { type: "system", text: tr('type "help" to see available commands.', 'tapez « help » pour lister les commandes disponibles.') },
  ];
}

// ASCII system card — boxed "//" logo (blood) beside profile facts (bone).
// Keys stay English (neofetch convention); values come from the profile.
function neofetch(): OutputLine[] {
  // ASCII-only box: the double-line box-drawing glyphs aren't in the loaded
  // JetBrains Mono Latin subset, so they fall back to a different-width font
  // and break the alignment. Plain +/-/| are always in the font.
  const logo = [
    "+---------+",
    "|  //  // |",
    "|  //  // |",
    "|  //  // |",
    "+---------+",
  ];
  const www = profile.siteUrl.replace(/^https?:\/\//, "");
  const info = [
    "visitor@nullsec",
    "---------------",
    `host    ${profile.fullName} · ${profile.city}`,
    "role    Assistant LISO @ Arvato",
    "focus   GRC · Blue Team · DevSecOps",
    "stack   Next.js · GSAP · Lenis · Typst",
    "shell   nullsh v1.0.0",
    "load    caffeine · 0.71 · 0.44",
    `www     ${www}`,
  ];
  const W = 14; // logo column width
  const rows = Math.max(logo.length, info.length);
  const out: OutputLine[] = [];
  for (let i = 0; i < rows; i++) {
    const l = (logo[i] ?? "").padEnd(W, " ");
    const r = info[i] ?? "";
    out.push({
      type: "output",
      text: l + r,
      parts: [
        { text: l, color: "var(--color-blood)" },
        { text: r, color: "var(--color-bone)" },
      ],
    });
  }
  // Palette swatch — the three non-void brand colours, like a real neofetch.
  const gap = " ".repeat(W);
  out.push({ type: "output", text: "", parts: [{ text: " ", color: "var(--color-bone)" }] });
  out.push({
    type: "output",
    text: gap + "███ ███ ███",
    parts: [
      { text: gap, color: "var(--color-bone)" },
      { text: "███", color: "var(--color-bone)" },
      { text: " ", color: "var(--color-bone)" },
      { text: "███", color: "var(--color-blood)" },
      { text: " ", color: "var(--color-bone)" },
      { text: "███", color: "var(--color-ash)" },
    ],
  });
  return out;
}

function runCommand(raw: string, t: T, tr: Tr, history: string[] = []): OutputLine[] {
  const cmd = raw.trim().toLowerCase();
  const argv = cmd.split(/\s+/);
  const bin = argv[0] ?? "";

  // The classics every technical visitor tries first — the illusion must not
  // break on `ls`.
  if (bin === "pwd") return [{ type: "output", text: "/home/visitor" }];
  if (bin === "cd") {
    return [{ type: "output", text: tr("nowhere to go. everything is right here.", "nulle part où aller : tout est déjà là.") }];
  }
  if (bin === "ls" || bin === "ll" || bin === "dir") {
    return [
      { type: "output", text: "identity/    fieldwork/   toolkit/     clearance/" },
      { type: "output", text: "about/       experience/  dispatches/  off-duty/" },
      { type: "output", text: "cv.pdf       pgp.txt      .well-known/" },
    ];
  }
  if (bin === "cat") {
    if (argv[1] === "cv.pdf") {
      return [{ type: "output", text: tr(`binary file. open it: ${profile.siteUrl}${t(profile.cvUrl)}`, `fichier binaire. À ouvrir ici : ${profile.siteUrl}${t(profile.cvUrl)}`) }];
    }
    if (argv[1] === "pgp.txt") return [{ type: "output", text: profile.pgpKey }];
    if (!argv[1]) return [{ type: "error", text: tr("usage: cat <file>", "usage : cat <fichier>") }];
    return [{ type: "error", text: `cat: ${argv[1]}: ${tr("permission denied", "permission refusée")}` }];
  }
  if (bin === "echo") return [{ type: "output", text: raw.trim().replace(/^echo\s?/i, "") }];
  if (bin === "date") return [{ type: "output", text: new Date().toString() }];
  if (bin === "uptime") {
    return [{ type: "output", text: tr("up since 2023 · load average: caffeine", "en marche depuis 2023 · charge moyenne : caféine") }];
  }
  if (bin === "neofetch" || bin === "fetch") return neofetch();
  if (bin === "history") {
    if (!history.length) return [{ type: "output", text: tr("no history yet.", "aucun historique.") }];
    return history.map((h, i) => ({ type: "output" as const, text: `${String(i + 1).padStart(4, " ")}  ${h}` }));
  }
  if (bin === "man") {
    if (!argv[1]) return [{ type: "error", text: tr("what manual page do you want?", "quelle page de manuel voulez-vous ?") }];
    return [{ type: "output", text: tr(`no manual entry for ${argv[1]}. this shell documents itself: type "help".`, `pas de page de manuel pour ${argv[1]}. ce shell se documente tout seul : tapez « help ».`) }];
  }
  if (bin === "rm") {
    return [{ type: "error", text: tr("rm: read-only filesystem. grab the cv instead.", "rm : système de fichiers en lecture seule. prenez plutôt le CV.") }];
  }
  if (bin === "exit" || bin === "logout" || bin === "quit") {
    return [{ type: "output", text: tr("there is no exit. just scroll.", "pas de sortie : il suffit de remonter.") }];
  }
  if (bin === "sudo") {
    if (cmd.includes("rm -rf")) return [{ type: "error", text: tr("nice try.", "joli essai.") }];
    if (cmd === "sudo su" || cmd === "sudo -i" || cmd === "sudo su -") {
      return [{ type: "error", text: tr("root on a portfolio? bold. denied.", "root sur un portfolio ? audacieux. refusé.") }];
    }
    return [{
      type: "error",
      text: tr(
        "visitor is not in the sudoers file. This incident will be reported.",
        "visitor n'est pas dans le fichier sudoers. L'incident sera signalé.",
      ),
    }];
  }

  switch (cmd) {
    case "help":
      return [
        { type: "output", text: tr("available commands:", "commandes disponibles :") },
        { type: "output", text: tr("  whoami   — identity and status", "  whoami   : identité et statut") },
        { type: "output", text: tr("  about    — same as whoami", "  about    : idem whoami") },
        { type: "output", text: tr("  xp       — work experience", "  xp       : parcours professionnel") },
        { type: "output", text: tr("  edu      — education", "  edu      : formation") },
        { type: "output", text: tr("  certs    — certifications", "  certs    : certifications") },
        { type: "output", text: tr("  skills   — skill domains", "  skills   : domaines de compétences") },
        { type: "output", text: tr("  langs    — languages", "  langs    : langues") },
        { type: "output", text: tr("  hire     — apprenticeship info", "  hire     : infos alternance") },
        { type: "output", text: tr("  email    — contact email", "  email    : adresse de contact") },
        { type: "output", text: tr("  pgp      — pgp public key", "  pgp      : clé publique pgp") },
        { type: "output", text: tr("  cv       — curriculum vitae", "  cv       : curriculum vitae") },
        { type: "output", text: tr("  clear    — reset terminal", "  clear    : vider le terminal") },
      ];

    case "about":
    case "whoami":
      return [
        { type: "output", text: `${profile.fullName} · ${profile.city}` },
        { type: "output", text: tr("Assistant LISO @ Arvato · Guardia · 3rd year", "Assistant LISO @ Arvato · Guardia · 3e année") },
        { type: "output", text: t(profile.bio) },
        { type: "output", text: tr(`next availability: ${profile.available}`, `disponible à partir de : ${profile.available}`) },
      ];

    case "hire":
      return [
        { type: "output", text: tr("currently: Assistant LISO @ Arvato (apprenticeship), Oct 2025 — Sept 2028.", "en poste : Assistant LISO @ Arvato (alternance), oct. 2025 à sept. 2028.") },
        { type: "output", text: tr("next: Mastère offensive/defensive apprenticeship, 2026 — 2028, same host company.", "ensuite : Mastère offensif/défensif en alternance, 2026 à 2028, même entreprise d'accueil.") },
        { type: "output", text: tr(`open to full-time from ${profile.available}. happy to talk before then.`, "ouvert à un CDI dès sept. 2028. ravi d'échanger d'ici là.") },
        { type: "output", text: tr("domains: GRC · Blue Team · DevSecOps.", "domaines : GRC · Blue Team · DevSecOps.") },
        { type: "output", text: tr(`contact: ${profile.email}`, `contact : ${profile.email}`) },
      ];

    case "email":
      return [{ type: "output", text: profile.email }];

    case "pgp":
      return profile.pgpKey
        ? [{ type: "output", text: profile.pgpKey }]
        : [{ type: "output", text: tr("pgp key not yet uploaded.", "clé pgp pas encore mise en ligne.") }];

    case "cv":
      return [
        { type: "output", text: tr(`cv available at ${profile.siteUrl}${t(profile.cvUrl)}`, `cv consultable sur ${profile.siteUrl}${t(profile.cvUrl)}`) },
        { type: "output", text: tr("compiled from source — see scripts/build-cv.mjs", "compilé depuis les sources : voir scripts/build-cv.mjs") },
      ];

    case "xp":
    case "experience":
      return profile.experience.flatMap((e, i) => [
        { type: "output" as const, text: tr(`[${i + 1}] ${t(e.title)} — ${e.company}`, `[${i + 1}] ${t(e.title)} · ${e.company}`) },
        { type: "output" as const, text: `    ${t(e.period)}` },
        ...t<readonly string[]>(e.focus).map((f) => ({ type: "output" as const, text: `    · ${f}` })),
      ]);

    case "edu":
    case "education":
      return profile.education.map((e) => ({
        type: "output" as const,
        text: tr(`${e.period}  ${e.school} — ${t(e.degree)}`, `${e.period}  ${e.school} · ${t(e.degree)}`),
      }));

    case "certs":
    case "certifications":
      return [
        { type: "output" as const, text: tr("certifications:", "certifications :") },
        ...profile.certifications.map((c) => ({
          type: "output" as const,
          text: tr(`  ${t(c.name)} — ${t(c.status)}`, `  ${t(c.name)} · ${t(c.status)}`),
        })),
      ];

    case "skills": {
      const s = profile.skills;
      return [
        { type: "output" as const, text: `cybersecurity  ${s.cybersecurity.slice(0, 6).join(" · ")}` },
        { type: "output" as const, text: `               ${s.cybersecurity.slice(6).join(" · ")}` },
        { type: "output" as const, text: `offensive      ${s.offensive.join(" · ")}` },
        { type: "output" as const, text: `dev            ${s.development.join(" · ")}` },
        { type: "output" as const, text: `re             ${s.reverseEngineering.join(" · ")}` },
        { type: "output" as const, text: `infra          ${s.infrastructure.join(" · ")}` },
        { type: "output" as const, text: `devsecops      ${s.devSecOps.join(" · ")}` },
      ];
    }

    case "langs":
    case "languages":
      return profile.languages.map((l) => ({
        type: "output" as const,
        text: `${t(l.lang).padEnd(10)} ${t(l.level)}`,
      }));

    case "clear":
      return [{ type: "system", text: "__CLEAR__" }];

    case "":
      return [];

    default:
      return [
        {
          type: "error",
          text: tr(`command not found: ${raw.trim()}. type "help".`, `commande inconnue : ${raw.trim()}. tapez « help ».`),
        },
      ];
  }
}

// Detects URLs and email addresses and wraps them in <a> tags.
// Using a capture group in split() includes the matches in the resulting array.
const LINK_RE = /(https?:\/\/\S+|[\w.+-]+@[\w.-]+\.[a-z]{2,})/gi;

function renderWithLinks(text: string): React.ReactNode {
  const parts = text.split(LINK_RE);
  if (parts.length === 1) return text; // no links — fast path
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return part || null; // plain text
        const isEmail = !part.startsWith("http");
        return (
          <a
            key={i}
            href={isEmail ? `mailto:${part}` : part}
            target={isEmail ? undefined : "_blank"}
            rel="noopener noreferrer"
            style={{ color: "var(--color-blood)", textDecoration: "underline" }}
          >
            {part}
          </a>
        );
      })}
    </>
  );
}

export function SectionHandshake() {
  const sectionRef = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const booted = useRef(false);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [inputVal, setInputVal] = useState("");
  // Arrow-up/down command history, like a real shell.
  const history = useRef<string[]>([]);
  const historyPos = useRef(-1);
  const prefersReduced = useReducedMotion();
  const { t, tr } = useT();

  // Keep the latest locale helpers reachable from effects/handlers without
  // re-running the boot sequence on locale change.
  const i18nRef = useRef({ t, tr });
  i18nRef.current = { t, tr };

  const focusInput = useCallback(() => inputRef.current?.focus(), []);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Boot sequence — plays once when section enters viewport. `help` runs by
  // itself after the welcome so the window is never a big empty box and every
  // visitor discovers the commands without typing.
  useEffect(() => {
    const autoHelp = (): OutputLine[] => [
      { type: "input", text: "help" },
      ...runCommand("help", i18nRef.current.t, i18nRef.current.tr),
    ];

    if (prefersReduced) {
      // Show the welcome + help output immediately; soft-fade the window in.
      setOutput([...buildWelcome(i18nRef.current.tr), ...autoHelp()]);
      return softReveal([windowRef.current]);
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || booted.current) return;
        booted.current = true;
        observer.disconnect();

        // Window entrance
        if (windowRef.current) {
          gsap.fromTo(
            windowRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }
          );
        }

        // Staggered welcome lines, then the auto-run help
        const welcome = buildWelcome(i18nRef.current.tr);
        welcome.forEach((line, i) => {
          timers.push(
            setTimeout(() => {
              setOutput((prev) => [...prev, line]);
            }, 350 + i * 260)
          );
        });
        timers.push(
          setTimeout(() => {
            setOutput((prev) => [...prev, ...autoHelp()]);
          }, 350 + welcome.length * 260 + 300)
        );
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [prefersReduced]);

  const execute = useCallback((raw: string) => {
    const { t: tt, tr: ttr } = i18nRef.current;
    if (raw.trim()) {
      history.current.push(raw);
      historyPos.current = -1;
    }
    const result = runCommand(raw, tt, ttr, history.current);
    const isClear = result.some((l) => l.text === "__CLEAR__");
    setOutput((prev) =>
      isClear
        ? buildWelcome(ttr)
        : [...prev, { type: "input" as const, text: raw }, ...result]
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal;
    setInputVal("");
    execute(raw);
  };

  // Shell-style history navigation on the input.
  const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const h = history.current;
    if (e.key === "ArrowUp") {
      if (!h.length) return;
      e.preventDefault();
      historyPos.current =
        historyPos.current === -1
          ? h.length - 1
          : Math.max(0, historyPos.current - 1);
      setInputVal(h[historyPos.current]);
    } else if (e.key === "ArrowDown") {
      if (historyPos.current === -1) return;
      e.preventDefault();
      historyPos.current += 1;
      if (historyPos.current >= h.length) {
        historyPos.current = -1;
        setInputVal("");
      } else {
        setInputVal(h[historyPos.current]);
      }
    }
  };

  const lineColor = (type: OutputLine["type"]): string => {
    switch (type) {
      case "input":
        return "var(--color-bone)";
      case "error":
        return "var(--color-blood)";
      case "system":
        return "var(--color-ash)";
      default:
        return "rgba(242,239,232,0.72)";
    }
  };

  return (
    <section
      ref={sectionRef}
      data-section-id="09"
      aria-label={tr("Contact — Terminal", "Contact : terminal")}
      style={{
        backgroundColor: "var(--color-void)",
        padding: "clamp(3rem, 6vw, 6rem) clamp(1.5rem, 4vw, 3rem)",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <span aria-hidden="true" className="ghost-numeral">EOF</span>

      {/* Section label */}
      <div
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.65rem",
          color: "var(--color-blood)",
          letterSpacing: "0.1em",
          marginBottom: "clamp(1.25rem, 2.5vw, 2rem)",
        }}
      >
        {"09 // HANDSHAKE"}
      </div>

      {/* Closing statement — the page's final typographic beat. The tagline
          gets its display-scale moment here, with a single blood word. */}
      <h2
        style={{
          fontFamily: "var(--font-instrument-serif)",
          fontStyle: "italic",
          fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: "var(--color-bone)",
          margin: "0 0 0.9rem",
          maxWidth: "24ch",
        }}
      >
        {tr("Securing what others ", "Protéger ce que les autres ")}
        <span style={{ color: "var(--color-blood)" }}>
          {tr("overlook", "laissent filer")}
        </span>
        {"."}
      </h2>

      {/* The email in plain sight — no command required. */}
      <a
        href={`mailto:${profile.email}`}
        style={{
          alignSelf: "flex-start",
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "clamp(0.7rem, 1vw, 0.8rem)",
          letterSpacing: "0.06em",
          marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
          padding: "0.4rem 0",
        }}
        className="hover-to-bone"
      >
        {"// "}{profile.email}
      </a>

      {/* ── Terminal window frame ── */}
      <div
        ref={windowRef}
        className="terminal-frame"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          border: "1px solid rgba(107,107,107,0.28)",
          boxShadow: [
            "inset 0 0 0 1px rgba(255,255,255,0.02)",
            "0 20px 80px rgba(0,0,0,0.55)",
            "0 0 120px rgba(255,107,26,0.04)",
          ].join(", "),
          overflow: "hidden",
        }}
      >
        {/* ── Window header bar ── */}
        <div
          aria-hidden="true"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "2.5rem",
            padding: "0 1.25rem",
            borderBottom: "1px solid rgba(107,107,107,0.18)",
            backgroundColor: "rgba(107,107,107,0.05)",
            flexShrink: 0,
            position: "relative",
          }}
        >
          {/* Traffic light dots */}
          <div style={{ display: "flex", gap: "0.45rem", alignItems: "center" }}>
            {(["var(--color-blood)", "rgba(107,107,107,0.45)", "rgba(107,107,107,0.2)"] as const).map(
              (bg, j) => (
                <span
                  key={j}
                  style={{
                    display: "block",
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    backgroundColor: bg,
                  }}
                />
              )
            )}
          </div>

          {/* Center: shell path — hidden on very narrow screens to avoid overlap */}
          <span
            className="terminal-header-title"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.63rem",
              color: "var(--color-ash)",
              letterSpacing: "0.08em",
              whiteSpace: "nowrap",
            }}
          >
            visitor@nullsec:~
          </span>

          {/* Right: version */}
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.58rem",
              color: "var(--color-ash)",
              letterSpacing: "0.05em",
            }}
          >
            NULLSEC v1.0.0
          </span>
        </div>

        {/* ── Content wrapper: scanlines + scroll ── */}
        <div
          style={{ position: "relative", flex: 1, overflow: "hidden" }}
          onClick={focusInput}
        >
          {/* Scanline texture — fixed overlay, non-interactive */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          {/* Scrollable log — sits below scanline overlay */}
          <div
            ref={terminalRef}
            role="log"
            aria-label={tr("Interactive terminal", "Terminal interactif")}
            aria-live="polite"
            style={{
              height: "100%",
              overflowY: "auto",
              // Aligned art (neofetch) is wider than a phone: let it scroll
              // horizontally instead of wrapping into a broken mess.
              overflowX: "auto",
              padding: "clamp(1rem, 2vw, 1.5rem)",
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "clamp(0.72rem, 1vw, 0.88rem)",
              lineHeight: 1.9,
              letterSpacing: "0.03em",
              position: "relative",
              zIndex: 1,
            }}
          >
            {output.map((line, i) => (
              <div
                key={i}
                // Art lines (with per-segment colouring) never wrap, so their
                // alignment survives on narrow screens; prose still wraps.
                style={{ color: lineColor(line.type), userSelect: "text", whiteSpace: line.parts ? "pre" : "pre-wrap" }}
              >
                {line.type === "input" ? (
                  <span>
                    <span
                      style={{
                        color: "var(--color-blood)",
                        textShadow: "0 0 10px rgba(255,107,26,0.45)",
                      }}
                    >
                      visitor@nullsec:~$
                    </span>{" "}
                    {line.text}
                  </span>
                ) : line.parts ? (
                  line.parts.map((p, j) => (
                    <span key={j} style={{ color: p.color }}>{p.text}</span>
                  ))
                ) : (
                  renderWithLinks(line.text)
                )}
              </div>
            ))}

            {/* Input line */}
            <form
              onSubmit={handleSubmit}
              className="terminal-input-row"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              aria-label={tr("Terminal input", "Saisie du terminal")}
            >
              <label
                htmlFor="terminal-input"
                style={{
                  color: "var(--color-blood)",
                  whiteSpace: "nowrap",
                  textShadow: "0 0 10px rgba(255,107,26,0.45)",
                }}
              >
                visitor@nullsec:~$
              </label>
              {/* Mirror layer shows the typed text + block cursor in normal
                  flow (so the cursor always sits exactly after the text); the
                  real input is overlaid and transparent, capturing typing and
                  focus. The block is the focus cue — no coloured underline. */}
              <span style={{ position: "relative", flex: 1, minWidth: 0, display: "inline-flex", alignItems: "center", overflow: "hidden" }}>
                <span aria-hidden="true" style={{ whiteSpace: "pre", color: "var(--color-bone)" }}>{inputVal}</span>
                <span aria-hidden="true" className="terminal-cursor">▋</span>
                <input
                  id="terminal-input"
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleInputKey}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-label={tr("Terminal command input", "Saisie de commande du terminal")}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    padding: 0,
                    margin: 0,
                    color: "transparent",
                    caretColor: "transparent",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    letterSpacing: "inherit",
                  }}
                />
              </span>
            </form>
          </div>
        </div>
      </div>

      {/* Command chips — typing into a fake shell on a phone keyboard is a big
          ask; on touch these run the key commands with one tap. */}
      <div
        className="terminal-chips"
        aria-label={tr("Quick commands", "Commandes rapides")}
        role="group"
      >
        {["whoami", "hire", "certs", "email"].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => execute(c)}
            style={{
              background: "none",
              border: "1px solid rgba(107,107,107,0.35)",
              color: "var(--color-ash)",
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.68rem",
              letterSpacing: "0.08em",
              padding: "0.55rem 0.9rem",
              whiteSpace: "nowrap",
            }}
          >
            [ {c} ]
          </button>
        ))}
      </div>

      {/* Social links */}
      <div
        style={{
          marginTop: "clamp(2rem, 4vw, 3rem)",
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(0.75rem, 2vw, 2.5rem)",
        }}
      >
        {[
          { label: "email", href: `mailto:${profile.email}` },
          { label: "github", href: profile.github },
          { label: "linkedin", href: profile.linkedin },
          { label: "cv", href: t(profile.cvUrl) },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href || "#"}
            aria-label={label}
            aria-disabled={!href}
            rel="noopener noreferrer"
            target={href && href.startsWith("http") ? "_blank" : undefined}
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.7rem",
              color: href ? "var(--color-ash)" : "rgba(107,107,107,0.3)",
              letterSpacing: "0.08em",
              textDecoration: "none",
              whiteSpace: "nowrap",
              border: "1px solid",
              borderColor: href ? "rgba(107,107,107,0.35)" : "rgba(107,107,107,0.15)",
              padding: "0.4rem 0.9rem",
              transition: "color 0.2s ease, border-color 0.2s ease",
            }}
            onMouseOver={(e) => {
              if (!href) return;
              const el = e.currentTarget as HTMLElement;
              el.style.color = "var(--color-bone)";
              el.style.borderColor = "var(--color-bone)";
            }}
            onMouseOut={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = href ? "var(--color-ash)" : "rgba(107,107,107,0.3)";
              el.style.borderColor = href
                ? "rgba(107,107,107,0.35)"
                : "rgba(107,107,107,0.15)";
            }}
          >
            [ {label} ]
          </a>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "clamp(1.5rem, 3vw, 2rem)",
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.6rem",
          color: "var(--color-ash)",
          letterSpacing: "0.06em",
        }}
      >
        {tr(`// xoudev — ${profile.tagline.en.toLowerCase()}`, `// xoudev · ${profile.tagline.fr.toLowerCase()}`)}
      </div>
    </section>
  );
}
