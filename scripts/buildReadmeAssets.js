/**
 * Generates the README banner (.github/readme/banner.svg) and the Figma badge
 * data (.github/readme/figma-badge.json) from design tokens.
 *
 * GitHub renders README images in a sandbox with no web fonts, so DraftPaper
 * text is outlined to paths here. Colours come from styles/colors.css; slate
 * is Tailwind's default palette and is not in the token file.
 *
 * Output is deterministic: same tokens + font + hanko → same file.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import opentype from "opentype.js";

const ROOT = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
);
const OUT_DIR = path.join(ROOT, ".github/readme");
const FONT = path.join(ROOT, "assets/fonts/DRAFTPAPER/DRAFTPAPER.otf");

// TOKENS
const tokens = Object.fromEntries(
  [
    ...fs
      .readFileSync(path.join(ROOT, "styles/colors.css"), "utf8")
      .matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{3,8})/gi),
  ].map(([, name, hex]) => [name, hex]),
);
const slate = {
  950: "#020617",
  900: "#0f172a",
  700: "#334155",
  400: "#94a3b8",
  200: "#e2e8f0",
};
const c = {
  paper: slate[950],
  panel: slate[900],
  rule: slate[700],
  label: slate[400],
  text: slate[200],
  accent: tokens["secondary-500"],
  link: tokens["primary-200"],
  grid: tokens["primary-500"],
  tile: tokens["primary-950"],
  tileEdge: tokens["primary-800"],
};

const font = opentype.loadSync(FONT);
const TRACKING = 0.06; // em, matches the site's tracked display caps

/** Outline `str` in DraftPaper; returns { d, width }. */
function text(str, x, y, size) {
  const opts = { letterSpacing: TRACKING };
  const d = font.getPath(str, x, y, size, opts).toPathData(2);
  return { d, width: font.getAdvanceWidth(str, size, opts) };
}

function label(str, x, y, size, fill) {
  return `<path fill="${fill}" d="${text(str, x, y, size).d}"/>`;
}

// LAYOUT
const W = 1280;
const H = 400;
const STRIP_H = 84; // title block only, for folder READMEs
const BAR = { x: 8, y: 8, w: W - 16, h: 68 };

function grid(h = H) {
  return `<defs>
  <pattern id="minor" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="${c.grid}" stroke-opacity=".08"/></pattern>
  <pattern id="major" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="${c.grid}" stroke-opacity=".14"/></pattern>
</defs>
<rect width="${W}" height="${h}" fill="${c.paper}"/>
<rect width="${W}" height="${h}" fill="url(#minor)"/>
<rect width="${W}" height="${h}" fill="url(#major)"/>`;
}

/** The work mosaic behind the hero, reduced to tiles on the major grid. */
function tiles() {
  const out = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const x = 648 + col * 128 + (row % 2) * 32;
      const y = 96 + row * 64;
      if (x >= W || y + 52 > H) continue;
      const lit = (row * 7 + col * 3) % 5 === 0;
      out.push(
        `<rect x="${x}" y="${y}" width="112" height="52" fill="${lit ? c.tileEdge : c.tile}" fill-opacity="${lit ? 0.55 : 0.8}" stroke="${c.tileEdge}"/>`,
      );
    }
  }
  return out.join("\n");
}

/**
 * Title block, mirroring views/organisms/header/global-header.njk. The first
 * cell holds the hanko; each later cell is { w?, dt, dd, ddFill }, and a cell
 * without `w` fills the rest of the bar.
 */
function titleBlock(hanko, cells) {
  const parts = [
    `<rect x="${BAR.x}" y="${BAR.y}" width="${BAR.w}" height="${BAR.h}" fill="${c.panel}" stroke="${c.rule}"/>`,
  ];
  let x = BAR.x;
  [{ w: 96 }, ...cells].forEach((cell, i) => {
    const w = cell.w ?? BAR.x + BAR.w - x;
    if (i > 0)
      parts.push(
        `<path d="M${x} ${BAR.y}V${BAR.y + BAR.h}" stroke="${c.rule}"/>`,
      );
    if (cell.dt) {
      parts.push(label(cell.dt, x + 10, BAR.y + 26, 11, c.label));
      parts.push(
        `<path d="M${x + 8} ${BAR.y + 34}H${x + w - 8}" stroke="${c.rule}"/>`,
      );
      parts.push(label(cell.dd, x + 10, BAR.y + 54, 15, cell.ddFill));
    }
    x += w;
  });
  // Hanko: 635×669 viewBox scaled to 48px tall, centred in the first cell.
  const s = 48 / 669;
  const hx = BAR.x + (96 - 635 * s) / 2;
  const hy = BAR.y + (BAR.h - 48) / 2;
  parts.push(
    `<g transform="translate(${hx.toFixed(2)} ${hy}) scale(${s.toFixed(5)})" fill="${c.accent}">${hanko}</g>`,
  );
  return parts.join("\n");
}

