/**
 * Generates the README banner (.github/readme/banner.svg) from design tokens.
 *
 * GitHub renders README images in a sandbox with no web fonts, so DraftPaper
 * text is outlined to paths here. Colours come from styles/colors.css; slate
 * is Tailwind's default palette and is not in the token file.
 *
 * Output is deterministic: same tokens + font + hanko → same file.
 */
import fs from "node:fs";
import path from "node:path";
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
const BAR = { x: 8, y: 8, w: W - 16, h: 68 };

function grid() {
  return `<defs>
  <pattern id="minor" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="${c.grid}" stroke-opacity=".08"/></pattern>
  <pattern id="major" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="${c.grid}" stroke-opacity=".14"/></pattern>
</defs>
<rect width="${W}" height="${H}" fill="${c.paper}"/>
<rect width="${W}" height="${H}" fill="url(#minor)"/>
<rect width="${W}" height="${H}" fill="url(#major)"/>`;
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

/** Title block, mirroring views/organisms/header/global-header.njk. */
function titleBlock(hanko) {
  const cells = [
    { w: 96 },
    { w: 120, dt: "DOC NO.", dd: "DOC 00", ddFill: c.text },
    { w: 520, dt: "SECTION", dd: "README", ddFill: c.accent },
    {
      dt: "STACK",
      dd: "ELEVENTY / TAILWIND / SANITY / FIGMA / GSAP",
      ddFill: c.link,
    },
  ];
  const parts = [
    `<rect x="${BAR.x}" y="${BAR.y}" width="${BAR.w}" height="${BAR.h}" fill="${c.panel}" stroke="${c.rule}"/>`,
  ];
  let x = BAR.x;
  cells.forEach((cell, i) => {
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
function plate() {
  const x = 32;
  const y = 100;
  const w = 584;
  const h = 276;
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c.paper}"/>`,
    label("DOC 00 / SOURCE", x + 32, y + 40, 15, c.text),
    `<path d="M${x + 32} ${y + 56}H${x + w - 32}" stroke="${c.label}"/>`,
    label("RUSSELL LEBO / PORTFOLIO FRONTEND", x + 32, y + 88, 15, c.text),
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

function build() {
  const hankoSrc = fs.readFileSync(path.join(OUT_DIR, "hanko.svg"), "utf8");
  const hanko = hankoSrc.replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title">
<title id="title">data:ink:io: the source for Russ Lebo's portfolio</title>
${grid()}
${tiles()}
${titleBlock(hanko)}
${plate()}
</svg>
`;
  fs.writeFileSync(path.join(OUT_DIR, "banner.svg"), svg);
  console.log(
    `README banner → ${path.relative(ROOT, path.join(OUT_DIR, "banner.svg"))} (${(svg.length / 1024).toFixed(1)} KB)`,
  );
}

build();
