/** @format */

/**
 * Choreography-system reader for the living reference under ia/docs/design/choreography/.
 *
 * Everything here is read from files the site already runs, so the reference
 * can't drift from them: module pages come from the sidecars under
 * js/choreography/, "built from" and "used by" come from the JS import graph,
 * and the contract and tuning pages come from the config modules themselves.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, basename, posix } from "node:path";
import { fileURLToPath } from "node:url";
import {
  EVENTS,
  makeSectionEvents,
} from "../../js/choreography/config/contracts/events/events.js";
import * as selectorSets from "../../js/choreography/config/contracts/selectors/selectors.js";
import { TIMELINE_IDS } from "../../js/choreography/config/contracts/timelines/timelines.js";
import * as presetExports from "../../js/choreography/config/ix/presets/presets.js";
import {
  ACCESSIBILITY_SETTINGS,
  SECTION_OVERRIDES,
  resolveSectionMotionProfile,
} from "../../js/choreography/config/ix/profiles.js";
import { BREAKPOINT_MATCH_MEDIA_CONDITIONS } from "../../js/choreography/config/ix/breakpoints.js";
import { SCROLL_DEFAULTS } from "../../js/choreography/config/ix/scrolltriggers.js";
import {
  ANIMATION_DEFAULTS,
  GSAP_EASE,
  motionTokens,
} from "../../js/choreography/config/ix/motion.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const BASE = "js/choreography";
const URL_BASE = "/docs/design/choreography";

/** Sidebar order. A layer this doesn't list still renders, after these. */
const LAYER_ORDER = [
  "tokens",
  "atoms",
  "molecules",
  "organisms",
  "templates",
  "pages",
  "navigation",
  "managers",
  "system",
  "config",
];

/**
 * Layers that get a sidebar section of their own, in order. Every other
 * layer, including one added later, folds into "system" (the last entry): its
 * modules sit under one group titled with the layer, and its index page is
 * reached from the System page, not the sidebar.
 */
const SECTION_LAYERS = ["atoms", "molecules", "organisms", "pages", "system"];
const FOLD_INTO = SECTION_LAYERS.at(-1);
const FOLD_GROUP_STRIDE = 1000;
/** The system layer's own modules, once folded, sit under this group. */
const CORE_GROUP = "Core";

/** Root-level modules (AnimationDirector, the barrel, the guide) sit here. */
const ROOT_LAYER = "system";
const ROOT_GROUP = "Entry points";

/** Working notes, not reference material. */
const SKIP_DIRS = new Set(["_context"]);

const read = (rel) => {
  try {
    return readFileSync(join(ROOT, rel), "utf8");
  } catch {
    return "";
  }
};

