#!/usr/bin/env node
/** @format */

/**
 * Frontmatter Structural-Debt Audit
 *
 * Scans every tracked file for frontmatter in all three dialects currently
 * present in the repo, classifies each key against the target schema, and emits
 * a reproducible snapshot plus visualization sources.
 *
 * The same script produces the "before" and "after" snapshots, so the two are
 * measured identically and the delta is trustworthy.
 *
 * USAGE:
 *   node scripts/auditFrontmatter.js --label before
 *   node scripts/auditFrontmatter.js --label after
 *   node scripts/auditFrontmatter.js --label after --compare before
 *   node scripts/auditFrontmatter.js --check   # CI gate: exit 1 on a NEW missing sidecar vs. scripts/.sidecar-baseline.json
 *   node scripts/auditFrontmatter.js --check --update-baseline   # accept current missing sidecars as the new baseline
 *
 * OUTPUT (docs/frontmatter-audit/<label>/):
 *   snapshot.json          all metrics, machine-readable
 *   *.mmd                  Mermaid sources — render via `npm run diagrams:export`
 *   keys-cooccurrence.gexf Gephi graph: keys clustered into schema profiles
 *   files-schema.gexf      Gephi graph: files linked by shared schema shape
 */

import { execFileSync } from "child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, extname, basename, dirname } from "path";
import chalk from "chalk";
import {
  KEEP_CORE,
  KEEP_FUNCTIONAL,
  DROP_DERIVABLE,
  DROP_REDUNDANT,
  MIGRATE,
  STATUS_ENUM,
  TYPE_ENUM,
  NULL_TAGS,
  isExempt,
  verdictFor,
} from "./lib/frontmatterSchema.js";

// Schema classification is shared with the codemod and the linter — see
// scripts/lib/frontmatterSchema.js. Nothing here re-declares a key list.

// ---------------------------------------------------------------------------
// Collection
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const readFlag = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const label = readFlag("label", "current");
const compareWith = readFlag("compare");
const checkOnly = args.includes("--check");
const updateBaseline = args.includes("--update-baseline");
const SIDECAR_BASELINE_PATH = "scripts/.sidecar-baseline.json";

const OUT_ROOT = "docs/frontmatter-audit";
const OUT_DIR = join(OUT_ROOT, label);

/** git ls-files with NUL separators so paths containing spaces survive. */
function tracked(...patterns) {
  const out = execFileSync(
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
  );
  return out.split("\0").filter(Boolean);
}

/** Top-level YAML keys, in order, with the byte cost of each key's block. */
function parseBlock(block) {
  const keys = [];
  let current = null;
  for (const line of block.split("\n")) {
    const m = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (m) {
      current = { key: m[1], value: m[2].trim(), bytes: line.length + 1 };
      keys.push(current);
    } else if (current) {
      current.bytes += line.length + 1;
      if (/^\s*-\s*/.test(line)) {
        current.items ??= [];
        current.items.push(line.replace(/^\s*-\s*/, "").trim());
      }
    }
  }
  return keys;
}

/** Documentary frontmatter: a leading `---` fence in a markdown file. */
function readMarkdownFrontmatter(text) {
  if (!text.startsWith("---")) return null;
  const end = text.indexOf("\n---", 3);
  if (end < 0) return null;
  return text.slice(3, end).replace(/^\n/, "");
}

/** Dialect 2: a `---` fenced YAML block inside a leading JSDoc comment. */
const INLINE_RE = /\/\*\*?\s*\n\s*\*\s*---\s*\n([\s\S]*?)\*\s*---\s*\n\s*\*\//;
function readInlineFrontmatter(text) {
  const m = INLINE_RE.exec(text.slice(0, 2000));
  if (!m) return null;
  return {
    raw: m[0],
    body: m[1].replace(/^\s*\*[ ]?/gm, ""),
  };
}

const markdown = tracked("*.md").filter((f) => !isExempt(f));
const sources = tracked("*.js", "*.njk", "*.mjs", "*.ts", "*.css").filter(
  (f) => !isExempt(f),
);
const markdownSet = new Set(markdown);

