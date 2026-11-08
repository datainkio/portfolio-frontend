/** @format */

/**
 * Design-system readers for the living reference under ia/docs/design/.
 *
 * Both readers parse files that already exist, so the reference can't drift
 * from them: tokens come from the generated theme files in styles/, and a
 * component's description and params come from its views/ sidecar.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, basename, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

const read = (rel) => {
  try {
    return readFileSync(join(ROOT, rel), "utf8");
  } catch {
    return "";
  }
};

/** Every `.njk` path under `views/`, relative to `views/`, forward-slashed. */
function listComponents() {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(join(ROOT, "views", dir), {
      withFileTypes: true,
    })) {
      const rel = dir ? `${dir}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(rel);
      else if (entry.name.endsWith(".njk")) out.push(rel);
    }
  };
  walk("");
  return out.map((p) => relative("", p).split("\\").join("/"));
}

const IMPORT_RE = /\{%-?\s*import\s+"([^"]+\.njk)"/g;

/**
 * The import graph of every component under `views/`: `imports` (what a
 * component's own file imports) and `importedBy` (every component whose
 * file imports it), both as `views/` paths. Built once per process; the
 * reference reads it on every build, so it can't drift from the templates.
 */
let importGraph;
function readImportGraph() {
  if (importGraph) return importGraph;
  const imports = new Map();
  const importedBy = new Map();
  for (const path of listComponents()) {
    const text = read(`views/${path}`);
    const targets = [...text.matchAll(IMPORT_RE)].map((m) => m[1]);
    imports.set(path, targets);
    for (const target of targets) {
      if (!importedBy.has(target)) importedBy.set(target, []);
      importedBy.get(target).push(path);
    }
  }
  importGraph = { imports, importedBy };
  return importGraph;
}

/**
 * Every page under `ia/docs/design/` that names a `component` serves at
 * `/docs/design/<component without .njk>/`, Eleventy's default permalink for
 * that file. No reader needs to scan `collections.all` to find it.
 */
const referenceUrl = (component) =>
  `/docs/design/${component.replace(/\.njk$/, "")}/`;

/** Whether a component has a reference page, i.e. its sidecar exists. */
const hasReferencePage = (component) =>
  Boolean(read(`ia/docs/design/${component.replace(/\.njk$/, ".md")}`));

/** `--name: value;` pairs inside a file's `@theme` blocks, in source order. */
function themeEntries(css) {
  const out = [];
  for (const [, block] of css.matchAll(/@theme\s*\{([\s\S]*?)\n\}/g)) {
    for (const [, name, value] of block.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
      out.push([name, value.trim()]);
    }
  }
  return out;
}

/** Tailwind writes `.` in theme keys as `_`: `--spacing-1_5` is `p-1.5`. */
const keyToClass = (key) => key.replace(/_/g, ".");

const PALETTE_ORDER = [
  "primary",
  "secondary",
  "tertiary",
  "accent",
  "neutral",
  "slate",
  "semantic",
];

/**
 * Every token the theme files declare, grouped the way the reference pages
 * show them. `key` is the utility suffix (`4` in `p-4`, `b-md` in
 * `shadow-b-md`); `""` is the bare utility (`rounded`).
 */
export function readDesignTokens() {
  const colorsCss = read("styles/colors.css");
  const tokens = [
    ...themeEntries(colorsCss),
    ...themeEntries(read("styles/tokens.css")),
    ...themeEntries(read("styles/motion.css")),
    ...themeEntries(read("styles/typography/fontFamilies.css")),
  ];

  const groups = {
    color: [],
    spacing: [],
    container: [],
    radius: [],
    shadow: [],
    text: [],
    fontWeight: [],
    leading: [],
    tracking: [],
    font: [],
    duration: [],
    ease: [],
  };
  const lineHeights = {};

  for (const [name, value] of tokens) {
    let m;
    if ((m = name.match(/^color-([a-z]+)-(\w+)$/))) {
      groups.color.push({ family: m[1], shade: m[2], value });
    } else if ((m = name.match(/^spacing-(.+)$/))) {
      groups.spacing.push({ key: keyToClass(m[1]), value });
    } else if ((m = name.match(/^container-(.+)$/))) {
      groups.container.push({ key: m[1], value });
    } else if ((m = name.match(/^radius(?:-(.+))?$/))) {
      groups.radius.push({ key: m[1] || "", value });
    } else if ((m = name.match(/^shadow-(.+)$/))) {
      groups.shadow.push({ key: m[1], value });
    } else if ((m = name.match(/^text-(.+)--line-height$/))) {
      lineHeights[m[1]] = value;
    } else if ((m = name.match(/^text-(.+)$/))) {
      groups.text.push({ key: m[1], value });
    } else if ((m = name.match(/^font-weight-(.+)$/))) {
      groups.fontWeight.push({ key: m[1], value });
    } else if ((m = name.match(/^leading-(.+)$/))) {
      groups.leading.push({ key: m[1], value });
    } else if ((m = name.match(/^tracking-(.+)$/))) {
      groups.tracking.push({ key: m[1], value });
    } else if ((m = name.match(/^font-(.+)$/))) {
      groups.font.push({ key: m[1], value });
    } else if ((m = name.match(/^transition-duration-(.+)$/))) {
      groups.duration.push({ key: m[1], value });
    } else if ((m = name.match(/^ease-(.+)$/))) {
      const nums = value.match(/-?[\d.]+/g)?.map(Number) || [];
      groups.ease.push({ key: m[1], value, points: nums });
    }
  }

  for (const t of groups.text) t.lineHeight = lineHeights[t.key] || "";

  const num = (v) => parseFloat(v) || 0;
  const rem = (v) => num(v) * (v.endsWith("rem") ? 16 : 1);
  groups.spacing.sort((a, b) => num(a.key) - num(b.key));
  groups.container.sort((a, b) => rem(a.value) - rem(b.value));
  groups.radius.sort((a, b) => rem(a.value) - rem(b.value));
  groups.text.sort((a, b) => rem(a.value) - rem(b.value));
  groups.fontWeight.sort((a, b) => num(a.value) - num(b.value));
  groups.leading.sort((a, b) => num(a.value) - num(b.value));
  groups.tracking.sort((a, b) => num(a.value) - num(b.value));
  groups.duration.sort((a, b) => num(a.value) - num(b.value));

  // Colour families in palette order, shades ascending.
  const families = {};
  for (const c of groups.color) (families[c.family] ??= []).push(c);
  for (const list of Object.values(families)) {
    list.sort((a, b) => (num(a.shade) || 0) - (num(b.shade) || 0));
  }
  // WCAG contrast of each colour against the site's two grounds: paper
  // (neutral-50) and the page body (slate-950).
  const paper = families.neutral?.find((c) => c.shade === "50")?.value;
  const ground = families.slate?.find((c) => c.shade === "950")?.value;
  for (const c of Object.values(families).flat()) {
    c.contrast = {
      paper: paper ? contrastRatio(c.value, paper) : null,
      ground: ground ? contrastRatio(c.value, ground) : null,
    };
  }
  groups.grounds = { paper, ground };

  groups.palette = Object.keys(families)
    .sort((a, b) => {
      const ia = PALETTE_ORDER.indexOf(a);
      const ib = PALETTE_ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    })
    .map((family) => ({ family, shades: families[family] }));
  delete groups.color;

  // The Figma sync writes "@source Figma file <name>, version <number>".
  const [, figmaFile = "", figmaVersion = ""] =
    colorsCss.match(/@source Figma file (.+), version (\S+)/) ?? [];
  groups.source = { figmaFile, figmaVersion };

  return groups;
}

/** WCAG 2 relative luminance of a `#rrggbb` colour. */
function luminance(hex) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3 ? [...h].map((c) => c + c).join("") : h.slice(0, 6);
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(full.slice(i, i + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colours, to one decimal place. */
function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 10) / 10;
}

/** Drops Obsidian wikilinks and relative `.md` links, which don't resolve on the site. */
function siteSafeMarkdown(md) {
  return md
    .replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\((?!https?:)[^)]*\)/g, "$1");
}