/** Manifesto plate, mirroring views/organisms/section/hero.njk. */
function plate(repo) {
  const x = 32;
  const y = 100;
  const w = 584;
  const h = 276;
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c.paper}"/>`,
    label("DOC 00 / SOURCE", x + 32, y + 40, 15, c.text),
    `<path d="M${x + 32} ${y + 56}H${x + w - 32}" stroke="${c.label}"/>`,
    label(`RUSSELL LEBO / PORTFOLIO ${repo.toUpperCase()}`, x + 32, y + 88, 15, c.text),
    label(
      "2008-2026",
      x + w - 32 - text("2008-2026", 0, 0, 15).width,
      y + 88,
      15,
      c.text,
    ),
    label("THE SOURCE FOR", x + 32, y + 172, 54, c.text),
    label("DATA:INK:IO", x + 32, y + 240, 54, c.accent),
  ].join("\n");
}

/**
 * shields.io endpoint JSON for the README's Figma badge: how many tokens the
 * last Figma sync generated. Style comes from the badge URL, not from here.
 */
function figmaBadge() {
  const fonts = fs
    .readFileSync(path.join(ROOT, "styles/typography/fontFamilies.css"), "utf8")
    .match(/--font-[\w-]+:/g);
  const badge = {
    schemaVersion: 1,
    label: "figma",
    message: `${Object.keys(tokens).length} colours · ${fonts.length} fonts`,
  };
  fs.writeFileSync(
    path.join(OUT_DIR, "figma-badge.json"),
    `${JSON.stringify(badge, null, 2)}\n`,
  );
  console.log(
    `Figma badge  → .github/readme/figma-badge.json (${badge.message})`,
  );
}