const keyStats = new Map(); // key -> { files, bytes, values:Map }
const mdKeyBytes = new Map(); // markdown-only bytes, so inline isn't counted twice
const cooccurrence = new Map(); // "a|b" -> count
const fileProfiles = []; // { file, keys, dialect }
const statusValues = new Map();
const typeValues = new Map();
const tagValues = new Map();

let mdWithFm = 0;
let mdWithoutFm = 0;
let withDescription = 0;
let withTitle = 0;
let taggedFiles = 0;
let hashFormattedTagFiles = 0;
let fmBytes = 0;

const bump = (map, k, n = 1) => map.set(k, (map.get(k) ?? 0) + n);

function record(file, entries, dialect) {
  const names = [];
  for (const { key, value, bytes, items } of entries) {
    names.push(key);
    if (!keyStats.has(key))
      keyStats.set(key, { files: 0, bytes: 0, values: new Map() });
    const s = keyStats.get(key);
    s.files += 1;
    s.bytes += bytes;
    if (dialect !== "inline-jsdoc") bump(mdKeyBytes, key, bytes);
    if (value) bump(s.values, value.replace(/^["']|["']$/g, ""));
    if (key === "status" && value)
      bump(statusValues, value.replace(/^["']|["']$/g, ""));
    if (key === "type" && value)
      bump(typeValues, value.replace(/^["']|["']$/g, ""));
    if (key === "tags" && items)
      for (const t of items) bump(tagValues, t.replace(/^["']|["']$/g, ""));
  }
  const unique = [...new Set(names)].sort();
  for (let i = 0; i < unique.length; i++)
    for (let j = i + 1; j < unique.length; j++)
      bump(cooccurrence, `${unique[i]}|${unique[j]}`);
  fileProfiles.push({ file, keys: unique, dialect });
}

for (const file of markdown) {
  const text = readFileSync(file, "utf8");
  const block = readMarkdownFrontmatter(text);
  if (block === null) {
    mdWithoutFm += 1;
    fileProfiles.push({ file, keys: [], dialect: "none" });
    continue;
  }
  mdWithFm += 1;
  fmBytes += block.length;
  const entries = parseBlock(block);
  const names = new Set(entries.map((e) => e.key));
  if (/^description\s*:\s*\S/m.test(block)) withDescription += 1;
  if (/^title\s*:\s*\S/m.test(block)) withTitle += 1;
  if (names.has("tags")) {
    taggedFiles += 1;
    const tagEntry = entries.find((e) => e.key === "tags");
    if (tagEntry?.items?.some((t) => /^["']?#/.test(t)))
      hashFormattedTagFiles += 1;
  }
  const isRendered = [...names].some((k) =>
    ["permalink", "layout", "eleventyComputed", "pagination"].includes(k),
  );
  record(file, entries, isRendered ? "eleventy-md" : "sidecar-md");
}

let inlineFiles = 0;
let inlineBytes = 0;
const inlineList = [];
for (const file of sources) {
  const text = readFileSync(file, "utf8");
  const inline = readInlineFrontmatter(text);
  if (!inline) continue;
  inlineFiles += 1;
  inlineBytes += inline.raw.length;
  inlineList.push(file);
  record(file, parseBlock(inline.body), "inline-jsdoc");
}

// Sidecar coverage — the Obsidian discoverability surface.
const needsSidecar = sources.filter((f) => /\.(js|njk)$/.test(f));
const missingSidecar = needsSidecar.filter(
  (f) => !markdownSet.has(f.replace(/\.[^.]+$/, ".md")),
);

if (checkOnly) {
  // Zero-tolerance isn't viable yet — 100+ pre-existing gaps sit outside
  // views/, mostly in scripts/ and test/. Gate on regressions instead: fail
  // only when a file goes missing its sidecar that the baseline didn't
  // already know about, so new orphans (the failure mode this gate exists
  // for) get caught without blocking on unrelated legacy debt.
  if (updateBaseline) {
    writeFileSync(
      SIDECAR_BASELINE_PATH,
      JSON.stringify({ missing: missingSidecar.sort() }, null, 2) + "\n",
    );
    console.log(
      chalk.green(
        `  ✓ baseline updated: ${missingSidecar.length} known-missing sidecars recorded in ${SIDECAR_BASELINE_PATH}`,
      ),
    );
    process.exit(0);
  }

  const baseline = existsSync(SIDECAR_BASELINE_PATH)
    ? new Set(
        JSON.parse(readFileSync(SIDECAR_BASELINE_PATH, "utf8")).missing,
      )
    : new Set();
  const newlyMissing = missingSidecar.filter((f) => !baseline.has(f));

  if (newlyMissing.length) {
    console.log(
      chalk.red(
        `\n  ✖ ${newlyMissing.length} new .js/.njk file(s) missing a .md sidecar:\n`,
      ),
    );
    for (const f of newlyMissing) console.log(`    ${f}`);
    console.log(
      chalk.dim(
        `\n  (${baseline.size} pre-existing gaps outside the baseline are not gated — see ${SIDECAR_BASELINE_PATH})\n`,
      ),
    );
    process.exit(1);
  }
  console.log(
    chalk.green(
      `  ✓ no new sidecar gaps (${missingSidecar.length} pre-existing, tracked in baseline)`,
    ),
  );
  process.exit(0);
}

// Byte accounting against the target schema.
let keepBytes = 0;
let dropBytes = 0;
for (const [key, bytes] of mdKeyBytes) {
  if (verdictFor(key).startsWith("keep")) keepBytes += bytes;
  else dropBytes += bytes;
}

const nullTagCount = [...tagValues]
  .filter(([t]) => NULL_TAGS.has(t))
  .reduce((n, [, c]) => n + c, 0);

const snapshot = {
  label,
  generated: new Date().toISOString().slice(0, 10),
  totals: {
    markdownFiles: markdown.length,
    markdownWithFrontmatter: mdWithFm,
    markdownWithoutFrontmatter: mdWithoutFm,
    distinctKeys: keyStats.size,
    sourceFiles: needsSidecar.length,
    missingSidecar: missingSidecar.length,
    inlineDialectFiles: inlineFiles,
  },
  coverage: {
    description: withDescription,
    title: withTitle,
    descriptionPct: +((withDescription / Math.max(mdWithFm, 1)) * 100).toFixed(
      1,
    ),
    titlePct: +((withTitle / Math.max(mdWithFm, 1)) * 100).toFixed(1),
    sidecarPct: +(
      ((needsSidecar.length - missingSidecar.length) /
        Math.max(needsSidecar.length, 1)) *
      100
    ).toFixed(1),
    taggedFiles,
    hashFormattedTagFiles,
  },
  bytes: {
    markdownFrontmatter: fmBytes,
    inlineJsdoc: inlineBytes,
    keep: keepBytes,
    drop: dropBytes,
    dropPct: +((dropBytes / Math.max(keepBytes + dropBytes, 1)) * 100).toFixed(
      1,
    ),
    removableTotal: dropBytes + inlineBytes,
  },
  dialects: {
    "sidecar-md": fileProfiles.filter((f) => f.dialect === "sidecar-md").length,
    "eleventy-md": fileProfiles.filter((f) => f.dialect === "eleventy-md")
      .length,
    "inline-jsdoc": inlineFiles,
    none: mdWithoutFm,
  },
  enums: {
    status: Object.fromEntries([...statusValues].sort((a, b) => b[1] - a[1])),
    statusIllegal: [...statusValues].filter(([v]) => !STATUS_ENUM.includes(v))
      .length,
    type: Object.fromEntries([...typeValues].sort((a, b) => b[1] - a[1])),
    typeIllegal: [...typeValues].filter(([v]) => !TYPE_ENUM.includes(v)).length,
  },
  tags: {
    distinct: tagValues.size,
    nullTagInstances: nullTagCount,
    top: Object.fromEntries(
      [...tagValues].sort((a, b) => b[1] - a[1]).slice(0, 15),
    ),
  },
  keys: Object.fromEntries(
    [...keyStats]
      .sort((a, b) => b[1].files - a[1].files)
      .map(([k, s]) => [
        k,
        { files: s.files, bytes: s.bytes, verdict: verdictFor(k) },
      ]),
  ),
  inlineFiles: inlineList,
};

// ---------------------------------------------------------------------------
// Emitters
// ---------------------------------------------------------------------------

const esc = (s) =>
  String(s).replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );

function gexfKeys() {
  const nodes = [...keyStats].filter(([, s]) => s.files >= 2);
  const ids = new Map(nodes.map(([k], i) => [k, i]));
  const rows = nodes
    .map(
      ([k, s]) =>
        `      <node id="${ids.get(k)}" label="${esc(k)}">\n` +
        `        <attvalues>\n` +
        `          <attvalue for="0" value="${s.files}"/>\n` +
        `          <attvalue for="1" value="${verdictFor(k)}"/>\n` +
        `          <attvalue for="2" value="${s.bytes}"/>\n` +
        `        </attvalues>\n` +
        `        <viz:size value="${Math.max(4, Math.round(Math.sqrt(s.files) * 3))}"/>\n` +
        `      </node>`,
    )
    .join("\n");
  let e = 0;
  const edges = [...cooccurrence]
    .filter(([pair, w]) => {
      const [a, b] = pair.split("|");
      return w >= 3 && ids.has(a) && ids.has(b);
    })
    .map(([pair, w]) => {
      const [a, b] = pair.split("|");
      return `      <edge id="${e++}" source="${ids.get(a)}" target="${ids.get(b)}" weight="${w}"/>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<gexf xmlns="http://www.gexf.net/1.2draft" xmlns:viz="http://www.gexf.net/1.2draft/viz" version="1.2">
  <meta lastmodifieddate="${snapshot.generated}">
    <creator>scripts/auditFrontmatter.js</creator>
    <description>Frontmatter key co-occurrence (${label}). Clusters are schema profiles.</description>
  </meta>
  <graph mode="static" defaultedgetype="undirected">
    <attributes class="node">
      <attribute id="0" title="files" type="integer"/>
      <attribute id="1" title="verdict" type="string"/>
      <attribute id="2" title="bytes" type="integer"/>
    </attributes>
    <nodes>
${rows}
    </nodes>
    <edges>
${edges}
    </edges>
  </graph>
</gexf>
`;
}

function gexfFiles() {
  // Files as nodes, linked to the keys they carry: a bipartite graph whose
  // clusters are populations of files sharing a schema shape.
  const files = fileProfiles.filter((f) => f.keys.length);
  const keyNodes = [...keyStats]
    .filter(([, s]) => s.files >= 2)
    .map(([k]) => k);
  const ids = new Map();
  let n = 0;
  for (const k of keyNodes) ids.set(`key:${k}`, n++);
  for (const f of files) ids.set(`file:${f.file}`, n++);
  const nodeRows = [
    ...keyNodes.map(
      (k) =>
        `      <node id="${ids.get(`key:${k}`)}" label="${esc(k)}">\n        <attvalues>\n          <attvalue for="0" value="key"/>\n          <attvalue for="1" value="${verdictFor(k)}"/>\n        </attvalues>\n      </node>`,
    ),
    ...files.map(
      (f) =>
        `      <node id="${ids.get(`file:${f.file}`)}" label="${esc(basename(f.file))}">\n        <attvalues>\n          <attvalue for="0" value="file"/>\n          <attvalue for="1" value="${f.dialect}"/>\n          <attvalue for="2" value="${esc(dirname(f.file).split("/")[0])}"/>\n        </attvalues>\n      </node>`,
    ),
  ].join("\n");
  let e = 0;
  const edgeRows = files
    .flatMap((f) =>
      f.keys
        .filter((k) => ids.has(`key:${k}`))
        .map(
          (k) =>
            `      <edge id="${e++}" source="${ids.get(`file:${f.file}`)}" target="${ids.get(`key:${k}`)}"/>`,
        ),
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<gexf xmlns="http://www.gexf.net/1.2draft" version="1.2">
  <meta lastmodifieddate="${snapshot.generated}">
    <creator>scripts/auditFrontmatter.js</creator>
    <description>File-to-key bipartite graph (${label}).</description>
  </meta>
  <graph mode="static" defaultedgetype="undirected">
    <attributes class="node">
      <attribute id="0" title="kind" type="string"/>
      <attribute id="1" title="group" type="string"/>
      <attribute id="2" title="area" type="string"/>
    </attributes>
    <nodes>
${nodeRows}
    </nodes>
    <edges>
${edgeRows}
    </edges>
  </graph>
</gexf>
`;
}

function mermaidDialects() {
  const d = snapshot.dialects;
  return `---
title: Frontmatter dialects (${label})
---
flowchart TB
    R["Tracked files"]

    R --> D1["Dialect 1 — sidecar markdown YAML<br/><b>${d["sidecar-md"]} files</b>"]
    R --> D2["Dialect 2 — inline YAML in JSDoc<br/><b>${d["inline-jsdoc"]} files</b>"]
    R --> D3["Dialect 3 — Eleventy-rendered markdown<br/><b>${d["eleventy-md"]} files</b>"]
    R --> D4["No frontmatter<br/><b>${d.none} files</b>"]

    D1 --> READ1["Obsidian · agents"]
    D2 --> READ2["nothing reads this"]
    D3 --> READ3["Eleventy build"]
    D4 --> READ4["undiscoverable"]

    classDef ok fill:#1b4332,stroke:#40916c,color:#d8f3dc
    classDef bad fill:#4a1c1c,stroke:#9b2226,color:#ffdada
    classDef warn fill:#4a3c11,stroke:#bb9457,color:#ffeccc
    class D1,D3,READ1,READ3 ok
    class D2,READ2,D4,READ4 bad
`;
}

function mermaidVerdict() {
  const byVerdict = new Map();
  for (const [k, bytes] of mdKeyBytes) bump(byVerdict, verdictFor(k), bytes);
  const order = [
    "keep-core",
    "keep-functional",
    "keep-domain",
    "migrate",
    "drop-derivable",
    "drop-redundant",
    "review",
  ];
  const rows = order
    .filter((v) => byVerdict.get(v))
    .map((v) => `    "${v}" : ${byVerdict.get(v)}`)
    .join("\n");
  return `---
title: Markdown frontmatter bytes by verdict (${label})
config:
  pie:
    textPosition: 0.6
---
pie showData
${rows}
`;
}

function mermaidCoverage() {
  const c = snapshot.coverage;
  return `---
title: Field coverage vs. target (${label})
---
xychart-beta
    title "Coverage of the fields that carry signal (%) — higher is better"
    x-axis ["description", "title", "sidecar present"]
    y-axis "percent of applicable files" 0 --> 100
    bar [${c.descriptionPct}, ${c.titlePct}, ${c.sidecarPct}]
`;
}

/** Counts that should all read zero once the repo conforms. */
function mermaidDebt() {
  const s = snapshot;
  return `---
title: Debt counters (${label}) — every bar should reach zero
---
xychart-beta
    title "Structural debt counters — lower is better"
    x-axis ["distinct keys", "no frontmatter", "inline dialect", "null tags", "illegal status"]
    y-axis "count" 0 --> ${Math.max(
      s.totals.distinctKeys,
      s.totals.markdownWithoutFrontmatter,
      s.totals.inlineDialectFiles,
      s.tags.nullTagInstances,
      10,
    )}
    bar [${s.totals.distinctKeys}, ${s.totals.markdownWithoutFrontmatter}, ${s.totals.inlineDialectFiles}, ${s.tags.nullTagInstances}, ${s.enums.statusIllegal}]
`;
}

function mermaidAuthority() {
  const s = snapshot;
  const stable = s.enums.status.stable ?? 0;
  const aixFiles = s.totals.inlineDialectFiles;
  const missingDesc = s.totals.markdownWithFrontmatter - s.coverage.description;
  const nullTags = s.tags.nullTagInstances;

  // Each rule is green once the repo actually satisfies it.
  const rules = [
    [
      "description required",
      missingDesc,
      `${s.coverage.description}/${s.totals.markdownWithFrontmatter} present`,
    ],
    [
      "status within enum",
      s.enums.statusIllegal,
      `${s.enums.statusIllegal} illegal · stable=${stable}`,
    ],
    ["aix: namespace retired", aixFiles, `${aixFiles} files carry it`],
    ["tags discriminate", nullTags, `${nullTags} repo-wide tags`],
  ];
  const resolved = rules.every(([, n]) => n === 0);

  const nodes = rules
    .map(
      ([name, n, detail], i) => `        R${i}["${name}<br/><b>${detail}</b>"]`,
    )
    .join("\n");
  const classes = rules
    .map(([, n], i) => `    class R${i} ${n === 0 ? "ok" : "bad"}`)
    .join("\n");

  return `---
title: Frontmatter authority vs. reality (${label})
---
flowchart LR
    subgraph AUTH["Authority"]
        A1["${resolved ? "specs/frontmatter.spec.md<br/><i>single authority</i>" : "docs/ia/frontmatter.md<br/><i>IA Frontmatter Schema</i>"}"]
${resolved ? '        A2["docs/ia/frontmatter.md<br/><i>stub → spec</i>"]\n        A3["ia/docs/ia/frontmatter.md<br/><i>summary → spec</i>"]' : '        A2["ia/docs/ia/frontmatter.md<br/><i>Frontmatter Rules</i>"]\n        A3["dataink.io/CLAUDE.md<br/><i>Non-Negotiables</i>"]'}
    end

    subgraph REALITY["Measured reality"]
${nodes}
    end

    A1 --> R0
    A1 --> R1
    A1 --> R2
    A1 --> R3
${resolved ? "    A2 -.->|defers to| A1\n    A3 -.->|defers to| A1" : '    A1 <-.->|"duplicate, and they differ"| A2\n    A3 -->|"retires aix:"| R2'}

    classDef ok fill:#1b4332,stroke:#40916c,color:#d8f3dc
    classDef bad fill:#4a1c1c,stroke:#9b2226,color:#ffdada
    classDef auth fill:#1d3557,stroke:#457b9d,color:#e8f1f8
    class A1,A2,A3 auth
${classes}
`;
}

function mermaidKeys() {
  const GROUPS = [
    ["keep-core", "Keep — carries signal", "keep"],
    ["keep-functional", "Keep — Eleventy consumes", "keep"],
    ["keep-domain", "Keep — local domain vocabulary", "keep"],
    ["migrate", "Migrate — content moves", "mig"],
    ["drop-derivable", "Drop — derivable from path", "drop"],
    ["drop-redundant", "Drop — redundant or retired", "drop"],
    ["review", "Review — unclassified", "rev"],
  ];
  const safe = (k) => `k_${k.replace(/[^a-zA-Z0-9]/g, "")}`;
  const blocks = GROUPS.map(([verdict, heading]) => {
    const members = [...keyStats]
      .filter(([k]) => verdictFor(k) === verdict)
      .sort((a, b) => b[1].files - a[1].files);
    if (!members.length) return null;
    const total = members.reduce((n, [, s]) => n + s.files, 0);
    const nodes = members
      .map(([k, s]) => `        ${safe(k)}["${k}<br/><b>${s.files}</b>"]`)
      .join("\n");
    return {
      verdict,
      text: `    subgraph ${safe(verdict)}["${heading} — ${members.length} keys · ${total} uses"]\n        direction LR\n${nodes}\n    end`,
      members: members.map(([k]) => k),
    };
  }).filter(Boolean);

  const classes = GROUPS.reduce((acc, [verdict, , cls]) => {
    acc[verdict] = cls;
    return acc;
  }, {});
  const assignments = blocks
    .map(
      (b) => `    class ${b.members.map(safe).join(",")} ${classes[b.verdict]}`,
    )
    .join("\n");

  return `---
title: Every frontmatter key, classified (${label})
---
flowchart TB
${blocks.map((b) => b.text).join("\n\n")}

    classDef keep fill:#1b4332,stroke:#40916c,color:#d8f3dc
    classDef drop fill:#4a1c1c,stroke:#9b2226,color:#ffdada
    classDef mig fill:#4a3c11,stroke:#bb9457,color:#ffeccc
    classDef rev fill:#2b2b3a,stroke:#6c6c8a,color:#dcdcf0
${assignments}
`;
}

mkdirSync(OUT_DIR, { recursive: true });
const files = {
  "snapshot.json": JSON.stringify(snapshot, null, 2) + "\n",
  "dialects.mmd": mermaidDialects(),
  "verdict.mmd": mermaidVerdict(),
  "coverage.mmd": mermaidCoverage(),
  "authority.mmd": mermaidAuthority(),
  "keys.mmd": mermaidKeys(),
  "debt.mmd": mermaidDebt(),
  "keys-cooccurrence.gexf": gexfKeys(),
  "files-schema.gexf": gexfFiles(),
};
for (const [name, body] of Object.entries(files))
  writeFileSync(join(OUT_DIR, name), body);

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log(chalk.bold(`\n  Frontmatter audit — ${chalk.cyan(label)}\n`));
console.log(
  `  markdown files          ${snapshot.totals.markdownFiles}  (${snapshot.totals.markdownWithoutFrontmatter} without frontmatter)`,
);
console.log(`  distinct keys           ${snapshot.totals.distinctKeys}`);
console.log(
  `  dialects in use         ${Object.entries(snapshot.dialects)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}:${v}`)
    .join("  ")}`,
);
console.log(
  `  description coverage    ${snapshot.coverage.description} (${snapshot.coverage.descriptionPct}%)`,
);
console.log(
  `  sidecar coverage        ${snapshot.coverage.sidecarPct}%  (${snapshot.totals.missingSidecar} missing)`,
);
console.log(
  `  illegal status values   ${snapshot.enums.statusIllegal}   null tags: ${snapshot.tags.nullTagInstances}`,
);
console.log(
  `  frontmatter bytes       keep ${kb(snapshot.bytes.keep)} · drop ${kb(snapshot.bytes.drop)} (${snapshot.bytes.dropPct}%)`,
);
console.log(
  `  inline JSDoc blocks     ${snapshot.totals.inlineDialectFiles} files · ${kb(snapshot.bytes.inlineJsdoc)}`,
);
console.log(
  chalk.yellow(
    `  removable total         ${kb(snapshot.bytes.removableTotal)}  (~${Math.round(snapshot.bytes.removableTotal / 4)} tokens)\n`,
  ),
);

if (compareWith) {
  const prevPath = join(OUT_ROOT, compareWith, "snapshot.json");
  if (existsSync(prevPath)) {
    const prev = JSON.parse(readFileSync(prevPath, "utf8"));
    const row = (name, a, b, unit = "") => {
      const d = +(b - a).toFixed(1);
      const arrow = d === 0 ? "→" : d > 0 ? "▲" : "▼";
      const color = d === 0 ? chalk.dim : d > 0 ? chalk.green : chalk.red;
      console.log(
        `  ${name.padEnd(24)} ${String(a).padStart(8)}${unit} ${arrow} ${String(b).padStart(8)}${unit}  ${color(
          `${d > 0 ? "+" : ""}${d}${unit}`,
        )}`,
      );
    };
    console.log(chalk.bold(`  Delta vs. ${compareWith}\n`));
    row(
      "distinct keys",
      prev.totals.distinctKeys,
      snapshot.totals.distinctKeys,
    );
    row(
      "no frontmatter",
      prev.totals.markdownWithoutFrontmatter,
      snapshot.totals.markdownWithoutFrontmatter,
    );
    row(
      "inline dialect files",
      prev.totals.inlineDialectFiles,
      snapshot.totals.inlineDialectFiles,
    );
    row(
      "description %",
      prev.coverage.descriptionPct,
      snapshot.coverage.descriptionPct,
      "%",
    );
    row(
      "sidecar %",
      prev.coverage.sidecarPct,
      snapshot.coverage.sidecarPct,
      "%",
    );
    row(
      "missing sidecars",
      prev.totals.missingSidecar,
      snapshot.totals.missingSidecar,
    );
    row(
      "illegal status",
      prev.enums.statusIllegal,
      snapshot.enums.statusIllegal,
    );
    row("dead-weight %", prev.bytes.dropPct, snapshot.bytes.dropPct, "%");
    console.log();
  }
}

console.log(
  chalk.dim(`  wrote ${Object.keys(files).length} files → ${OUT_DIR}\n`),
);
