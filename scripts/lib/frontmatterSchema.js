/** @format */

/**
 * Frontmatter schema — the single classification shared by the audit, the
 * codemod, and the linter.
 *
 * Prose authority: specs/frontmatter.spec.md. Change policy here and there
 * together; nothing else should hard-code a key list.
 */

/** Carries signal no path can supply. */
export const KEEP_CORE = new Set([
  "title",
  "description",
  "type",
  "status",
  "tags",
  "aliases", // Obsidian quick-switcher / link autocomplete
  "links", // Obsidian graph edges
]);

/** Consumed by Eleventy at build time. Legal only in rendered files. */
export const KEEP_FUNCTIONAL = new Set([
  "permalink",
  "layout",
  "eleventyComputed",
  "eleventyNavigation",
  "eleventyExcludeFromCollections",
  "templateEngineOverride",
  "pagination",
  "date",
  "metaDescription",
  "metaKeywords",
  "canonicalUrl",
  "skipLinks",
  "enableChoreography",
  "viewport",
]);

/**
 * Domain vocabularies that are legitimately local to one subtree. Kept, but
 * deliberately narrow — add here only when a key has real meaning that the core
 * schema cannot express, never to grandfather in drift.
 */
export const KEEP_DOMAIN = new Set([
  "severity", // responsive-testing/issues
  "priority", // responsive-testing
  "viewport-width", // responsive-testing/viewports
  "viewport-height",
]);

/** Fully recoverable from path, filename, or extension. */
export const DROP_DERIVABLE = new Set([
  "id",
  "scope",
  "surface",
  "system",
  "engine",
  "runtime",
  "atomicLevel",
  "template",
  "templatePath",
  "templateRole",
  "module",
  "modulePath",
  "scriptRole",
  "animation",
]);

/** Duplicates something a tool already derives, or a retired namespace. */
export const DROP_REDUNDANT = new Set([
  "backlinks", // Obsidian computes backlinks natively
  "aix", // namespace retired 2026-08-20
  "owner",
  "audience",
  "perf",
]);

/** Superseded by a canonical key; content migrates rather than deletes. */
export const MIGRATE = new Map([
  ["role", "description"],
  ["docType", "type"],
]);

export const STATUS_ENUM = [
  "draft",
  "active",
  "stable",
  "deprecated",
  "historical",
];

export const TYPE_ENUM = [
  "template",
  "script",
  "spec",
  "guide",
  "reference",
  "index",
  "plan",
  "handoff",
];

/** Legacy status spellings mapped onto the enum. */
export const STATUS_ALIASES = new Map([
  ["#historical", "historical"],
  ["superseded", "historical"],
  ["placeholder", "draft"],
  ["planned", "draft"],
  ["#active", "active"],
]);

/** Legacy type spellings mapped onto the enum. */
export const TYPE_ALIASES = new Map([
  ["entrypoint", "index"],
  ["context", "reference"],
  ["module", "script"],
  ["pattern", "reference"],
  ["note", "reference"],
  ["decision", "reference"],
]);

/** Tags naming the whole repo, and so discriminating nothing within it. */
export const NULL_TAGS = new Set([
  "frontend",
  "js",
  "dataink",
  "dataink.io",
  "claude",
  "aix",
]);

/** Canonical key order, so every file reads the same way. */
export const KEY_ORDER = [
  "title",
  "description",
  "type",
  "status",
  "tags",
  "aliases",
  "links",
  // functional keys follow, in Eleventy-rendered files only
  "layout",
  "permalink",
  "eleventyNavigation",
  "eleventyComputed",
  "eleventyExcludeFromCollections",
  "templateEngineOverride",
  "pagination",
  "date",
  "metaDescription",
  "metaKeywords",
  "canonicalUrl",
  "skipLinks",
  "enableChoreography",
  "viewport",
];

/** Eleventy's input dir — only these files may carry functional keys. */
export const ELEVENTY_INPUT_DIR = "ia/";

/** Generated or vendored paths, exempt from every rule. */
export const EXEMPT_PATTERNS = [
  /^_site\//,
  /^node_modules\//,
  /^graphify-out\//,
  /^\.github\//, // consumed by GitHub/Copilot tooling, not the vault
  /^docs\/ai\/legacy-agents\//,
];

export function isExempt(file) {
  return EXEMPT_PATTERNS.some((re) => re.test(file));
}

export function isRendered(file) {
  return file.startsWith(ELEVENTY_INPUT_DIR);
}

export function verdictFor(key) {
  if (KEEP_CORE.has(key)) return "keep-core";
  if (KEEP_FUNCTIONAL.has(key)) return "keep-functional";
  if (KEEP_DOMAIN.has(key)) return "keep-domain";
  if (MIGRATE.has(key)) return "migrate";
  if (DROP_DERIVABLE.has(key)) return "drop-derivable";
  if (DROP_REDUNDANT.has(key)) return "drop-redundant";
  return "review";
}

/**
 * Split a markdown file into its frontmatter block and body.
 * Returns null when the file has no leading `---` fence.
 */
export function splitFrontmatter(text) {
  if (!text.startsWith("---")) return null;
  const end = text.indexOf("\n---", 3);
  if (end < 0) return null;
  const afterFence = text.indexOf("\n", end + 1);
  return {
    block: text.slice(3, end).replace(/^\r?\n/, ""),
    body: afterFence < 0 ? "" : text.slice(afterFence + 1),
  };
}

/**
 * Parse a frontmatter block into ordered key blocks, preserving raw lines so
 * edits can drop or reorder whole keys without reformatting what stays.
 */
export function parseBlocks(block) {
  const blocks = [];
  let current = null;
  for (const line of block.split("\n")) {
    const m = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (m) {
      current = { key: m[1], inline: m[2].trim(), lines: [line] };
      blocks.push(current);
    } else if (current) {
      current.lines.push(line);
    }
  }
  return blocks.filter((b) => b.lines.join("\n").trim());
}

/** List items beneath a key block (`- value` lines). */
export function blockItems(b) {
  return b.lines
    .slice(1)
    .map((l) => /^\s*-\s*(.*)$/.exec(l))
    .filter(Boolean)
    .map((m) => m[1].trim());
}

export const unquote = (v) => v.replace(/^["'](.*)["']$/s, "$1");

/** Quote only when YAML needs it. */
export function yamlScalar(v) {
  const s = unquote(String(v)).trim();
  if (s === "") return '""';
  if (
    /^[\w][\w .\-/()]*$/.test(s) &&
    !/^(true|false|null|yes|no|on|off)$/i.test(s)
  )
    return s;
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}