// REPOS
// The four repos share one look. Sibling repos are written only when they are
// checked out next to this one (see the vault-root CLAUDE.md for the layout).
const SIBLING = (name) => path.resolve(ROOT, "..", name);
const REPOS = [
  {
    name: "frontend",
    dir: ROOT,
    stack: "ELEVENTY / TAILWIND / SANITY / FIGMA / GSAP",
    tags: ["eleventy", "tailwind", "sanity", "figma", "gsap"],
    // The root README carries hand-written version badges; leave it alone.
    manualRoot: true,
    // ia/ is rendered by Eleventy, where a repo-relative image would break.
    skip: [/^ia\//, /^docs\/frontmatter-audit\//, /^responsive-testing\/templates\//],
    folders: {
      views: ["nunjucks"],
      "js/choreography": ["gsap"],
      js: ["javascript"],
      styles: ["tailwind"],
      "styles/typography": ["tailwind", "figma"],
      "assets/fonts": ["figma"],
      "data/sanity": ["sanity"],
      eleventy: ["eleventy"],
      figma: ["figma"],
      "figma/views/eleventy": ["figma", "eleventy"],
      "figma/views/tailwind": ["figma", "tailwind"],
      scripts: ["node"],
      test: ["node"],
      "specs/animation": ["gsap"],
      "responsive-testing": ["node"],
      docs: ["markdown"],
    },
  },
  {
    name: "backend",
    dir: SIBLING("backend"),
    stack: "SANITY STUDIO / TYPESCRIPT",
    tags: ["sanity", "typescript"],
    folders: { scripts: ["node", "sanity"], docs: ["markdown"] },
  },
  {
    name: "content model",
    dir: SIBLING("content-model"),
    stack: "MARKDOWN CONTRACTS",
    tags: ["markdown", "sanity"],
    folders: {},
  },
  {
    name: "workspace",
    dir: path.resolve(ROOT, ".."),
    stack: "FRONTEND / BACKEND / CONTENT MODEL",
    tags: ["markdown"],
    skip: [/^(frontend|backend|content-model)\//],
    folders: {},
  },
];

// TAGS: shields.io badges, styled like the version badges in the frontend root
// README (slate label, orange value).
const TAGS = {
  eleventy: ["Eleventy", "eleventy", "https://www.11ty.dev"],
  tailwind: ["Tailwind CSS", "tailwindcss", "https://tailwindcss.com"],
  sanity: ["Sanity", "sanity", "https://www.sanity.io"],
  figma: ["Figma", "figma", "https://www.figma.com"],
  gsap: ["GSAP", "greensock", "https://gsap.com"],
  nunjucks: ["Nunjucks", "nunjucks", "https://mozilla.github.io/nunjucks/"],
  javascript: ["JavaScript", "javascript", "https://developer.mozilla.org/docs/Web/JavaScript"],
  typescript: ["TypeScript", "typescript", "https://www.typescriptlang.org"],
  node: ["Node.js", "nodedotjs", "https://nodejs.org"],
  markdown: ["Markdown", "markdown", "https://github.github.com/gfm/"],
};

function badge(tag) {
  const [name, logo, href] = TAGS[tag];
  const text = encodeURIComponent(name.replace(/-/g, "--"));
  const src = `https://img.shields.io/badge/-${text}-eb5e28?style=flat-square&logo=${logo}&logoColor=e2e8f0&labelColor=020617`;
  return `[![${name}](${src})](${href})`;
}

/** Tags for a folder: the longest matching prefix wins, else the repo's first. */
function tagsFor(repo, folder) {
  const key = Object.keys(repo.folders)
    .filter((k) => folder === k || folder.startsWith(`${k}/`))
    .sort((a, b) => b.length - a.length)[0];
  return key ? repo.folders[key] : repo.tags.slice(0, 1);
}

// DraftPaper lacks `_`; folder paths are shown in caps with spaces instead.
const caps = (s) => s.replace(/_/g, " ").toUpperCase();

function bannerSvg(hanko, repo) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title">
<title id="title">data:ink:io: the source for Russ Lebo's portfolio, ${repo.name} repo</title>
${grid()}
${tiles()}
${titleBlock(hanko, [
  { w: 120, dt: "DOC NO.", dd: "DOC 00", ddFill: c.text },
  { w: 520, dt: "SECTION", dd: "README", ddFill: c.accent },
  { dt: "STACK", dd: repo.stack, ddFill: c.link },
])}
${plate(repo.name)}
</svg>
`;
}

function stripSvg(hanko, repo, folder, tags) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${STRIP_H}" viewBox="0 0 ${W} ${STRIP_H}" role="img" aria-labelledby="title">
<title id="title">data:ink:io ${repo.name} repo: ${folder}</title>
${grid(STRIP_H)}
${titleBlock(hanko, [
  { w: 200, dt: "REPO", dd: caps(repo.name), ddFill: c.text },
  { w: 560, dt: "SECTION", dd: caps(folder), ddFill: c.accent },
  { dt: "TAGS", dd: tags.map((t) => caps(TAGS[t][0])).join(" / "), ddFill: c.link },
])}
</svg>
`;
}

const START = "<!-- readme-header: generated by `npm run build:readme`, edit the script, not this block -->";
const END = "<!-- /readme-header -->";

/** Put the header block after frontmatter (and a prettier pragma), replacing any old one. */
function injectHeader(md, block) {
  const clean = md.replace(
    new RegExp(`${START.replace(/[.*+?^${}()|[\]\\`]/g, "\\$&")}[\\s\\S]*?${END}\\n*`),
    "",
  );
  const fm = clean.match(/^---\n[\s\S]*?\n---\n+(<!-- @format -->\n+)?/);
  const head = fm ? fm[0].replace(/\n*$/, "\n\n") : "";
  return `${head}${block}\n\n${clean.slice(fm ? fm[0].length : 0)}`;
}

function listReadmes(dir) {
  return execFileSync(
    "git",
    ["-C", dir, "ls-files", "--cached", "--others", "--exclude-standard"],
    { encoding: "utf8" },
  )
    .split("\n")
    .filter((f) => /(^|\/)README[^/]*\.md$/i.test(f));
}

function buildRepo(hanko, repo) {
  if (!fs.existsSync(path.join(repo.dir, ".git"))) {
    console.log(`skip ${repo.name}: not checked out`);
    return;
  }
  const out = path.join(repo.dir, ".github/readme");
  const strips = path.join(out, "strips");
  fs.mkdirSync(strips, { recursive: true });
  fs.writeFileSync(path.join(out, "banner.svg"), bannerSvg(hanko, repo));

  const written = new Set();
  for (const file of listReadmes(repo.dir)) {
    if (repo.skip?.some((re) => re.test(file))) continue;
    const folder = path.dirname(file);
    const isRoot = folder === ".";
    if (isRoot && repo.manualRoot) continue;

    let img;
    let tags;
    if (isRoot) {
      tags = repo.tags;
      img = `<img src=".github/readme/banner.svg" width="1280" alt="Title block in the style of dataink.io: Doc 00, section README, ${repo.name} repo. The source for data:ink:io.">`;
    } else {
      tags = tagsFor(repo, folder);
      const name = `${folder.replace(/\//g, "--")}.svg`;
      fs.writeFileSync(path.join(strips, name), stripSvg(hanko, repo, folder, tags));
      written.add(name);
      const src = path.posix.relative(folder, `.github/readme/strips/${name}`);
      img = `<img src="${src}" width="1280" alt="Title block: ${repo.name} repo, section ${folder}.">`;
    }
    const block = `${START}\n${img}\n\n${tags.map(badge).join("\n")}\n${END}`;
    const abs = path.join(repo.dir, file);
    const md = fs.readFileSync(abs, "utf8");
    const next = injectHeader(md, block);
    if (next !== md) fs.writeFileSync(abs, next);
  }
  for (const f of fs.readdirSync(strips)) {
    if (!written.has(f)) fs.rmSync(path.join(strips, f));
  }
  console.log(`${repo.name}: banner + ${written.size} folder strips`);
}

function build() {
  const hankoSrc = fs.readFileSync(path.join(OUT_DIR, "hanko.svg"), "utf8");
  const hanko = hankoSrc.replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, "");
  for (const repo of REPOS) buildRepo(hanko, repo);
}

build();
figmaBadge();
