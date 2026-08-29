#!/usr/bin/env node
/** @format */

/**
 * Frontmatter Linter
 *
 * Enforces specs/frontmatter.spec.md. Report-only; never writes.
 * Run `node scripts/normalizeFrontmatter.js` to fix what is mechanically fixable.
 *
 * Complements the `frontmatter-lint` skill, which checks presence (does the file
 * have frontmatter, does the sidecar exist). This checks the schema.
 *
 * USAGE:
 *   npm run lint:frontmatter
 *   npm run lint:frontmatter -- --quiet   # counts only
 */

import { execFileSync } from "child_process";
import { readFileSync } from "fs";
import chalk from "chalk";
import {
  KEEP_FUNCTIONAL,
  DROP_DERIVABLE,
  DROP_REDUNDANT,
  MIGRATE,
  STATUS_ENUM,
  TYPE_ENUM,
  NULL_TAGS,
  isExempt,
  isRendered,
  splitFrontmatter,
  parseBlocks,
  blockItems,
  unquote,
} from "./lib/frontmatterSchema.js";

const quiet = process.argv.includes("--quiet");

const files = execFileSync(
  "git",
  ["ls-files", "-z", "--cached", "--others", "--exclude-standard", "*.md"],
  {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  },
)
  .split("\0")
  .filter(Boolean)
  .filter((f) => !isExempt(f));

/** rule -> [{file, detail}] */
const findings = new Map();
const report = (rule, file, detail = "") => {
  if (!findings.has(rule)) findings.set(rule, []);
  findings.get(rule).push({ file, detail });
};

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const split = splitFrontmatter(text);

  if (!split) {
    report("no-frontmatter", file);
    continue;
  }

  const blocks = parseBlocks(split.block);
  const byKey = new Map(blocks.map((b) => [b.key, b]));

  const description = unquote(byKey.get("description")?.inline ?? "").trim();
  if (!description) report("missing-description", file);
  else if (description.length < 20)
    report("thin-description", file, `"${description}"`);

  const status = unquote(byKey.get("status")?.inline ?? "").trim();
  if (status && !STATUS_ENUM.includes(status))
    report("bad-status", file, status);

  const type = unquote(byKey.get("type")?.inline ?? "").trim();
  if (type && !TYPE_ENUM.includes(type)) report("bad-type", file, type);

  for (const b of blocks) {
    if (DROP_DERIVABLE.has(b.key) || DROP_REDUNDANT.has(b.key))
      report("retired-key", file, b.key);
    if (MIGRATE.has(b.key)) report("superseded-key", file, b.key);
    if (KEEP_FUNCTIONAL.has(b.key) && !isRendered(file))
      report("functional-key-outside-ia", file, b.key);
  }

  const tags = byKey.get("tags");
  if (tags) {
    for (const raw of blockItems(tags)) {
      const t = unquote(raw).trim();
      if (t.startsWith("#")) report("hash-prefixed-tag", file, t);
      if (NULL_TAGS.has(t.replace(/^#/, "").toLowerCase()))
        report("null-tag", file, t);
    }
  }
}

const RULES = [
  ["no-frontmatter", "file has no frontmatter block"],
  ["missing-description", "description is required"],
  ["thin-description", "description under 20 chars — say what it does"],
  ["retired-key", "key retired by specs/frontmatter.spec.md"],
  ["superseded-key", "key superseded; migrate its content"],
  ["functional-key-outside-ia", "Eleventy key on a file 11ty does not render"],
  ["bad-status", "status outside the enum"],
  ["bad-type", "type outside the enum"],
  ["hash-prefixed-tag", "frontmatter tags take no # prefix"],
  ["null-tag", "tag names the whole repo and discriminates nothing"],
];

let total = 0;
console.log(chalk.bold("\n  Frontmatter lint\n"));
for (const [rule, blurb] of RULES) {
  const hits = findings.get(rule) ?? [];
  total += hits.length;
  if (!hits.length) continue;
  console.log(
    `  ${chalk.red(String(hits.length).padStart(4))}  ${chalk.bold(rule)} — ${blurb}`,
  );
  if (quiet) continue;
  for (const { file, detail } of hits.slice(0, 8))
    console.log(chalk.dim(`         ${file}${detail ? `  (${detail})` : ""}`));
  if (hits.length > 8)
    console.log(chalk.dim(`         … ${hits.length - 8} more`));
}

if (!total) {
  console.log(chalk.green(`  clean — ${files.length} files conform\n`));
  process.exit(0);
}
console.log(
  chalk.yellow(`\n  ${total} findings across ${files.length} files.`),
  chalk.dim("Run: node scripts/normalizeFrontmatter.js\n"),
);
process.exit(1);
