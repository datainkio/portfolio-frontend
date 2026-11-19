#!/usr/bin/env node
/** @format */

/**
 * Palette lint
 *
 * Fails when a template in views/, a hand-written stylesheet in styles/, or a
 * class in JavaScript (js/, data/sanity/transforms/) puts a colour on the page
 * that doesn't come from the palette in styles/colors.css, or when an
 * arbitrary value recurs across files. Tailwind's default palette is still loaded, so a `blue`
 * background or a `neutral-150` text colour would build without complaint.
 * Report-only; never writes.
 *
 * Five rules:
 *   off-palette        a colour utility (built in, or an @utility that reads
 *                      --color-*) names a <family>-<shade> that isn't declared
 *   literal            a colour written as a value: hex, rgb(), oklch(), a
 *                      named colour. Use var(--color-…) instead
 *   undeclared-var     var(--color-…) names a colour that isn't declared
 *   declared-outside   a --color-… custom property declared anywhere but
 *                      styles/colors.css, which the Figma sync owns
 *   recurring-arbitrary
 *                      the same arbitrary-value utility (`<name>-[…]`) used in
 *                      more than one file: a missing token
 *
 * Enforces specs/design-system.spec.md, rules "Colour comes from the palette"
 * and "Every value in use is a token".
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
  jsLiteralWords,
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
/** The 148 CSS named colours, longest first so `darkblue` wins over `blue`. */
const NAMED_COLOURS = `aliceblue antiquewhite aqua aquamarine azure beige bisque
black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse
chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan
darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen
darkorange darkorchid darkred darksalmon darkseagreen darkslateblue
darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue
dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro
ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink
indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon
lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen
lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray
lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon
mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen
mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue
mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange
orangered orchid palegoldenrod palegreen paleturquoise palevioletred
papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red
rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna
silver skyblue slateblue slategray slategrey snow springgreen steelblue tan
teal thistle tomato turquoise violet wheat white whitesmoke yellow
yellowgreen`
  .split(/\s+/)
  .sort((a, b) => b.length - a.length);
const LITERAL_RE = new RegExp(
  "#[0-9a-fA-F]{3,8}\\b|(?<![\\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\\(|" +
    `(?<![\\w-])(?:${NAMED_COLOURS.join("|")})(?![\\w-])`,
  "gi",
);
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

/**
 * Arbitrary-value utilities (`max-w-[68ch]`, variants stripped) and where each
 * is used. Values that read a variable (`[var(--…)]`) already use a token.
 * Bare arbitrary properties (`[mask-type:alpha]`) aren't counted, because in
 * JavaScript they can't be told apart from attribute selectors.
 */
const arbitrary = new Map(); // base -> Map(component -> { file, line })
/**
 * Files that copy another file's markup by hand, documented in their sidecars.
 * Both render one component, so a value they share isn't a recurrence.
 */
const MIRRORS = {
  "data/sanity/transforms/portableText.js":
    "views/molecules/lightbox/lightbox-dialog.njk",
};
const ARBITRARY_RE = /^-?[a-z][\w-]*-\[([^\]]+)\](?:\/[\w.%]+)?$/;
const noteArbitrary = (word, file, line) => {
  const base = splitVariants(word).base.replace(/^!|!$/g, "");
  const m = ARBITRARY_RE.exec(base);
  if (!m || m[1].includes("--")) return;
  if (!arbitrary.has(base)) arbitrary.set(base, new Map());
  const uses = arbitrary.get(base);
  const component = MIRRORS[file] ?? file;
  if (!uses.has(component)) uses.set(component, { file, line });
};

/** Checks every class word of one source file. */
const scanWords = (file, text, words) => {
  for (const word of words) {
    const line = lineAt(text, text.indexOf(word));
    for (const f of checkClass(word)) report(f.rule, file, line, f.detail);
    noteArbitrary(word, file, line);
  }
};

const templates = glob.sync("views/**/*.njk", { cwd: projectRoot }).sort();
for (const file of templates) {
  const raw = read(file);
  scanWords(file, raw, literalWords(stripNjkComments(raw)));
}

/** JavaScript that toggles or emits classes; vendored libraries are skipped. */
const scripts = glob
  .sync(["js/**/*.js", "data/sanity/transforms/**/*.js"], {
    cwd: projectRoot,
    ignore: ["js/vendor/**"],
  })
  .sort();
for (const file of scripts) {
  const raw = read(file);
  scanWords(file, raw, jsLiteralWords(raw));
}

for (const file of handWritten) {
  const css = blankCssComments(read(file));
  scanWords(file, css, applyWords(css));
  // Declaration values: the innermost blocks, with @apply lines blanked out.
  for (const block of css.matchAll(/\{([^{}]*)\}/g)) {
    const body = block[1].replace(/@apply[^;]*;/g, (a) => " ".repeat(a.length));
    for (const f of checkValue(body))
      report(f.rule, file, lineAt(css, block.index + 1 + f.index), f.detail);
  }
  for (const m of css.matchAll(DECL_RE))
    report("declared-outside", file, lineAt(css, m.index), `--color-${m[1]}`);
}

for (const [base, uses] of arbitrary) {
  if (uses.size < 2) continue;
  for (const { file, line } of uses.values())
    report("recurring-arbitrary", file, line, `${base} (${uses.size} files)`);
}

const RULES = [
  ["off-palette", "colour utility names a colour not in styles/colors.css"],
  ["literal", "colour written as a value; use var(--color-…)"],
  ["undeclared-var", "var(--color-…) names a colour not in styles/colors.css"],
  [
    "declared-outside",
    "colours are declared only in styles/colors.css, by the Figma sync",
  ],
  [
    "recurring-arbitrary",
    "arbitrary value used in more than one file; add it as a token",
  ],
];

console.log(chalk.bold("\n  Palette lint\n"));
if (!findings.length) {
  console.log(
    chalk.green(
      `  clean — ${templates.length} templates, ${handWritten.length} stylesheets, and ${scripts.length} scripts use only the ${declared.size} palette colours, and no arbitrary value recurs\n`,
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
    "Use a step of a palette family, semantic-* for states, or var(--color-black|white). Turn a recurring arbitrary value into a token.\n",
  ),
);
process.exit(1);
