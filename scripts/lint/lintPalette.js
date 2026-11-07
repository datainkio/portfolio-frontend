#!/usr/bin/env node
/** @format */

/**
 * Palette lint
 *
 * Fails when a template in views/ or a hand-written stylesheet in styles/
 * puts a colour on the page that doesn't come from the palette in
 * styles/colors.css. Tailwind's default palette is still loaded, so a `blue`
 * background or a `neutral-150` text colour would build without complaint.
 * Report-only; never writes.
 *
 * Four rules:
 *   off-palette        a colour utility (built in, or an @utility that reads
 *                      --color-*) names a <family>-<shade> that isn't declared
 *   literal            a colour written as a value: hex, rgb(), oklch(), a
 *                      named colour. Use var(--color-…) instead
 *   undeclared-var     var(--color-…) names a colour that isn't declared
 *   declared-outside   a --color-… custom property declared anywhere but
 *                      styles/colors.css, which the Figma sync owns
 *
 * Enforces specs/design-system.spec.md, rule "Colour comes from the palette".
 * Examples name families, not full classes, because Tailwind would generate
 * CSS for a full class name written in a scanned file.
 *
 * USAGE:
 *   npm run lint:palette
 */

import fs from "node:fs";
import path from "node:path";
import { glob } from "glob";
import chalk from "chalk";
import { projectRoot } from "../lib/paths.js";
import {
  applyWords,
  COLOR_RE,
  customProps,
  literalWords,
  splitVariants,
  stripNjkComments,
} from "../lib/tailwindSource.js";

const PALETTE_FILE = "styles/colors.css";
/** Written by the Figma and motion syncs; they define the palette, not use it. */
const GENERATED = new Set([
  PALETTE_FILE,
  "styles/tokens.css",
  "styles/motion.css",
]);

const read = (file) => fs.readFileSync(path.join(projectRoot, file), "utf8");

/** Blank out CSS comments, keeping newlines so offsets still map to lines. */
const blankCssComments = (css) =>
  css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));

const lineAt = (text, index) => text.slice(0, index).split("\n").length;

/** Colour names declared in the palette, plus the two Tailwind built-ins. */
const declared = new Set([
  "black",
  "white",
  ...customProps(read(PALETTE_FILE), /@theme\s*\{([^}]*)\}/g)
    .filter((t) => t.name.startsWith("color-"))
    .map((t) => t.name.slice("color-".length)),
]);

const cssFiles = glob.sync("styles/**/*.css", { cwd: projectRoot }).sort();
const handWritten = cssFiles.filter((f) => !GENERATED.has(f));

/**
 * Functional @utility names (`bg-halftone` for `@utility bg-halftone-*`), and
 * the ones whose body reads a theme colour. A name can be declared more than
 * once with different value types; any colour declaration makes it a colour
 * utility.
 */
