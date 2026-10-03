/** @format */

/**
 * Project-page pager — checks the built site, so run a build first
 * (`npm run quick`), then `npm run test:site`.
 *
 * For every /case-studies/<slug>/ page:
 * - exactly one <nav aria-label="Case studies">
 * - previous, all, and next links resolve to built pages
 * - previous/next are reciprocal (A → next = B  ⇔  B → previous = A)
 * - following `next` visits every project once and returns to the start (wrap)
 */

import { existsSync, readdirSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";

const site = join(dirname(fileURLToPath(import.meta.url)), "../../_site");
const root = join(site, "case-studies");
const failures = [];
const fail = (msg) => failures.push(msg);

if (!existsSync(root)) {
  console.error("❌ _site/case-studies not found. Build first: npm run quick");
  process.exit(1);
}

const resolves = (href) => existsSync(join(site, href, "index.html"));
const pages = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => `/case-studies/${d.name}/`);

const links = new Map();
for (const url of pages) {
  const $ = cheerio.load(readFileSync(join(site, url, "index.html"), "utf8"));
  const nav = $('nav[aria-label="Case studies"]');
  if (nav.length !== 1) {
    fail(`${url}: expected 1 pager, found ${nav.length}`);
    continue;
  }
  const prev = nav.find('a[rel~="prev"]').attr("href");
  const next = nav.find('a[rel~="next"]').attr("href");
  const all = nav.find("a:not([rel])").attr("href");
  for (const [name, href] of Object.entries({ prev, next, all })) {
    if (!href) fail(`${url}: missing ${name} link`);
    else if (!resolves(href)) fail(`${url}: ${name} → ${href} does not resolve`);
  }
  links.set(url, { prev, next });
}

for (const [url, { next }] of links) {
  if (next && links.get(next)?.prev !== url) {
    fail(`${url}: next → ${next}, but its previous → ${links.get(next)?.prev}`);
  }
}

if (pages.length > 1 && links.size === pages.length) {
  const seen = new Set();
  let url = pages[0];
  while (url && !seen.has(url)) {
    seen.add(url);
    url = links.get(url)?.next;
  }
  if (url !== pages[0] || seen.size !== pages.length) {
    fail(`next chain is not a single cycle: visited ${seen.size} of ${pages.length}`);
  }
}

console.log(`\n🧭 Pager: ${pages.length} project pages checked`);
if (failures.length) {
  failures.forEach((f) => console.error(`  ❌ ${f}`));
  process.exit(1);
}
console.log("  ✅ links resolve, are reciprocal, and wrap into one cycle\n");
