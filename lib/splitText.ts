/**
 * Custom text-split utilities — no SplitText plugin required.
 * Wraps each character (or word) in an inline-block <span> so GSAP
 * can apply transforms independently.
 */

export interface SplitResult {
  chars: HTMLSpanElement[];
  restore: () => void;
}

/**
 * Splits the text content of an element into individual character spans.
 * Spaces become non-breaking spaces to preserve word spacing.
 */
export function splitChars(el: HTMLElement): SplitResult {
  const original = el.innerHTML;
  const text = el.textContent ?? "";
  el.textContent = "";
  el.setAttribute("aria-label", text); // preserve accessible text

  const chars: HTMLSpanElement[] = text.split("").map((char) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.display = "inline-block";
    span.style.willChange = "transform, opacity";
    el.appendChild(span);
    return span;
  });

  return {
    chars,
    restore: () => {
      el.innerHTML = original;
      el.removeAttribute("aria-label");
    },
  };
}

/**
 * Splits text into word spans. Preserves line breaks if the element
 * contains multiple text nodes (i.e. <br> between lines).
 */
export function splitWords(el: HTMLElement): {
  words: HTMLSpanElement[];
  restore: () => void;
} {
  const original = el.innerHTML;
  const text = el.textContent ?? "";
  el.textContent = "";
  el.setAttribute("aria-label", text);

  const wordList = text.split(/\s+/).filter(Boolean);
  const words: HTMLSpanElement[] = wordList.map((word, i) => {
    const span = document.createElement("span");
    span.textContent = word;
    span.style.display = "inline-block";
    span.style.willChange = "transform, opacity";
    if (i < wordList.length - 1) span.style.marginRight = "0.3em";
    el.appendChild(span);
    return span;
  });

  return {
    words,
    restore: () => {
      el.innerHTML = original;
      el.removeAttribute("aria-label");
    },
  };
}