const functionalUtilities = new Set();
const colourUtilities = new Set();
for (const file of handWritten) {
  const css = blankCssComments(read(file));
  for (const m of css.matchAll(/@utility\s+-?([\w-]+)-\*\s*\{/g)) {
    functionalUtilities.add(m[1]);
    let depth = 1;
    let i = m.index + m[0].length;
    const start = i;
    while (i < css.length && depth) {
      if (css[i] === "{") depth += 1;
      if (css[i] === "}") depth -= 1;
      i += 1;
    }
    if (css.slice(start, i).includes("--value(--color"))
      colourUtilities.add(m[1]);
  }
}

const SHADE = /^([a-z]+-\d{2,3})(?:\/[\w.%[\]]+)?$/;
const LITERAL_RE =
  /#[0-9a-fA-F]{3,8}\b|(?<![\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(|(?<![\w-])(?:black|white|red|green|blue|yellow|orange|purple|pink|gray|grey)(?![\w-])/g;
const VAR_RE = /var\(\s*--color-([\w-]+)/g;
const DECL_RE = /(?<![\w-])--color-([\w-]+)\s*:/g;

/** Findings for one value: colour literals and undeclared colour variables. */
function checkValue(text) {
  const out = [];
  for (const m of text.matchAll(LITERAL_RE))
    out.push({ rule: "literal", detail: m[0], index: m.index });
  for (const m of text.matchAll(VAR_RE))
    if (!declared.has(m[1]))
      out.push({
        rule: "undeclared-var",
        detail: `--color-${m[1]}`,
        index: m.index,
      });
  return out;
}

/** Findings for one utility class. */
function checkClass(word) {
  const base = splitVariants(word).base.replace(/^!|!$/g, "");
  const out = [];

  const m = COLOR_RE.exec(base);
  if (m?.[3] && !declared.has(`${m[3]}-${m[4]}`))
    out.push({ rule: "off-palette", detail: word });

  const prefix = [...functionalUtilities]
    .filter((p) => base.startsWith(`${p}-`))
    .sort((a, b) => b.length - a.length)[0];
  if (prefix && colourUtilities.has(prefix)) {
    const shade = SHADE.exec(base.slice(prefix.length + 1));
    if (shade && !declared.has(shade[1]))
      out.push({ rule: "off-palette", detail: word });
  }

  for (const b of base.matchAll(/\[([^\]]*)\]/g))
    for (const f of checkValue(b[1].replace(/_/g, " ")))
      out.push({ rule: f.rule, detail: `${f.detail} in ${word}` });
  return out;
}

const findings = []; // { rule, file, line, detail }
const seen = new Set();
const report = (rule, file, line, detail) => {
  const key = `${rule}|${file}|${line}|${detail}`;
  if (seen.has(key)) return;
  seen.add(key);
  findings.push({ rule, file, line, detail });
};

const templates = glob.sync("views/**/*.njk", { cwd: projectRoot }).sort();
for (const file of templates) {
  const raw = read(file);
  for (const word of literalWords(stripNjkComments(raw)))
    for (const f of checkClass(word))
      report(f.rule, file, lineAt(raw, raw.indexOf(word)), f.detail);
}

for (const file of handWritten) {
  const css = blankCssComments(read(file));
  for (const word of applyWords(css))
    for (const f of checkClass(word))
      report(f.rule, file, lineAt(css, css.indexOf(word)), f.detail);
  // Declaration values: the innermost blocks, with @apply lines blanked out.
  for (const block of css.matchAll(/\{([^{}]*)\}/g)) {
    const body = block[1].replace(/@apply[^;]*;/g, (a) => " ".repeat(a.length));
    for (const f of checkValue(body))
      report(f.rule, file, lineAt(css, block.index + 1 + f.index), f.detail);
  }
  for (const m of css.matchAll(DECL_RE))
    report("declared-outside", file, lineAt(css, m.index), `--color-${m[1]}`);
}

const RULES = [
  ["off-palette", "colour utility names a colour not in styles/colors.css"],
  ["literal", "colour written as a value; use var(--color-…)"],
  ["undeclared-var", "var(--color-…) names a colour not in styles/colors.css"],
  [
    "declared-outside",
    "colours are declared only in styles/colors.css, by the Figma sync",
  ],
];

console.log(chalk.bold("\n  Palette lint\n"));
if (!findings.length) {
  console.log(
    chalk.green(
      `  clean — ${templates.length} templates and ${handWritten.length} stylesheets use only the ${declared.size} palette colours\n`,
    ),
  );
  process.exit(0);
}
findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
for (const [rule, blurb] of RULES) {
  const hits = findings.filter((f) => f.rule === rule);
  if (!hits.length) continue;
  console.log(
    `  ${chalk.red(String(hits.length).padStart(4))}  ${chalk.bold(rule)} — ${blurb}`,
  );
  for (const { file, line, detail } of hits)
    console.log(chalk.dim(`         ${file}:${line}  ${detail}`));
}
console.log(
  chalk.yellow(`\n  ${findings.length} findings.`),
  chalk.dim(
    "Use a step of a palette family, semantic-* for states, or var(--color-black|white).\n",
  ),
);
process.exit(1);
