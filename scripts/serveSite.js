#!/usr/bin/env node
/**
 * ---
 * aix:
 *   id: frontend.scripts.servesite
 *   role: Build/utility script: scripts/serveSite.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - scripts
 *     - serveSite.js
 * ---
 */
/** @format */

/**
 * Static preview server for the production build output (`_site/`).
 *
 * WHY THIS EXISTS:
 * `npm start` (the 11ty dev server) serves DEBUG artifacts — a multi-MB
 * sourcemapped, unminified JS bundle and unminified CSS. Lighthouse / Core
 * Web Vitals scores read off the dev server are NOT representative of
 * production and run ~20 points low. Performance must be measured against the
 * built `_site/` (minified bundle + minified CSS), served as a plain static
 * site with no rebuild/watch overhead.
 *
 * This is a zero-dependency static file server (Node built-ins only) so the
 * preview workflow adds no new tooling.
 *
 * USAGE:
 *   npm run preview        # build (quick) then serve _site
 *   node scripts/serveSite.js [--port 8090] [--dir _site]
 *   PORT=8091 node scripts/serveSite.js
 */

import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname, normalize, join, extname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");

const args = process.argv.slice(2);
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
};

const PORT = Number(argValue("--port") || process.env.PORT || 8090);
const ROOT = resolve(projectRoot, argValue("--dir") || "_site");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".otf": "font/otf",
  ".ttf": "font/ttf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

async function resolvePath(urlPath) {
  // Strip query/hash, decode, and prevent path traversal outside ROOT.
  const clean = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  let target = normalize(join(ROOT, clean));
  if (!target.startsWith(ROOT)) return null; // traversal attempt
  try {
    const info = await stat(target);
    if (info.isDirectory()) target = join(target, "index.html");
    return target;
  } catch {
    return target; // let the read fail → 404
  }
}

const server = http.createServer(async (req, res) => {
  const filePath = await resolvePath(req.url || "/");
  if (!filePath) {
    res.writeHead(403).end("403 Forbidden");
    return;
  }
  try {
    const body = await readFile(filePath);
    const type = MIME[extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-cache" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end("404 Not Found");
  }
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n  ✗ Port ${PORT} is already in use. Try: PORT=8091 npm run preview\n`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`\n  ▶ Preview (production build) serving ${ROOT}`);
  console.log(`    http://localhost:${PORT}/\n`);
  console.log(`    Measure Lighthouse / CWV against THIS, not the dev server (:8080).`);
  console.log(`    Ctrl+C to stop.\n`);
});
