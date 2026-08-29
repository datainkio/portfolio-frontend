#!/usr/bin/env node
/** @format */

/**
 * Frontmatter Codemod
 *
 * Brings every tracked file onto specs/frontmatter.spec.md:
 *   1. migrates `role` -> `description` and `docType` -> `type`
 *   2. drops retired keys (derivable, redundant, or the retired `aix:` namespace)
 *   3. strips functional keys from files Eleventy does not render
 *   4. normalizes `status` / `type` onto their enums and drops default `status`
 *   5. cleans tags — no `#` prefix, no repo-wide null tags
 *   6. removes inline JSDoc pseudo-frontmatter from source files
 *   7. seeds frontmatter on authored markdown that has none
 *
 * Deterministic and idempotent: running twice changes nothing the second time.
 *
 * USAGE:
 *   node scripts/normalizeFrontmatter.js --dry     # report only
 *   node scripts/normalizeFrontmatter.js           # apply
 */

import { execFileSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { basename, extname } from "path";
import chalk from "chalk";
import {
  KEEP_FUNCTIONAL,
  DROP_DERIVABLE,
  DROP_REDUNDANT,
  MIGRATE,
  STATUS_ENUM,
  STATUS_ALIASES,
  TYPE_ENUM,
  TYPE_ALIASES,
  NULL_TAGS,
  KEY_ORDER,
  isExempt,
  isRendered,
  splitFrontmatter,
  parseBlocks,
  blockItems,
  unquote,
  yamlScalar,
} from "./lib/frontmatterSchema.js";

const dry = process.argv.includes("--dry");

function tracked(...patterns) {
  return execFileSync(
    "git",
    [
      "ls-files",
      "-z",
      "--cached",
      "--others",
      "--exclude-standard",
      ...patterns,
    ],
    {
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    },
  )
    .split("\0")
    .filter(Boolean);
}

const stats = {
  mdRewritten: 0,
  mdSeeded: 0,
  inlineStripped: 0,
  roleMigrated: 0,
  docTypeMigrated: 0,
  keysDropped: 0,
  functionalStripped: 0,
  tagsCleaned: 0,
  selfLinksRemoved: 0,
  descriptionsAdded: 0,
};

/** Title-case a filename stem, for comparing against a redundant `title:`. */
const normalizeForCompare = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Derive a fallback description from the body's first real paragraph. */
function describeFromBody(body) {
  const lines = body.split("\n");
  let inFence = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence || !line) continue;
    if (/^[#>|\-*=[!]/.test(line)) continue;
    if (line.length < 20) continue;
    const sentence = /^(.{20,200}?[.!?])(\s|$)/.exec(line);
    const text = (sentence ? sentence[1] : line.slice(0, 160)).trim();
    return text.replace(/\s+/g, " ").replace(/[`*_[\]]/g, "");
  }
  return null;
}

/** Infer `type` from where the file sits, used only when seeding. */
function inferType(file) {
  if (file.startsWith("specs/")) return "spec";
  if (/(^|\/)README\.[^/]+\.md$/.test(file) || /(^|\/)index\.md$/.test(file))
    return "index";
  if (file.startsWith("docs/")) return "guide";
  if (file.startsWith("views/")) return "template";
  if (file.startsWith("js/") || file.startsWith("scripts/")) return "script";
  return "reference";
}

// ---------------------------------------------------------------------------
// Markdown
// ---------------------------------------------------------------------------

for (const file of tracked("*.md")) {
  if (isExempt(file)) continue;
  const original = readFileSync(file, "utf8");
  const split = splitFrontmatter(original);
  const rendered = isRendered(file);
  const stem = basename(file, extname(file));

  // --- seed frontmatter where there is none -------------------------------
  if (!split) {
    const description = describeFromBody(original);
    if (!description) continue; // nothing honest to say; leave for a human
    const h1 = /^#\s+(.+)$/m.exec(original);
    const lines = ["---"];
    if (h1 && normalizeForCompare(h1[1]) !== normalizeForCompare(stem))
      lines.push(`title: ${yamlScalar(h1[1])}`);
    lines.push(`description: ${yamlScalar(description)}`);
    lines.push(`type: ${inferType(file)}`);
    lines.push("---");
    const seeded = original.replace(/^\n+/, "");
    if (!dry)
      writeFileSync(
        file,
        lines.join("\n") + "\n" + (seeded ? `\n${seeded}` : ""),
      );
    stats.mdSeeded += 1;
    stats.descriptionsAdded += 1;
    continue;
  }

  const blocks = parseBlocks(split.block);
  const byKey = new Map(blocks.map((b) => [b.key, b]));
  const out = new Map();
  let changed = false;

  // --- migrations ---------------------------------------------------------
  for (const [from, to] of MIGRATE) {
    const src = byKey.get(from);
    if (!src) continue;
    const existing = byKey.get(to);
    const hasExisting = existing && unquote(existing.inline).trim();
    if (!hasExisting) {
      let value = unquote(src.inline).trim();
      if (!value) value = blockItems(src).map(unquote).join(" ").trim();
      if (value) {
        if (to === "type") {
          const mapped = TYPE_ALIASES.get(value) ?? value;
          out.set("type", TYPE_ENUM.includes(mapped) ? mapped : "reference");
          stats.docTypeMigrated += 1;
        } else {
          out.set("description", value);
          stats.roleMigrated += 1;
          stats.descriptionsAdded += 1;
        }
        changed = true;
      }
    }
  }

  // --- carry forward what survives ---------------------------------------
  for (const b of blocks) {
    const key = b.key;
    if (MIGRATE.has(key)) {
      changed = true;
      continue;
    }
    if (DROP_DERIVABLE.has(key) || DROP_REDUNDANT.has(key)) {
      stats.keysDropped += 1;
      changed = true;
      continue;
    }
    if (KEEP_FUNCTIONAL.has(key) && !rendered) {
      stats.functionalStripped += 1;
      changed = true;
      continue;
    }
    if (out.has(key)) continue;

    if (key === "status") {
      const raw = unquote(b.inline).trim();
      const mapped = STATUS_ALIASES.get(raw) ?? raw;
      if (!STATUS_ENUM.includes(mapped)) {
        changed = true;
        continue;
      }
      if (mapped === "active") {
        changed = true; // default; stating it is noise
        continue;
      }
      if (mapped !== raw) changed = true;
      out.set("status", mapped);
      continue;
    }

    if (key === "type") {
      const raw = unquote(b.inline).trim();
      const mapped = TYPE_ALIASES.get(raw) ?? raw;
      if (!raw) continue;
      if (!TYPE_ENUM.includes(mapped)) {
        out.set("type", "reference");
        changed = true;
        continue;
      }
      if (mapped !== raw) changed = true;
      out.set("type", mapped);
      continue;
    }

    if (key === "title") {
      const raw = unquote(b.inline).trim();
      if (!raw || normalizeForCompare(raw) === normalizeForCompare(stem)) {
        changed = true; // restates the filename
        continue;
      }
      out.set("title", raw);
      continue;
    }

    if (key === "tags") {
      const cleaned = blockItems(b)
        .map((t) => unquote(t).replace(/^#/, "").trim())
        .filter((t) => t && !NULL_TAGS.has(t.toLowerCase()));
      const before = blockItems(b).length;
      if (cleaned.length !== before) {
        stats.tagsCleaned += 1;
        changed = true;
      }
      if (cleaned.length) out.set("tags", [...new Set(cleaned)]);
      else if (before) changed = true;
      continue;
    }

    if (key === "links" || key === "aliases") {
      const raw = blockItems(b)
        .map((v) => unquote(v).trim())
        .filter(Boolean);
      const items = raw.filter((v) => {
        if (key !== "links") return true;
        // A sidecar linking to itself adds no graph edge. Reduce the entry to
        // its bare target — `[label](gel.md)`, `[[gel]]`, `gel.md` all collapse
        // to `gel` — and drop it when that equals this file's own stem.
        const target = (/\]\(([^)]+)\)/.exec(v)?.[1] ?? v)
          .replace(/^\[\[|\]\]$/g, "")
          .split("|")[0]
          .split("#")[0]
          .split("/")
          .pop()
          .replace(/\.md$/, "")
          .trim();
        if (target === stem) {
          stats.selfLinksRemoved += 1;
          changed = true;
          return false;
        }
        return true;
      });
      if (items.length) out.set(key, [...new Set(items)]);
      else if (raw.length) changed = true;
      continue;
    }

    // everything else (functional keys in rendered files, unclassified keys)
    out.set(key, b);
  }

  // --- description fallback ----------------------------------------------
  if (!out.has("description")) {
    const description = describeFromBody(split.body);
    if (description) {
      out.set("description", description);
      stats.descriptionsAdded += 1;
      changed = true;
    }
  }

  // `specs/` files are specs; the migrated `docType: reference` under-describes
  // them and costs Dataview queries their most useful partition.
  if (file.startsWith("specs/") && out.get("type") !== "spec") {
    out.set("type", "spec");
    changed = true;
  }
  void changed; // rebuild unconditionally; the write is gated on a real diff

  // --- serialize in canonical order --------------------------------------
  const ordered = [
    ...KEY_ORDER.filter((k) => out.has(k)),
    ...[...out.keys()].filter((k) => !KEY_ORDER.includes(k)),
  ];
  const lines = ["---"];
  for (const key of ordered) {
    const v = out.get(key);
    if (Array.isArray(v)) {
      lines.push(`${key}:`);
      for (const item of v) lines.push(`  - ${yamlScalar(item)}`);
    } else if (typeof v === "string") {
      lines.push(`${key}: ${yamlScalar(v)}`);
    } else {
      lines.push(...v.lines); // untouched raw block
    }
  }
  lines.push("---");

  // One blank line before a body, none when the file is frontmatter-only —
  // otherwise prettier strips the trailing newline back and the two tools
  // oscillate forever.
  const body = split.body.replace(/^\n+/, "");
  const next = lines.join("\n") + "\n" + (body ? `\n${body}` : "");
  if (next !== original) {
    if (!dry) writeFileSync(file, next);
    stats.mdRewritten += 1;
  }
}

// ---------------------------------------------------------------------------
// Source files — remove the inline JSDoc dialect entirely
// ---------------------------------------------------------------------------

const INLINE_RE =
  /^(#!.*\n)?\/\*\*?\s*\n(?:\s*\*\s*---\s*\n)[\s\S]*?\*\s*---\s*\n\s*\*\/\n/;

for (const file of tracked("*.js", "*.njk", "*.mjs", "*.ts", "*.css")) {
  if (isExempt(file)) continue;
  const text = readFileSync(file, "utf8");
  const m = INLINE_RE.exec(text);
  if (!m) continue;
  const shebang = m[1] ?? "";
  const next = shebang + text.slice(m[0].length);
  if (!dry) writeFileSync(file, next);
  stats.inlineStripped += 1;
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log(
  chalk.bold(
    `\n  Frontmatter codemod ${dry ? chalk.yellow("(dry run)") : ""}\n`,
  ),
);
const row = (label, n) =>
  console.log(`  ${label.padEnd(34)} ${String(n).padStart(5)}`);
row("markdown files rewritten", stats.mdRewritten);
row("markdown files seeded", stats.mdSeeded);
row("inline JSDoc blocks removed", stats.inlineStripped);
console.log();
row("role -> description", stats.roleMigrated);
row("docType -> type", stats.docTypeMigrated);
row("descriptions added (total)", stats.descriptionsAdded);
row("retired keys dropped", stats.keysDropped);
row("functional keys stripped", stats.functionalStripped);
row("tag lists cleaned", stats.tagsCleaned);
row("self-links removed", stats.selfLinksRemoved);
console.log();
if (dry)
  console.log(chalk.yellow("  Nothing written. Re-run without --dry.\n"));
