"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { profile } from "@/profile";

type OutputLine = {
  type: "input" | "output" | "error" | "system";
  text: string;
};

const WELCOME: OutputLine[] = [
  { type: "system", text: "NULLSEC terminal v1.0.0" },
  { type: "system", text: `connected to ${profile.siteUrl}` },
  { type: "system", text: 'type "help" to see available commands.' },
];

function runCommand(raw: string): OutputLine[] {
  const cmd = raw.trim().toLowerCase();
  switch (cmd) {
    case "help":
      return [
        { type: "output", text: "available commands:" },
        { type: "output", text: "  whoami   — identity and status" },
        { type: "output", text: "  about    — same as whoami" },
        { type: "output", text: "  xp       — work experience" },
        { type: "output", text: "  edu      — education" },
        { type: "output", text: "  certs    — certifications" },
        { type: "output", text: "  skills   — skill domains" },
        { type: "output", text: "  langs    — languages" },
        { type: "output", text: "  hire     — apprenticeship info" },
        { type: "output", text: "  email    — contact email" },
        { type: "output", text: "  pgp      — pgp public key" },
        { type: "output", text: "  cv       — curriculum vitae" },
        { type: "output", text: "  clear    — reset terminal" },
      ];

    case "about":
    case "whoami":
      return [
        { type: "output", text: `${profile.fullName} · ${profile.age} · ${profile.city}` },
        { type: "output", text: "ISMS / GRC apprentice @ Arvato · Guardia · 3rd year" },
        { type: "output", text: profile.bio },
        { type: "output", text: `next availability: ${profile.available}` },
      ];

    case "hire":
      return [
        { type: "output", text: "currently: ISMS / GRC apprentice @ Arvato, Oct 2025 — Sept 2026." },
        { type: "output", text: "not available until Sept 2026." },
        { type: "output", text: "next: Mastère offensive/defensive (alternance), 2026 — 2028 — open to host companies." },
        { type: "output", text: "domains: GRC · Blue Team · DevSecOps." },
        { type: "output", text: `contact: ${profile.email}` },
      ];

    case "email":
      return [{ type: "output", text: profile.email }];

    case "pgp":
      return profile.pgpKey
        ? [{ type: "output", text: profile.pgpKey }]
        : [{ type: "output", text: "pgp key not yet uploaded." }];

    case "cv":
      return [
        { type: "output", text: `cv available at ${profile.siteUrl}/cv.pdf` },
        { type: "output", text: "Jordan Turnaco · ISMS · GRC · DevSecOps" },
      ];

    case "xp":
    case "experience":
      return profile.experience.flatMap((e, i) => [
        { type: "output" as const, text: `[${i + 1}] ${e.title} — ${e.company}` },
        { type: "output" as const, text: `    ${e.period}` },
        ...e.focus.map((f) => ({ type: "output" as const, text: `    · ${f}` })),
      ]);

    case "edu":
    case "education":
      return profile.education.map((e) => ({
        type: "output" as const,
        text: `${e.period}  ${e.school} — ${e.degree}`,
      }));

    case "certs":
    case "certifications":
      return [
        { type: "output" as const, text: "certifications:" },
        ...profile.certifications.map((c) => ({
          type: "output" as const,
          text: `  ${c.name} — ${c.status}`,
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
        text: `${l.lang.padEnd(10)} ${l.level}`,
      }));

    case "clear":
      return [{ type: "system", text: "__CLEAR__" }];

    case "sudo rm -rf /":
    case "sudo rm -rf /*":
    case "sudo rm -rf / --no-preserve-root":
      return [{ type: "error", text: "nice try." }];

    case "":
      return [];

    default:
      return [
        {
          type: "error",
          text: `command not found: ${raw.trim()}. type "help".`,
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
  const prefersReduced = useReducedMotion();

  const focusInput = useCallback(() => inputRef.current?.focus(), []);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Boot sequence — plays once when section enters viewport
  useEffect(() => {
    if (prefersReduced) {
      setOutput(WELCOME);
      return;
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

        // Staggered welcome lines
        WELCOME.forEach((line, i) => {
          timers.push(
            setTimeout(() => {
              setOutput((prev) => [...prev, line]);
            }, 350 + i * 260)
          );
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [prefersReduced]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal;
    setInputVal("");

    const result = runCommand(raw);
    const isClear = result.some((l) => l.text === "__CLEAR__");

    setOutput((prev) =>
      isClear
        ? WELCOME
        : [...prev, { type: "input" as const, text: raw }, ...result]
    );
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
      data-section-id="08"
      aria-label="Contact — Terminal"
      style={{
        backgroundColor: "var(--color-void)",
        padding: "clamp(3rem, 6vw, 6rem) clamp(1.5rem, 4vw, 3rem)",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Section label */}
      <div
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.65rem",
          color: "var(--color-blood)",
          letterSpacing: "0.1em",
          marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
        }}
      >
        {"08 // HANDSHAKE"}
      </div>

      {/* ── Terminal window frame ── */}
      <div
        ref={windowRef}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          border: "1px solid rgba(107,107,107,0.28)",
          boxShadow: [
            "inset 0 0 0 1px rgba(255,255,255,0.02)",
            "0 20px 80px rgba(0,0,0,0.55)",
            "0 0 120px rgba(230,57,70,0.04)",
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
              color: "rgba(107,107,107,0.35)",
              letterSpacing: "0.05em",
            }}
          >
            NULLSEC v1.0.0
          </span>
        </div>

        {/* ── Content wrapper: scanlines + scroll ── */}
        <div
          style={{ position: "relative", flex: 1, overflow: "hidden", cursor: "text" }}
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
            aria-label="Interactive terminal"
            aria-live="polite"
            style={{
              height: "100%",
              overflowY: "auto",
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
                style={{ color: lineColor(line.type), userSelect: "text" }}
              >
                {line.type === "input" ? (
                  <span>
                    <span
                      style={{
                        color: "var(--color-blood)",
                        textShadow: "0 0 10px rgba(230,57,70,0.45)",
                      }}
                    >
                      visitor@nullsec:~$
                    </span>{" "}
                    {line.text}
                  </span>
                ) : (
                  renderWithLinks(line.text)
                )}
              </div>
            ))}

            {/* Input line */}
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              aria-label="Terminal input"
            >
              <label
                htmlFor="terminal-input"
                style={{
                  color: "var(--color-blood)",
                  whiteSpace: "nowrap",
                  textShadow: "0 0 10px rgba(230,57,70,0.45)",
                }}
              >
                visitor@nullsec:~$
              </label>
              <input
                id="terminal-input"
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                aria-label="Terminal command input"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--color-bone)",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  letterSpacing: "inherit",
                  caretColor: "var(--color-blood)",
                }}
              />
            </form>
          </div>
        </div>
      </div>

      {/* Social links */}
      <div
        style={{
          marginTop: "clamp(2rem, 4vw, 3rem)",
          display: "flex",
          gap: "clamp(1.5rem, 3vw, 2.5rem)",
        }}
      >
        {[
          { label: "github", href: profile.github },
          { label: "linkedin", href: profile.linkedin },
          { label: "cv", href: profile.cvUrl },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href || "#"}
            aria-label={label}
            aria-disabled={!href}
            rel="noopener noreferrer"
            target={href ? "_blank" : undefined}
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.7rem",
              color: href ? "var(--color-ash)" : "rgba(107,107,107,0.3)",
              letterSpacing: "0.08em",
              textDecoration: "none",
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
          color: "rgba(107,107,107,0.4)",
          letterSpacing: "0.06em",
        }}
      >
        {"// xoudev — securing what others overlook."}
      </div>
    </section>
  );
}
