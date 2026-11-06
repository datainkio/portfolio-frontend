/** @format */

/**
 * Seeds the Figma-owned token layer from what the site renders today.
 *
 * Reads docs/design-system/inventory.json for the values in use, and takes each
 * value from Tailwind's default theme or from the shadows already declared in
 * styles/. Writes:
 *
 *   styles/tokens.css                     the same values, as explicit tokens
 *   docs/design-system/figma-worklist.md  the exact styles and layers to create
 *                                         in Figma, so the sync reproduces them
 *
 * Only for the period before the Figma Tokens page exists. Once it does,
 * npm run build:design owns styles/tokens.css, and running this would overwrite
 * Figma's values.
 *
 * USAGE:
 *   npm run seed:tokens
 */

import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import { projectRoot } from "../lib/paths.js";
import { write as writeTokens } from "../../figma/views/tailwind/TokensFile.js";

const ROOT = projectRoot;
const inventory = JSON.parse(
  fs.readFileSync(path.join(ROOT, "docs/design-system/inventory.json"), "utf8"),
);

const defaults = Object.fromEntries(
  [
    ...fs
      .readFileSync(
        path.join(ROOT, "node_modules/tailwindcss/theme.css"),
        "utf8",
      )
      .matchAll(/^\s*--([\w-]+):\s*(.+);\s*$/gm),
  ].map((m) => [m[1], m[2]]),
);

const SPACING_UNIT_REM = parseFloat(defaults.spacing);
const isScaleNumber = (v) => /^[\d.]+$/.test(v) && Number(v) > 0;
const pick = (values, prefix) =>
  Object.keys(values).filter((v) => `${prefix}-${v}` in defaults);

// ---------------------------------------------------------------------------
// Token set
// ---------------------------------------------------------------------------

// `leading-6` reads the spacing scale, so its numbers belong to spacing.
const spacingKeys = [
  ...Object.keys(inventory.spacing.values).map((v) => v.replace(/^-/, "")),
  ...Object.keys(inventory.typography.leading),
].filter(isScaleNumber);

const radiusNames = Object.keys(inventory.radius)
  .map((r) => r.replace(/^rounded-?/, "") || "DEFAULT")
  .filter((r) => r !== "none");

const declaredShadows = Object.fromEntries(
  inventory.tokens.theme
    .filter((t) => t.name.startsWith("shadow-"))
    .map((t) => [t.name.slice("shadow-".length), t.value]),
);
// The site's shadows differ from Tailwind's. Seeding without them would silently
// fall back to the defaults and change how every shadow renders.
if (!Object.keys(declaredShadows).length) {
  throw new Error(
    "No --shadow-* tokens found in docs/design-system/inventory.json. Run npm run inventory:design with the shadows declared in styles/.",
  );
}
const usedShadows = Object.keys(inventory.shadow)
  .map((s) => s.replace(/^shadow-?/, ""))
  .filter(Boolean);

const tokens = {
  spacing: Object.fromEntries(
    [...new Set(spacingKeys)].map((k) => [
      k,
      `${Number((Number(k) * SPACING_UNIT_REM).toFixed(4))}rem`,
    ]),
  ),
  container: Object.fromEntries(
    pick(inventory.spacing.values, "container").map((k) => [
      k,
      defaults[`container-${k}`],
    ]),
  ),
  radius: Object.fromEntries(
    radiusNames.map((k) => [
      k,
      defaults[k === "DEFAULT" ? "radius" : `radius-${k}`],
    ]),
  ),
  shadow: {
    ...Object.fromEntries(usedShadows.map((k) => [k, defaults[`shadow-${k}`]])),
    ...declaredShadows,
  },
  text: Object.fromEntries(
    pick(inventory.typography.size, "text").map((k) => [
      k,
      {
        size: defaults[`text-${k}`],
        lineHeight: defaults[`text-${k}--line-height`],
      },
    ]),
  ),
  "font-weight": Object.fromEntries(
    pick(inventory.typography.weight, "font-weight").map((k) => [
      k,
      defaults[`font-weight-${k}`],
    ]),
  ),
  leading: Object.fromEntries(
    pick(inventory.typography.leading, "leading").map((k) => [
      k,
      defaults[`leading-${k}`],
    ]),
  ),
  tracking: Object.fromEntries(
    pick(inventory.typography.tracking, "tracking").map((k) => [
      k,
      defaults[`tracking-${k}`],
    ]),
  ),
};

// ---------------------------------------------------------------------------
// Slate, as hex for Figma paint styles
// ---------------------------------------------------------------------------

