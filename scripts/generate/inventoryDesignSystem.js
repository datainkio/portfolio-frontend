/** @format */

/**
 * Inventories the design system as it exists in code.
 *
 * Reads three things: the tokens declared in styles/ (@theme and :root custom
 * properties) and js/choreography/tokens/, the custom utilities declared with
 * @utility, and every Tailwind utility class used by views/ (string literals
 * in .njk) and styles/ (@apply). It groups the classes by what a token would
 * govern — color, spacing, typography, radius, shadow, border width, z-index,
 * opacity, motion — and flags arbitrary values and off-palette colors, which
 * are the token candidates.
 *
 * Writes docs/design-system/inventory.json (complete) and inventory.md
 * (summary). Deterministic: same source → same files.
 *
 * USAGE:
 *   npm run inventory:design
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { glob } from "glob";
import prettier from "prettier";
import { projectRoot } from "../lib/paths.js";

const ROOT = projectRoot;
const OUT_DIR = path.join(ROOT, "docs/design-system");
const MOTION_TOKENS = path.join(
  ROOT,
  "js/choreography/tokens/motion/motion.js",
);

// ---------------------------------------------------------------------------
// Tokens declared in code
// ---------------------------------------------------------------------------

/** Every `--name: value;` inside the blocks that a selector regex opens. */
function customProps(css, blockRe) {
  const out = [];
  for (const m of css.matchAll(blockRe)) {
    for (const p of m[1].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
      out.push({ name: p[1], value: p[2].trim() });
    }
  }
  return out;
}