/** Every file under js/choreography/ with `ext`, relative to it. */
function walk(ext, dir = "") {
  const out = [];
  for (const entry of readdirSync(join(ROOT, BASE, dir), {
    withFileTypes: true,
  })) {
    const rel = dir ? `${dir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) out.push(...walk(ext, rel));
    } else if (entry.name.endsWith(ext)) out.push(rel);
  }
  return out.sort();
}

const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** Lines of `## heading` up to the next `## `. */
function section(body, heading) {
  const start = body.search(new RegExp(`^## ${heading}\\s*$`, "m"));
  if (start < 0) return "";
  const rest = body.slice(start).split("\n").slice(1);
  const end = rest.findIndex((l) => /^## /.test(l));
  return (end < 0 ? rest : rest.slice(0, end)).join("\n").trim();
}

/** Frontmatter scalars and the body beneath them. */
function parseSidecar(text) {
  const fm = text.match(/^---\n([\s\S]*?)\n---\n?/);
  const scalar = (key) =>
    fm?.[1]
      .match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1]
      .trim()
      .replace(/^(["'])(.*)\1$/, "$2") || "";
  return {
    title: scalar("title"),
    description: scalar("description"),
    status: scalar("status"),
    body: fm ? text.slice(fm[0].length) : text,
  };
}

/**
 * A README's own prose: without the generated header and index blocks, the
 * formatter pragma, and everything up to and including its H1.
 */
function readmeBody(text) {
  const body = parseSidecar(text)
    .body.replace(/<!-- readme-header[\s\S]*?<!-- \/readme-header -->/, "")
    .replace(/<!-- readme-index:start -->[\s\S]*?<!-- readme-index:end -->/, "")
    .replace(/<!-- @format -->/g, "");
  const h1 = body.search(/^# .+$/m);
  return (h1 < 0 ? body : body.slice(h1).replace(/^# .+$/m, "")).trim();
}

/* ------------------------------------------------------------------ */
/* Import graph                                                        */
/* ------------------------------------------------------------------ */

const FROM_RE =
  /(?:^|\n)\s*(import|export)\s+([^;'"]*?)\s*from\s*["']([^"']+)["']/g;
const BARE_IMPORT_RE = /(?:^|\n)\s*import\s*["']([^"']+)["']/g;
const LOCAL_EXPORT_RE =
  /(?:^|\n)\s*export\s+(?:default\s+)?(?:async\s+)?(?:const|let|function\*?|class)\s+([A-Za-z_$][\w$]*)/g;

/** A specifier as a path under js/choreography/, or "" when it's outside. */
function resolveSpecifier(fromFile, spec) {
  let path;
  if (spec.startsWith("/assets/js/")) path = spec.replace("/assets/js/", "js/");
  else if (spec.startsWith(".")) {
    path = posix.normalize(posix.join(BASE, posix.dirname(fromFile), spec));
  } else return "";
  return path.startsWith(`${BASE}/`) ? path.slice(BASE.length + 1) : "";
}

/** `{ a, b as c }` → the names as the source module exports them. */
const namedList = (clause) =>
  (clause.match(/\{([^}]*)\}/)?.[1] || "")
    .split(",")
    .map((n) => n.trim().split(/\s+as\s+/)[0])
    .filter(Boolean);

function buildImportGraph(jsFiles) {
  const source = new Map(jsFiles.map((f) => [f, read(`${BASE}/${f}`)]));
  const has = (f) => source.has(f);

  /** name → defining file, following re-exports. Memoised per file. */
  const exportMaps = new Map();
  const exportsOf = (file, seen = new Set()) => {
    if (exportMaps.has(file)) return exportMaps.get(file);
    const map = new Map();
    if (seen.has(file) || !has(file)) return map;
    seen.add(file);
    const text = source.get(file);
    for (const [, name] of text.matchAll(LOCAL_EXPORT_RE)) map.set(name, file);
    for (const [, kind, clause, spec] of text.matchAll(FROM_RE)) {
      if (kind !== "export") continue;
      const target = resolveSpecifier(file, spec);
      if (!has(target)) continue;
      const inner = exportsOf(target, seen);
      if (clause.trim().startsWith("*")) {
        for (const [name, origin] of inner) map.set(name, origin);
      } else {
        for (const name of namedList(clause)) {
          map.set(name, inner.get(name) || target);
        }
      }
    }
    exportMaps.set(file, map);
    return map;
  };

  /** Whether a file only re-exports: a barrel to look through, not a source. */
  const isBarrel = (file) => {
    const text = source.get(file) || "";
    return (
      /(?:^|\n)\s*export\s+[^;'"]*?from\s*["']/.test(text) &&
      ![...text.matchAll(LOCAL_EXPORT_RE)].length
    );
  };

  const imports = new Map();
  const importedBy = new Map();
  for (const file of jsFiles) {
    const targets = new Set();
    const text = source.get(file);
    const add = (target, clause = "") => {
      if (!has(target) || target === file) return;
      const names = namedList(clause);
      if (isBarrel(target) && names.length) {
        const map = exportsOf(target);
        for (const name of names) targets.add(map.get(name) || target);
      } else targets.add(target);
    };
    for (const [, kind, clause, spec] of text.matchAll(FROM_RE)) {
      // A barrel's own re-exports are plumbing, not composition.
      if (kind === "export" && isBarrel(file)) continue;
      add(resolveSpecifier(file, spec), clause);
    }
    for (const [, spec] of text.matchAll(BARE_IMPORT_RE)) {
      add(resolveSpecifier(file, spec));
    }
    targets.delete(file);
    imports.set(file, [...targets].sort());
    if (isBarrel(file)) continue;
    for (const target of targets) {
      if (!importedBy.has(target)) importedBy.set(target, []);
      importedBy.get(target).push(file);
    }
  }
  return { imports, importedBy, source };
}

/* ------------------------------------------------------------------ */
/* Modules and layers                                                  */
/* ------------------------------------------------------------------ */

function buildModules() {
  const jsFiles = walk(".js");
  const graph = buildImportGraph(jsFiles);
  const jsSet = new Set(jsFiles);

  // One module per sidecar. A layer's README is its index page; a README
  // deeper down is the page for that folder.
  const modules = [];
  const layerReadmes = new Map();
  for (const md of walk(".md")) {
    if (md === "README.md") continue;
    const parts = md.split("/");
    const isReadme = parts.at(-1) === "README.md";
    if (isReadme && parts.length === 2) {
      layerReadmes.set(parts[0], md);
      continue;
    }
    const text = read(`${BASE}/${md}`);
    const sidecar = parseSidecar(text);
    const stem = md.replace(/\.md$/, "");
    const path = isReadme ? posix.dirname(md) : stem;
    const js = `${stem}.js`;
    const body = isReadme ? readmeBody(text) : sidecar.body;
    const h1 = sidecar.body.match(/^# (.+)$/m)?.[1].trim();
    modules.push({
      path,
      url: `${URL_BASE}/${path}/`,
      layer: parts.length === 1 ? ROOT_LAYER : parts[0],
      dir: posix.dirname(md) === "." ? "" : posix.dirname(md),
      isRoot: parts.length === 1,
      isReadme,
      name: isReadme ? basename(path) : basename(stem),
      title: sidecar.title || h1 || basename(path),
      description:
        sidecar.description || (isReadme ? body.split("\n\n")[0] : ""),
      status: sidecar.status,
      source: jsSet.has(js) ? `${BASE}/${js}` : "",
      sidecar: `${BASE}/${md}`,
      js: jsSet.has(js) ? js : "",
      rawBody: body.replace(/^\s*<!-- @format -->\s*/m, ""),
    });
  }

  // Lookups for link resolution and the graph.
  const byPath = new Map(modules.map((m) => [m.path, m]));
  const byJs = new Map(modules.filter((m) => m.js).map((m) => [m.js, m]));
  const byName = new Map();
  for (const m of modules) {
    if (!byName.has(m.name)) byName.set(m.name, []);
    byName.get(m.name).push(m);
  }
  const layerNames = [...new Set(modules.map((m) => m.layer))];
  const layerUrl = (layer) => `${URL_BASE}/${layer}/`;

  /** A repo path (md or js, any folder) → the reference URL that covers it. */
  const urlForRepoPath = (repoPath) => {
    if (repoPath.startsWith("ia/docs/")) {
      return `/${repoPath
        .slice(3)
        .replace(/\.md$/, "")
        .replace(/(^|\/)README$/, "")}/`.replace(/\/+/g, "/");
    }
    if (!repoPath.startsWith(`${BASE}/`) && repoPath !== BASE) return "";
    const rel = repoPath.slice(BASE.length + 1).replace(/\/$/, "");
    if (!rel || rel === "README.md") return `${URL_BASE}/`;
    const stem = rel.replace(/\.(md|js)$/, "");
    if (byPath.has(stem)) return byPath.get(stem).url;
    const folder = stem.replace(/\/README$/, "");
    if (byPath.has(folder)) return byPath.get(folder).url;
    if (layerNames.includes(folder)) return layerUrl(folder);
    return "";
  };

  // Design-reference pages by component file name, so a sidecar that names a
  // template (`[[badge.njk]]`) links to that component's page.
  const designPages = new Map();
  const walkDesign = (dir) => {
    for (const entry of readdirSync(join(ROOT, "ia/docs/design", dir), {
      withFileTypes: true,
    })) {
      const rel = dir ? `${dir}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walkDesign(rel);
      else if (entry.name.endsWith(".md") && entry.name !== "README.md") {
        const name = entry.name.replace(/\.md$/, "");
        const url = `/docs/design/${rel.replace(/\.md$/, "")}/`;
        designPages.set(name, designPages.has(name) ? "" : url);
      }
    }
  };
  walkDesign("");

  /**
   * Rewrites a sidecar's links for the site: a link to another choreography
   * file points at that module's page, and one that can't resolve here keeps
   * its label and drops the link.
   */
  const resolveLinks = (md, dir) => {
    const wiki = (target, label) => {
      const clean = target.split("#")[0].replace(/\.(md|js|njk)$/, "");
      const hit =
        byPath.get(clean) ||
        byPath.get(clean.replace(/^.*js\/choreography\//, "")) ||
        (byName.get(basename(clean))?.length === 1
          ? byName.get(basename(clean))[0]
          : null);
      const text = label || basename(clean);
      if (hit) return `[${text}](${hit.url})`;
      const design = /\.njk$/.test(target) && designPages.get(basename(clean));
      return design ? `[${text}](${design})` : text;
    };
    return md
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_, t, l) => wiki(t, l))
      .replace(/\[\[([^\]]+)\]\]/g, (_, t) => wiki(t))
      .replace(/(!?)\[([^\]]+)\]\(([^)\s]+)\)/g, (all, bang, label, href) => {
        if (bang || /^(https?:|mailto:|#|\/)/.test(href)) return all;
        const [file, anchor] = decodeURI(href).split("#");
        const url = urlForRepoPath(
          posix.normalize(posix.join(BASE, dir, file)),
        );
        return url ? `[${label}](${url}${anchor ? `#${anchor}` : ""})` : label;
      });
  };

  // Specs that name a module's file. Short or generic names would match by
  // accident, so they're left out.
  const specs = readdirSync(join(ROOT, "specs/animation"))
    .filter((f) => f.endsWith(".md") && !/^(README|template)\.md$/.test(f))
    .map((f) => ({
      path: `specs/animation/${f}`,
      text: read(`specs/animation/${f}`),
    }));

  const link = (m) => ({ title: m.title, url: m.url, path: m.path });
  for (const m of modules) {
    const body = m.rawBody.replace(/^# .+\n?/m, "").trim();
    m.body = resolveLinks(body, m.dir);
    m.description = resolveLinks(m.description, m.dir).replace(
      /\[([^\]]+)\]\([^)]*\)/g,
      "$1",
    );
    delete m.rawBody;

    const toLinks = (files) =>
      [...new Set((files || []).map((f) => byJs.get(f)).filter(Boolean))]
        .filter((other) => other !== m)
        .map(link);
    m.builtFrom = m.js ? toLinks(graph.imports.get(m.js)) : [];
    m.usedBy = m.js ? toLinks(graph.importedBy.get(m.js)) : [];

    const file = m.js && basename(m.js);
    m.specs =
      file && file.length >= 10 && !/^index\./.test(file)
        ? specs.filter((s) => s.text.includes(file)).map((s) => s.path)
        : [];

    // Reduced motion: what the sidecar says, beside what the code does.
    const code = m.js ? graph.source.get(m.js) : "";
    const prose = `${m.description}\n${m.body}`;
    m.reducedMotion = {
      usesScrollTrigger: /ScrollTrigger\.(create|batch)|scrollTrigger\s*:/.test(
        code,
      ),
      codeBranch: /reduce(d)?[-_ ]?motion|reduceMotion|prefersReduced/i.test(
        code,
      ),
      documented: section(m.body, "Reduced motion")
        ? "section"
        : /reduced[- ]motion|prefers-reduced-motion/i.test(prose)
          ? "mentioned"
          : "none",
    };
  }

  // Sidebar placement: modules straight under the layer first, then one
  // labelled group per subfolder that holds more than one page.
  const layers = [...layerNames]
    .sort((a, b) => {
      const ia = LAYER_ORDER.indexOf(a);
      const ib = LAYER_ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
    })
    .map((name, index) => {
      const members = modules.filter((m) => m.layer === name);
      const folderCount = new Map();
      for (const m of members) {
        folderCount.set(m.dir, (folderCount.get(m.dir) || 0) + 1);
      }
      for (const m of members) {
        const sub = m.dir.split("/").slice(1).join("/");
        m.group = m.isRoot
          ? ROOT_GROUP
          : sub && folderCount.get(m.dir) > 1
            ? sub
            : "";
      }
      const rank = (m) => (m.isRoot ? 2 : m.group ? 1 : 0);
      members.sort(
        (a, b) =>
          rank(a) - rank(b) ||
          a.group.localeCompare(b.group) ||
          Number(b.isReadme) - Number(a.isReadme) ||
          a.name.localeCompare(b.name),
      );
      members.forEach((m, i) => (m.order = i));

      const readme = layerReadmes.get(name);
      const intro = readme ? readmeBody(read(`${BASE}/${readme}`)) : "";
      const [lede, ...rest] = intro.split(/\n\n+/);
      const groups = [];
      for (const m of members) {
        const last = groups.at(-1);
        if (last && last.title === m.group) last.modules.push(link(m));
        else groups.push({ title: m.group, modules: [link(m)] });
        groups.at(-1).modules.at(-1).description = m.description;
      }
      return {
        name,
        title: titleCase(name),
        url: layerUrl(name),
        order: index,
        readme: readme ? `${BASE}/${readme}` : "",
        description: lede
          ? resolveLinks(lede, name).replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
          : "",
        body: resolveLinks(rest.join("\n\n"), name),
        groups,
        count: members.length,
      };
    });

  // Sections: a layer in SECTION_LAYERS is its own; the rest fold into
  // "system". `section` is the nav key the module's page sits under. A folded
  // layer's modules take the layer's title as their one group and keep their
  // relative order; "system" itself goes first, as Core.
  const folded = layers.filter((l) => !SECTION_LAYERS.includes(l.name));
  const foldOrder = [layers.find((l) => l.name === FOLD_INTO), ...folded]
    .filter(Boolean)
    .map((l) => l.name);
  for (const layer of layers) {
    const host = SECTION_LAYERS.includes(layer.name) ? layer.name : FOLD_INTO;
    layer.section = `choreography/${host}`;
    layer.sectionOrder = SECTION_LAYERS.indexOf(host);
    layer.folded = host !== layer.name;
    if (layer.name === FOLD_INTO) {
      layer.foldedLayers = folded.map(({ title, url, count, description }) => ({
        title,
        url,
        count,
        description,
      }));
    }
  }
  for (const m of modules) {
    const layer = layers.find((l) => l.name === m.layer);
    m.section = layer.section;
    if (layer.section !== `choreography/${FOLD_INTO}`) continue;
    m.group = m.layer === FOLD_INTO ? CORE_GROUP : layer.title;
    m.order += (foldOrder.indexOf(m.layer) + 1) * FOLD_GROUP_STRIDE;
  }

  const overview = readmeBody(read(`${BASE}/README.md`));
  return {
    modules,
    layers,
    overview: {
      howItRuns: resolveLinks(section(overview, "How it runs"), ""),
      howItConnects: resolveLinks(section(overview, "How it connects"), ""),
      // The policy's rules, with its `###` headings lowered a level so they
      // sit under the page's own `##`.
      accessibilityRules: section(
        parseSidecar(read("specs/animation/motion-accessibility-policy.md"))
          .body,
        "Hard Rules \\(Must\\)",
      ),
    },
    urlFor: (path) => byPath.get(path)?.url || "",
  };
}

/* ------------------------------------------------------------------ */
/* Config: contracts and tuning                                        */
/* ------------------------------------------------------------------ */

const rows = (obj) =>
  Object.entries(obj).map(([key, value]) => ({ key, value }));
const json = (value) => JSON.stringify(value, null, 2);

const TOKEN_UNITS = {
  duration: "ms",
  ease: "",
  distance: "px",
  stagger: "s",
  opacity: "",
  blur: "px",
  zLayer: "",
};

function buildConfig(urlFor) {
  // Which presets file declares each export.
  const presetDir = "config/ix/presets";
  const presetFile = new Map();
  for (const file of readdirSync(join(ROOT, BASE, presetDir))) {
    if (!file.endsWith(".js")) continue;
    const text = read(`${BASE}/${presetDir}/${file}`);
    for (const [, name] of text.matchAll(LOCAL_EXPORT_RE)) {
      presetFile.set(name, `${presetDir}/${file.replace(/\.js$/, "")}`);
    }
  }

  const { SELECTORS, ...elementSets } = selectorSets;
  const profileKeys = ["base", "sm", "md", "lg", "xl", "reduced"];
  const conditionsFor = (key) =>
    key === "reduced" ? { reduceMotion: true } : { [key]: true };
  const profileRow = (sectionKey) => ({
    section: sectionKey,
    cells: profileKeys.map((key) => {
      const p = resolveSectionMotionProfile(sectionKey, conditionsFor(key));
      return {
        key,
        variant: p.animation?.variant || "",
        timeline: Boolean(p.timeline?.enabled),
        trigger: Boolean(p.trigger?.enabled),
      };
    }),
  });

  return {
    events: Object.entries(EVENTS).map(([group, names]) => ({
      group,
      rows: rows(names),
    })),
    sectionEvents: rows(makeSectionEvents("<section>")),
    sectionIds: rows(SELECTORS),
    elementSets: Object.entries(elementSets).map(([name, set]) => {
      const { elementAttribute = "", ...rest } = set;
      return { name, attribute: elementAttribute, rows: rows(rest) };
    }),
    timelines: rows(TIMELINE_IDS),
    presets: Object.entries(presetExports)
      .filter(([, value]) => typeof value !== "function")
      .map(([name, value]) => {
        const path = presetFile.get(name) || "";
        return {
          name,
          source: path ? `${BASE}/${path}.js` : "",
          url: urlFor(path),
          json: json(value),
        };
      }),
    profiles: {
      keys: profileKeys,
      default: profileRow("(any other section)"),
      sections: Object.keys(SECTION_OVERRIDES).map(profileRow),
    },
    breakpoints: rows(BREAKPOINT_MATCH_MEDIA_CONDITIONS),
    accessibility: rows(ACCESSIBILITY_SETTINGS),
    tokens: Object.entries(motionTokens).map(([group, values]) => ({
      group,
      unit: TOKEN_UNITS[group] ?? "",
      rows: rows(values).map((r) => ({
        ...r,
        gsap: group === "ease" ? GSAP_EASE[r.key] || "" : "",
      })),
    })),
    animationDefaults: json(ANIMATION_DEFAULTS),
    scrollDefaults: rows(SCROLL_DEFAULTS),
  };
}

/* ------------------------------------------------------------------ */

let cache;

/**
 * Everything the choreography reference renders: `modules` (one per sidecar),
 * `layers` (one per folder under js/choreography/), `overview` (sections of
 * the choreography README), `config` (contracts and tuning values), and
 * `coverage` (reduced-motion documentation per module).
 */
export function readChoreographyDocs() {
  if (cache) return cache;
  const { modules, layers, overview, urlFor } = buildModules();
  cache = {
    modules,
    layers,
    overview,
    config: buildConfig(urlFor),
    coverage: modules
      // Barrels only re-export, so a match in one is a comment or a name.
      .filter(
        (m) =>
          m.js &&
          m.name !== "index" &&
          (m.reducedMotion.usesScrollTrigger || m.reducedMotion.codeBranch),
      )
      .map((m) => ({
        title: m.title,
        url: m.url,
        path: m.path,
        ...m.reducedMotion,
      })),
  };
  return cache;
}

/** Drops the cache, so a dev-server rebuild re-reads edited sidecars. */
export function resetChoreographyDocs() {
  cache = undefined;
}
