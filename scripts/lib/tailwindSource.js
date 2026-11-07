/** @format */

/**
 * Reads Tailwind utility classes and theme tokens from source files. Shared by
 * the design-system inventory (scripts/generate/) and the palette lint
 * (scripts/lint/), so both see the same classes.
 */

/** Every `--name: value;` inside the blocks that a selector regex opens. */
export function customProps(css, blockRe) {
  const out = [];
  for (const m of css.matchAll(blockRe)) {
    for (const p of m[1].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
      out.push({ name: p[1], value: p[2].trim() });
    }
  }
  return out;
}

export const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");
export const stripNjkComments = (njk) => njk.replace(/\{#[\s\S]*?#\}/g, "");

/** Whitespace-separated words inside every "…" or '…' literal. */
export function literalWords(src) {
  const { strings, html } = splitTemplateTags(src);
  for (const m of html.matchAll(/"([^"\n]*)"|'([^'\n]*)'/g)) {
    strings.push(m[1] ?? m[2]);
  }
  return strings.flatMap((s) => s.split(/\s+/).filter(Boolean));
}

/**
 * Separates Nunjucks tags from the HTML around them. `class="{{ {"a": "b"} }}"`
 * nests quotes, so a single quote-pairing pass over the raw source reads the
 * tag's strings inside out and misses them. Tag strings are collected here, and
 * the tag is blanked out of the HTML so its quotes can't pair with the
 * attribute's.
 */
export function splitTemplateTags(src) {
  const strings = [];
  let html = "";
  let i = 0;
  while (i < src.length) {
    const open = src.slice(i, i + 2);
    if (open !== "{{" && open !== "{%") {
      html += src[i++];
      continue;
    }
    const close = open === "{{" ? "}}" : "%}";
    let depth = 0;
    i += 2;
    while (i < src.length) {
      const ch = src[i];
      if (ch === '"' || ch === "'") {
        let value = "";
        i += 1;
        while (i < src.length && src[i] !== ch) {
          if (src[i] === "\\") i += 1;
          value += src[i++] ?? "";
        }
        strings.push(value);
        i += 1;
      } else if (depth === 0 && src.startsWith(close, i)) {
        i += 2;
        break;
      } else {
        if (ch === "{") depth += 1;
        if (ch === "}" && depth > 0) depth -= 1;
        i += 1;
      }
    }
    html += " ";
  }
  return { strings, html };
}

/** Words on every `@apply …;` line. */
export function applyWords(css) {
  const words = [];
  for (const m of css.matchAll(/@apply\s+([^;]+);/g)) {
    for (const w of m[1].split(/\s+/)) if (w) words.push(w);
  }
  return words;
}

/** Strip variant prefixes (sm:, hover:, before:, [&>*]:) and a leading `-`. */
export function splitVariants(cls) {
  const variants = [];
  let rest = cls;
  // A variant is `name:` or `[…]:` at the start; stop at the first `[` that
  // isn't itself a variant, so arbitrary values keep their colons.
  for (;;) {
    const m = /^((?:[a-z0-9-]+|\[[^\]]*\]|[a-z0-9-]+\[[^\]]*\]):)/.exec(rest);
    if (!m) break;
    variants.push(m[1].slice(0, -1));
    rest = rest.slice(m[1].length);
  }
  const negative = rest.startsWith("-") && rest.length > 1;
  if (negative) rest = rest.slice(1);
  return { variants, base: rest, negative };
}

export const COLOR_PROPS =
  "bg|text|border|border-x|border-y|border-t|border-r|border-b|border-l|border-s|border-e|outline|ring|ring-offset|fill|stroke|decoration|accent|caret|placeholder|shadow|from|via|to|divide";
export const COLOR_RE = new RegExp(
  `^(${COLOR_PROPS})-(?:(white|black|transparent|current|inherit)|([a-z]+)-(\\d{2,3}))(?:/(\\d{1,3}))?$`,
);