const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");
const stripNjkComments = (njk) => njk.replace(/\{#[\s\S]*?#\}/g, "");

function readTokens(cssFiles) {
  const theme = [];
  const root = [];
  const utilities = new Map(); // name -> file (first declaration)
  const classes = new Map(); // plain `.class` selectors declared in styles/
  for (const file of cssFiles) {
    const css = stripCssComments(
      fs.readFileSync(path.join(ROOT, file), "utf8"),
    );
    for (const t of customProps(css, /@theme\s*\{([^}]*)\}/g))
      theme.push({ ...t, file });
    for (const t of customProps(css, /:root\s*\{([^}]*)\}/g))
      root.push({ ...t, file });
    for (const m of css.matchAll(/@utility\s+(-?[\w-]+)(\*?)/g)) {
      const name = m[1] + m[2];
      if (!utilities.has(name)) utilities.set(name, file);
    }
    for (const m of css.matchAll(
      /(?:^|[\s,}])\.([a-z][\w-]*)(?=[\s,{:.>[+~#]|$)/gm,
    )) {
      if (!classes.has(m[1])) classes.set(m[1], file);
    }
  }
  const list = (map) => [...map].map(([name, file]) => [name, file]);
  return {
    theme,
    root,
    utilities: list(utilities).map(([name, file]) => ({ name, file })),
    classes: list(classes).map(([name, file]) => ({ name, file })),
  };
}

/** Color families declared in @theme: `--color-<family>-<shade>` or `--color-<family>`. */
function paletteFamilies(theme) {
  const families = {};
  for (const t of theme) {
    const m = /^color-([a-z]+)(?:-(\w+))?$/.exec(t.name);
    if (!m) continue;
    families[m[1]] ??= [];
    if (m[2]) families[m[1]].push(m[2]);
  }
  return families;
}

// ---------------------------------------------------------------------------
// Class extraction
// ---------------------------------------------------------------------------

/** Whitespace-separated words inside every "…" or '…' literal. */
function literalWords(src) {
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
function splitTemplateTags(src) {
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
function applyWords(css) {
  const words = [];
  for (const m of css.matchAll(/@apply\s+([^;]+);/g)) {
    for (const w of m[1].split(/\s+/)) if (w) words.push(w);
  }
  return words;
}

/** Strip variant prefixes (sm:, hover:, before:, [&>*]:) and a leading `-`. */
function splitVariants(cls) {
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

const COLOR_PROPS =
  "bg|text|border|border-x|border-y|border-t|border-r|border-b|border-l|border-s|border-e|outline|ring|ring-offset|fill|stroke|decoration|accent|caret|placeholder|shadow|from|via|to|divide";
const COLOR_RE = new RegExp(
  `^(${COLOR_PROPS})-(?:(white|black|transparent|current|inherit)|([a-z]+)-(\\d{2,3}))(?:/(\\d{1,3}))?$`,
);
// Longer alternatives first: `inset-x` must win over `inset`, or the value
// would read `x-0`.
const SPACING_RE =
  /^(px|py|pt|pr|pb|pl|ps|pe|p|mx|my|mt|mr|mb|ml|ms|me|m|gap-x|gap-y|gap|space-x|space-y|inset-x|inset-y|inset|top|right|bottom|left|start|end|min-w|max-w|min-h|max-h|w|h|size|basis|translate-x|translate-y|translate|indent|scroll-m[xytrbl]?|scroll-p[xytrbl]?)-(.+)$/;
const TYPE_SIZE_RE = /^text-(xs|sm|base|lg|xl|\dxl|\[.+\])$/;
const TYPE_WEIGHT_RE =
  /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/;
const TYPE_FAMILY_RE =
  /^font-(?!thin|extralight|light|normal|medium|semibold|bold|extrabold|black)([\w-]+|\[.+\])$/;
const TYPE_OTHER_RE =
  /^(leading-|tracking-|prose|uppercase|lowercase|capitalize|normal-case|italic|not-italic|underline|overline|line-through|no-underline|truncate|antialiased|subpixel-antialiased|text-(left|center|right|justify|start|end|balance|pretty|wrap|nowrap|ellipsis|clip)|whitespace-|break-|hyphens-|list-|decoration-(\d|solid|dashed|dotted|double|wavy|auto|from-font)|underline-offset-)/;
const RADIUS_RE = /^rounded/;
const SHADOW_RE =
  /^(shadow|inset-shadow|drop-shadow)(-(2xs|xs|sm|md|lg|xl|2xl|inner|none|\[.+\]))?$/;
const BORDER_WIDTH_RE =
  /^(border(-[xytrbls]|-e)?(-\d+|-\[.+\])?|divide-[xy](-\d+)?|ring(-\d+|-\[.+\])?|ring-inset|outline(-\d+|-\[.+\])?|outline-offset-\d+|border-(solid|dashed|dotted|double|hidden|none)|stroke-\d+)$/;
const Z_RE = /^z-/;
const OPACITY_RE = /^opacity-/;
const MOTION_RE = /^(transition|duration-|ease-|delay-|animate-|will-change-)/;
const LAYOUT_RE =
  /^(container|block|inline|inline-block|inline-flex|inline-grid|flex|grid|hidden|contents|flow-root|table|sr-only|not-sr-only|relative|absolute|fixed|sticky|static|isolate|visible|invisible|collapse|overflow-|overscroll-|items-|justify-|content-|self-|place-|order-|col-|row-|auto-cols-|auto-rows-|grid-|flex-|shrink|grow|basis-|float-|clear-|object-|aspect-|columns-|box-|align-|cursor-|pointer-events-|select-|resize|appearance-|touch-|snap-|scroll-|origin-|transform|scale-|rotate-|skew-|perspective|backface-|backdrop-|blur|brightness-|contrast-|grayscale|invert|saturate|sepia|hue-rotate-|mix-blend-|bg-blend-|bg-(cover|contain|auto|center|top|bottom|left|right|no-repeat|repeat|fixed|local|scroll|clip-|origin-|gradient-|linear-|radial-|conic-|none)|bg-\[|mask-|filter|forced-color-adjust-|field-sizing-|accent-auto|caret-|scheme-|image-rendering-|outline-none|ring-offset-|group|peer|dark|print|portrait|landscape|prose-)/;

/**
 * Classify one base class. Returns { category, detail } or null when the word
 * doesn't look like a utility at all.
 */
function classify(base, customUtilityPrefixes) {
  let m;
  if ((m = COLOR_RE.exec(base))) {
    return {
      category: "color",
      detail: {
        property: m[1],
        family: m[2] ?? m[3],
        shade: m[4] ?? null,
        alpha: m[5] ?? null,
      },
    };
  }
  if (TYPE_SIZE_RE.test(base))
    return {
      category: "typography",
      detail: { axis: "size", value: base.slice(5) },
    };
  if ((m = TYPE_WEIGHT_RE.exec(base)))
    return { category: "typography", detail: { axis: "weight", value: m[1] } };
  if ((m = TYPE_FAMILY_RE.exec(base)))
    return { category: "typography", detail: { axis: "family", value: m[1] } };
  if ((m = /^(leading|tracking)-(.+)$/.exec(base)))
    return { category: "typography", detail: { axis: m[1], value: m[2] } };
  if (TYPE_OTHER_RE.test(base))
    return { category: "typography", detail: { axis: "style", value: base } };
  if (RADIUS_RE.test(base))
    return { category: "radius", detail: { value: base } };
  if (SHADOW_RE.test(base))
    return { category: "shadow", detail: { value: base } };
  if (BORDER_WIDTH_RE.test(base))
    return { category: "border", detail: { value: base } };
  if (Z_RE.test(base))
    return { category: "z-index", detail: { value: base.slice(2) } };
  if (OPACITY_RE.test(base))
    return { category: "opacity", detail: { value: base.slice(8) } };
  if (MOTION_RE.test(base))
    return { category: "motion", detail: { value: base } };
  if ((m = SPACING_RE.exec(base)))
    return { category: "spacing", detail: { property: m[1], value: m[2] } };
  if (customUtilityPrefixes.some((p) => base === p || base.startsWith(p)))
    return { category: "custom", detail: { value: base } };
  if (LAYOUT_RE.test(base))
    return { category: "layout", detail: { value: base } };
  return null;
}

/** Tier from a views/ path: atoms, molecules, organisms, templates, pages, layouts, partials. */
function tierOf(file) {
  const m = /^views\/([^/]+)\//.exec(file);
  if (m) return m[1].replace(/^_/, "");
  if (file.startsWith("styles/")) return "styles";
  return "other";
}

// ---------------------------------------------------------------------------
// Aggregation
// ---------------------------------------------------------------------------

const inc = (obj, key, n = 1) => {
  obj[key] = (obj[key] ?? 0) + n;
};
const sortByCount = (obj) =>
  Object.fromEntries(
    Object.entries(obj).sort(([a, x], [b, y]) => y - x || a.localeCompare(b)),
  );
const sortKeys = (obj) =>
  Object.fromEntries(
    Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)),
  );

/** Numeric-aware sort for spacing scale keys like 0.5, 1, 2, 12, px, auto, full, [20px]. */
function scaleSort([a], [b]) {
  const na = parseFloat(a);
  const nb = parseFloat(b);
  const aNum = !Number.isNaN(na) && /^[\d.]+$/.test(a);
  const bNum = !Number.isNaN(nb) && /^[\d.]+$/.test(b);
  if (aNum && bNum) return na - nb;
  if (aNum) return -1;
  if (bNum) return 1;
  return a.localeCompare(b);
}

async function main() {
  const njkFiles = glob.sync("views/**/*.njk", { cwd: ROOT }).sort();
  const cssFiles = glob.sync("styles/**/*.css", { cwd: ROOT }).sort();

  const tokens = readTokens(cssFiles);
  const palette = paletteFamilies(tokens.theme);
  const motion = (await import(pathToFileURL(MOTION_TOKENS).href)).motionTokens;
  const customPrefixes = [
    ...tokens.utilities.map((u) => u.name.replace(/\*$/, "")),
    ...tokens.classes.map((c) => c.name),
  ];

  const files = [];
  const byCategory = {};
  const colors = {}; // family -> { uses, shades: {shade: n}, properties: {prop: n} }
  const spacing = {}; // value -> n
  const spacingByProperty = {}; // property -> n
  const typography = {
    size: {},
    weight: {},
    family: {},
    leading: {},
    tracking: {},
    style: {},
  };
  const simple = {
    radius: {},
    shadow: {},
    border: {},
    "z-index": {},
    opacity: {},
    motion: {},
    custom: {},
  };
  const arbitrary = {}; // class -> { uses, files: Set }
  const variants = {};
  const unclassified = {};
  const tierTotals = {};

  for (const file of [...njkFiles, ...cssFiles]) {
    const raw = fs.readFileSync(path.join(ROOT, file), "utf8");
    const words = file.endsWith(".css")
      ? applyWords(stripCssComments(raw))
      : literalWords(stripNjkComments(raw));
    const tier = tierOf(file);
    const classes = {};
    const localUnclassified = {};

    for (const word of words) {
      if (!/^-?[a-z\[]/.test(word) || /[{}|()=,;"']/.test(word)) continue;
      if (word.split("[").length !== word.split("]").length) continue;
      const { variants: vs, base, negative } = splitVariants(word);
      const hit = classify(base, customPrefixes);
      if (!hit) {
        if (/^[a-z][a-z0-9]*(-[a-z0-9\[\]./%]+)+$/.test(base))
          inc(localUnclassified, word);
        continue;
      }
      inc(classes, word);
      for (const v of vs) inc(variants, v);
      byCategory[hit.category] ??= {};
      inc(byCategory[hit.category], word);
      if (word.includes("[")) {
        arbitrary[word] ??= {
          uses: 0,
          category: hit.category,
          files: new Set(),
        };
        arbitrary[word].uses += 1;
        arbitrary[word].files.add(file);
      }
      const d = hit.detail;
      switch (hit.category) {
        case "color": {
          const fam = (colors[d.family] ??= {
            uses: 0,
            shades: {},
            properties: {},
          });
          fam.uses += 1;
          if (d.shade) inc(fam.shades, d.shade);
          inc(fam.properties, d.property);
          break;
        }
        case "spacing":
          inc(spacing, (negative ? "-" : "") + d.value);
          inc(spacingByProperty, d.property);
          break;
        case "typography":
          inc(typography[d.axis], d.value);
          break;
        case "layout":
          break;
        default:
          inc(simple[hit.category], d.value);
      }
    }

    for (const [k, n] of Object.entries(localUnclassified))
      inc(unclassified, k, n);
    const t = (tierTotals[tier] ??= { files: 0, uses: 0, distinct: new Set() });
    t.files += 1;
    for (const [k, n] of Object.entries(classes)) {
      t.uses += n;
      t.distinct.add(k);
    }
    files.push({ file, tier, classes: sortByCount(classes) });
  }

  const paletteNames = Object.keys(palette);
  const BUILT_IN = new Set([
    "white",
    "black",
    "transparent",
    "current",
    "inherit",
  ]);
  const colorsOut = Object.fromEntries(
    Object.entries(colors)
      .sort(([a, x], [b, y]) => y.uses - x.uses || a.localeCompare(b))
      .map(([family, v]) => [
        family,
        {
          uses: v.uses,
          source: paletteNames.includes(family)
            ? "figma"
            : BUILT_IN.has(family)
              ? "built-in"
              : "tailwind-default",
          shades: Object.fromEntries(Object.entries(v.shades).sort(scaleSort)),
          properties: sortByCount(v.properties),
        },
      ]),
  );

  const inventory = {
    scanned: { njk: njkFiles.length, css: cssFiles.length },
    tokens: {
      theme: tokens.theme,
      root: tokens.root,
      utilities: tokens.utilities,
      classes: tokens.classes,
      motion,
      palette,
    },
    tiers: Object.fromEntries(
      Object.entries(tierTotals)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [
          k,
          { files: v.files, uses: v.uses, distinct: v.distinct.size },
        ]),
    ),
    colors: colorsOut,
    spacing: {
      values: Object.fromEntries(Object.entries(spacing).sort(scaleSort)),
      properties: sortByCount(spacingByProperty),
    },
    typography: Object.fromEntries(
      Object.entries(typography).map(([k, v]) => [k, sortByCount(v)]),
    ),
    ...Object.fromEntries(
      Object.entries(simple).map(([k, v]) => [k, sortByCount(v)]),
    ),
    arbitrary: Object.fromEntries(
      Object.entries(arbitrary)
        .sort(([a, x], [b, y]) => y.uses - x.uses || a.localeCompare(b))
        .map(([k, v]) => [k, { ...v, files: [...v.files].sort() }]),
    ),
    variants: sortByCount(variants),
    byCategory: Object.fromEntries(
      Object.entries(byCategory)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, sortByCount(v)]),
    ),
    unclassified: sortByCount(unclassified),
    files,
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const jsonPath = path.join(OUT_DIR, "inventory.json");
  const mdPath = path.join(OUT_DIR, "inventory.md");
  fs.writeFileSync(jsonPath, JSON.stringify(inventory, null, 2) + "\n");
  const md = await prettier.format(renderMarkdown(inventory), {
    parser: "markdown",
  });
  fs.writeFileSync(mdPath, md);

  const distinct = new Set(files.flatMap((f) => Object.keys(f.classes))).size;
  console.log(
    `Inventoried ${njkFiles.length} templates and ${cssFiles.length} stylesheets: ` +
      `${distinct} distinct utilities, ${Object.keys(arbitrary).length} arbitrary, ` +
      `${Object.keys(unclassified).length} unclassified.\n→ ${path.relative(ROOT, mdPath)}, ${path.relative(ROOT, jsonPath)}`,
  );
}

// ---------------------------------------------------------------------------
// Markdown summary
// ---------------------------------------------------------------------------

function table(headers, rows) {
  if (!rows.length) return "_none_\n";
  const line = (cells) => `| ${cells.join(" | ")} |`;
  return (
    [
      line(headers),
      line(headers.map(() => "---")),
      ...rows.map((r) => line(r.map(String))),
    ].join("\n") + "\n"
  );
}

const countRows = (obj, limit = Infinity) =>
  Object.entries(obj)
    .slice(0, limit)
    .map(([k, n]) => [`\`${k}\``, n]);

function renderMarkdown(inv) {
  const total = Object.values(inv.tiers).reduce((n, t) => n + t.uses, 0);
  const sections = [];
  const push = (s) => sections.push(s);

  push(`---
title: "Design system inventory"
description: "Generated inventory of the design tokens declared in code and every Tailwind utility the templates and stylesheets use, grouped by what a token would govern. Regenerate with npm run inventory:design; never edit by hand."
type: reference
status: active
tags:
  - design-system
  - design-tokens
  - tailwind
  - generated
links:
  - "[inventoryDesignSystem.js](../../scripts/generate/inventoryDesignSystem.md)"
  - "[colors.css](../../styles/colors.css)"
  - "[motion.js](../../js/choreography/tokens/motion/motion.md)"
---

# Design system inventory

Generated by \`npm run inventory:design\` from \`views/**/*.njk\` and \`styles/**/*.css\`. The complete data, including per-file class lists, is written to \`inventory.json\` next to this file. It stays out of git, because Tailwind scans tracked files.

## Scope

| Tier | Files | Utility uses | Distinct utilities |
| --- | --- | --- | --- |
${Object.entries(inv.tiers)
  .map(([k, v]) => `| ${k} | ${v.files} | ${v.uses} | ${v.distinct} |`)
  .join("\n")}
| **all** | ${inv.scanned.njk + inv.scanned.css} | ${total} | ${new Set(Object.values(inv.byCategory).flatMap(Object.keys)).size} |
`);

  // Tokens declared
  const themeByPrefix = {};
  for (const t of inv.tokens.theme) {
    const prefix = t.name.split("-")[0];
    themeByPrefix[prefix] ??= [];
    themeByPrefix[prefix].push(t);
  }
  push(`## Tokens declared in code

### \`@theme\` (Tailwind namespace)

${table(
  ["Namespace", "Tokens", "File"],
  Object.entries(themeByPrefix).map(([p, ts]) => [
    `\`--${p}-*\``,
    ts.length,
    [...new Set(ts.map((t) => t.file))].map((f) => `\`${f}\``).join(", "),
  ]),
)}
Color families: ${Object.entries(inv.tokens.palette)
    .map(
      ([f, s]) => `\`${f}\` (${s.length ? s.length + " shades" : "1 value"})`,
    )
    .join(", ")}.

### \`:root\` custom properties

${table(
  ["Property", "Value", "File"],
  inv.tokens.root.map((t) => [
    `\`--${t.name}\``,
    `\`${t.value}\``,
    `\`${t.file}\``,
  ]),
)}
### Motion tokens (\`js/choreography/tokens/motion/motion.js\`)

${table(
  ["Group", "Keys"],
  Object.entries(inv.tokens.motion).map(([g, v]) => [
    `\`${g}\``,
    Object.entries(v)
      .map(([k, x]) => `\`${k}\`=${x}`)
      .join(", "),
  ]),
)}
These exist only in JavaScript. Nothing in \`styles/\` reads them, so CSS transitions (the \`motion\` rows below) use Tailwind defaults.

### Custom utilities (\`@utility\`)

${table(
  ["Utility", "File"],
  inv.tokens.utilities.map((u) => [`\`${u.name}\``, `\`${u.file}\``]),
)}
### Plain classes declared in \`styles/\`