/** Lines of `## heading` up to the next `## `. */
function section(body, heading) {
  const re = new RegExp(`^## ${heading}\\s*$`, "m");
  const start = body.search(re);
  if (start < 0) return "";
  const rest = body.slice(start).split("\n").slice(1);
  const end = rest.findIndex((l) => /^## /.test(l));
  return (end < 0 ? rest : rest.slice(0, end)).join("\n").trim();
}

/**
 * Component titles, read from reference-page frontmatter, for `related`
 * labels. Falls back to a title-cased file name when a page doesn't exist
 * yet (unreferenced in the sidebar, so this is display text only).
 */
const titleCache = new Map();
function componentTitle(component) {
  if (titleCache.has(component)) return titleCache.get(component);
  const text = read(`ia/docs/design/${component.replace(/\.njk$/, ".md")}`);
  const title =
    text.match(/^---\n[\s\S]*?^title:\s*(.+)$/m)?.[1].trim() ||
    basename(component, ".njk")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  titleCache.set(component, title);
  return title;
}

/**
 * The other components a page's `component` imports, and every component
 * that imports it in turn — each resolved to `{ title, url }` when it has a
 * reference page, else dropped (nothing to link to). Read from the files
 * themselves, so it can't drift from a sidecar's own "Relationships" prose.
 */
function relatedComponents(component) {
  const { imports, importedBy } = readImportGraph();
  const toLinks = (paths) =>
    (paths || [])
      .filter(hasReferencePage)
      .map((path) => ({
        title: componentTitle(path),
        url: referenceUrl(path),
      }));
  return {
    composedOf: toLinks(imports.get(component)),
    usedIn: toLinks(importedBy.get(component)),
  };
}

/**
 * The sidecar facts a component page shows: its description and its params.
 * Params come from `## Params`, else the first `| Param` table, else the
 * `## Data and Context` bullets — the three shapes sidecars use.
 *
 * @param {string} component - Path under views/, e.g. "atoms/button.njk".
 */
export function readComponentSidecar(component) {
  const mdPath = `views/${component.replace(/\.njk$/, ".md")}`;
  const text = read(mdPath);
  const fm = text.match(/^---\n([\s\S]*?)\n---\n?/);
  const body = fm ? text.slice(fm[0].length) : text;
  const description =
    fm?.[1]
      .match(/^description:\s*(.+)$/m)?.[1]
      .trim()
      .replace(/^(["'])(.*)\1$/, "$2") || "";

  let params = section(body, "Params");
  if (!params) {
    const lines = body.split("\n");
    const i = lines.findIndex((l) => /^\|\s*`?Param\b/.test(l));
    if (i >= 0) {
      let j = i;
      while (j < lines.length && lines[j].startsWith("|")) j++;
      params = lines.slice(i, j).join("\n");
    }
  }
  if (!params) params = section(body, "Data and Context");

  const name = basename(component, ".njk");
  return {
    found: Boolean(text),
    source: `views/${component}`,
    sidecar: mdPath,
    importPath: component,
    alias: name
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(""),
    description,
    params: siteSafeMarkdown(params),
    related: relatedComponents(component),
  };
}