/** oklch(L C H) → #rrggbb, via OKLab and linear sRGB. */
export function oklchToHex(css) {
  const [L, C, H] = /oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\)/
    .exec(css)
    .slice(1)
    .map(Number);
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  const encode = (c) => {
    const v = Math.min(1, Math.max(0, c));
    return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  };
  return (
    "#" +
    linear
      .map((c) =>
        Math.round(encode(c) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

const slate = Object.entries(defaults)
  .filter(([k]) => /^color-slate-\d+$/.test(k))
  .map(([k, v]) => [k.replace("color-slate-", ""), oklchToHex(v)])
  .sort(([a], [b]) => Number(a) - Number(b));

// ---------------------------------------------------------------------------
// Worklist
// ---------------------------------------------------------------------------

const toPx = (rem) => `${Number((parseFloat(rem) * 16).toFixed(3))}px`;
const scaleOrder = ([a], [b]) => {
  const [x, y] = [Number(a), Number(b)];
  return Number.isNaN(x) || Number.isNaN(y) ? 0 : x - y;
};
const rows = (headers, list) =>
  [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...list.map((r) => `| ${r.join(" | ")} |`),
  ].join("\n");

/** Evaluates `calc(1.25 / 0.875)` or `1` to a ratio of the font size. */
function ratio(lineHeight) {
  const m = /calc\(([\d.]+)\s*\/\s*([\d.]+)\)/.exec(lineHeight);
  return m ? Number(m[1]) / Number(m[2]) : Number(lineHeight);
}

function worklist() {
  const entries = (g) => Object.entries(tokens[g]).sort(scaleOrder);
  return `---
title: "Figma token worklist"
description: "Generated list of the paint styles and Tokens page layers to create in Figma so the sync reproduces what the site renders today. Regenerate with npm run seed:tokens; never edit by hand."
type: reference
status: active
tags:
  - design-system
  - design-tokens
  - figma
  - generated
links:
  - "[Decision](adr-0001-figma-owns-design-tokens.md)"
  - "[TokenService](../../figma/services/TokenService.md)"
---

# Figma token worklist

Create everything below in Figma, then set \`FIGMA_TOKEN\` and \`FIGMA_FILE_ID\` in \`.env\` and run \`npm run build:design\`. Review the first sync with \`git diff styles/\` before committing. If the values below match, the tokens resolve as they do today, and slate changes only from oklch to the nearest hex. The sync also rewrites the other colours and fonts from the live file, and they haven't been compared with Figma since October 2025, so any difference there is drift to look at.

Figma's REST API can't create styles or layers, so this is manual work.

## 1. Slate paint styles

Create each as a paint style named exactly as shown. The hex values are Tailwind's default slate converted from oklch.

${rows(
  ["Style", "Hex"],
  slate.map(([k, hex]) => [`\`slate/${k}\``, `\`${hex}\``]),
)}

## 2. A page named \`Tokens\`

Each layer below is one token. The name must match exactly, and other layers on the page are ignored, so you can add labels.

### Spacing: rectangles, width sets the value

${rows(
  ["Layer", "Width"],
  entries("spacing").map(([k, v]) => [`\`spacing/${k}\``, toPx(v)]),
)}

### Containers: rectangles, width sets the value

${rows(
  ["Layer", "Width"],
  entries("container").map(([k, v]) => [`\`container/${k}\``, toPx(v)]),
)}

### Radius: rectangles, corner radius sets the value

${rows(
  ["Layer", "Corner radius"],
  entries("radius").map(([k, v]) => [`\`radius/${k}\``, toPx(v)]),
)}

### Shadow: rectangles, drop shadow effects set the value

Values read as x, y, blur, spread, colour. A comma means a second effect on the same layer.

${rows(
  ["Layer", "Effects"],
  entries("shadow").map(([k, v]) => [`\`shadow/${k}\``, `\`${v}\``]),
)}

### Type size: text layers, font size and line height set the value

${rows(
  ["Layer", "Font size", "Line height"],
  entries("text").map(([k, { size, lineHeight }]) => [
    `\`text/${k}\``,
    toPx(size),
    `${Number((parseFloat(size) * 16 * ratio(lineHeight)).toFixed(3))}px`,
  ]),
)}

### Font weight: text layers, font weight sets the value

${rows(
  ["Layer", "Weight"],
  entries("font-weight").map(([k, v]) => [`\`font-weight/${k}\``, v]),
)}

### Line height: text layers at 100px, line height sets the ratio

${rows(
  ["Layer", "Line height at 100px"],
  entries("leading").map(([k, v]) => [
    `\`leading/${k}\``,
    `${Number(v) * 100}px`,
  ]),
)}

### Letter spacing: text layers at 100px, letter spacing sets the value

${rows(
  ["Layer", "Letter spacing at 100px"],
  entries("tracking").map(([k, v]) => [
    `\`tracking/${k}\``,
    `${Number((parseFloat(v) * 100).toFixed(3))}px`,
  ]),
)}
`;
}

await writeTokens(tokens, {
  source: "Seeded from current rendering; awaiting the Figma Tokens page",
});
const out = path.join(ROOT, "docs/design-system/figma-worklist.md");
fs.writeFileSync(
  out,
  await prettier.format(worklist(), { parser: "markdown" }),
);

console.log(
  `Seeded styles/tokens.css with ${Object.values(tokens).reduce((n, g) => n + Object.keys(g).length, 0)} tokens.\n→ ${path.relative(ROOT, out)}`,
);