Selectors written as \`.name\` rather than \`@utility\`, so they take no variants.

${table(
  ["Class", "File"],
  inv.tokens.classes.map((c) => [`\`${c.name}\``, `\`${c.file}\``]),
)}`);

  // Colors
  push(`## Color

Families by use. \`figma\` means the family is declared in \`styles/colors.css\`; \`tailwind-default\` means it only exists because Tailwind ships it, so Figma has no record of it.

${table(
  ["Family", "Uses", "Source", "Shades used", "Properties"],
  Object.entries(inv.colors).map(([f, v]) => [
    `\`${f}\``,
    v.uses,
    v.source,
    Object.entries(v.shades)
      .map(([s, n]) => `${s} (${n})`)
      .join(", ") || "—",
    Object.entries(v.properties)
      .map(([p, n]) => `${p} (${n})`)
      .join(", "),
  ]),
)}`);

  // Spacing
  push(`## Spacing

Scale values used by padding, margin, gap, inset, size, and translate utilities. Arbitrary values (\`[…]\`) are off-scale.

${table(["Value", "Uses"], countRows(inv.spacing.values))}
By property:

${table(["Property", "Uses"], countRows(inv.spacing.properties))}`);

  // Typography
  push(`## Typography

${["size", "weight", "family", "leading", "tracking"]
  .map(
    (axis) => `### ${axis[0].toUpperCase() + axis.slice(1)}

${table(["Value", "Uses"], countRows(inv.typography[axis]))}`,
  )
  .join("\n")}
### Style utilities

${table(["Utility", "Uses"], countRows(inv.typography.style, 30))}`);

  // Simple categories
  for (const [key, title, note] of [
    ["radius", "Radius", ""],
    ["shadow", "Shadow", ""],
    ["border", "Border width and style", ""],
    ["z-index", "Z-index", "Compare with the `zLayer` motion tokens above."],
    ["opacity", "Opacity", ""],
    [
      "motion",
      "Motion (CSS)",
      "Tailwind transition, duration, ease, and delay utilities.",
    ],
    ["custom", "Custom utilities in use", ""],
  ]) {
    push(`## ${title}

${note ? note + "\n\n" : ""}${table(["Value", "Uses"], countRows(inv[key]))}`);
  }

  // Arbitrary
  push(`## Arbitrary values

Every \`[…]\` utility. Each one is a value the scale doesn't have; recurring ones are token candidates.

${table(
  ["Utility", "Category", "Uses", "Files"],
  Object.entries(inv.arbitrary).map(([k, v]) => [
    `\`${k}\``,
    v.category,
    v.uses,
    v.files.map((f) => `\`${f.replace(/^views\//, "")}\``).join(", "),
  ]),
)}`);

  // Variants
  push(`## Variants

Responsive and state prefixes, by use.

${table(["Variant", "Uses"], countRows(inv.variants, 25))}`);

  // Unclassified
  push(`## Unclassified

Hyphenated words in string literals that no rule recognised. Mostly data keys and ids; anything that is a utility here is a gap in the script.

${table(["Word", "Uses"], countRows(inv.unclassified, 40))}`);

  return sections.join("\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
