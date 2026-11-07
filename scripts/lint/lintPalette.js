#!/usr/bin/env node
/** @format */

/**
 * Palette lint
 *
 * Fails when a template in views/ uses a colour utility whose colour isn't
 * declared in the theme. Tailwind's default palette is still loaded, so a
 * `blue` background or a `neutral-150` text colour would build without
 * complaint and put an off-palette colour on the page. Report-only; never
 * writes.
 *
 * Examples here and in the sidecar name families, not full classes, because
 * Tailwind scans tracked files and would generate CSS for them.
 *
 * Enforces specs/design-system.spec.md, rule "Colour comes from the palette".
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
  COLOR_RE,
  customProps,
  literalWords,
  splitVariants,
  stripCssComments,
  stripNjkComments,
} from "../lib/tailwindSource.js";

const read = (file) => fs.readFileSync(path.join(projectRoot, file), "utf8");

/** Colour names declared in @theme, e.g. `neutral-500`, `semantic-fail`. */
const declared = new Set(
  glob
    .sync("styles/**/*.css", { cwd: projectRoot })
    .flatMap((file) =>
      customProps(stripCssComments(read(file)), /@theme\s*\{([^}]*)\}/g),
    )
    .filter((t) => t.name.startsWith("color-"))
    .map((t) => t.name.slice("color-".length)),
);

const files = glob.sync("views/**/*.njk", { cwd: projectRoot }).sort();
const findings = []; // { file, line, word }

for (const file of files) {
  const raw = read(file);
  const seen = new Set();
  for (const word of literalWords(stripNjkComments(raw))) {
    const m = COLOR_RE.exec(splitVariants(word).base);
    // Only the `<family>-<shade>` form: white, black, and the rest are built in.
    if (!m?.[3] || declared.has(`${m[3]}-${m[4]}`) || seen.has(word)) continue;
    seen.add(word);
    const line = raw.slice(0, raw.indexOf(word)).split("\n").length;
    findings.push({ file, line, word });
  }
}

console.log(chalk.bold("\n  Palette lint\n"));
if (!findings.length) {
  console.log(
    chalk.green(
      `  clean — ${files.length} templates use only the ${declared.size} declared colours\n`,
    ),
  );
  process.exit(0);
}
findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
for (const { file, line, word } of findings)
  console.log(`  ${chalk.red(word)}  ${chalk.dim(`${file}:${line}`)}`);
console.log(
  chalk.yellow(`\n  ${findings.length} off-palette colour utilities.`),
  chalk.dim(
    "Use the nearest step of a declared family (styles/colors.css), or semantic-* for states.\n",
  ),
);
process.exit(1);
