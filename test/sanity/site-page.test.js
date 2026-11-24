/** @format */

/**
 * sitePage transform: URL from the parent chain, cycles, reserved slugs.
 * Pure unit test, no build needed.
 */

import assert from "node:assert/strict";
import {
  normalizeSitePageRecords,
  resolveSitePageUrl,
} from "../../data/sanity/transforms/sitePage.js";

const docs = { _id: "docs", _type: "documentation_landing" };
const page = (_id, slug, parent) => ({ _id, title: slug, slug, parent });
const index = (records) => new Map(records.map((r) => [r._id, r]));

const frontend = page("fe", "frontend", docs);
const tokens = page("tk", "tokens", { _id: "fe", _type: "sitePage" });
const colophon = page("co", "colophon");
const all = index([frontend, tokens, colophon]);

assert.equal(resolveSitePageUrl(frontend, all), "/docs/frontend/");
assert.equal(resolveSitePageUrl(tokens, all), "/docs/frontend/tokens/");
assert.equal(resolveSitePageUrl(colophon, all), "/colophon/");

const a = page("a", "a", { _id: "b", _type: "sitePage" });
const b = page("b", "b", { _id: "a", _type: "sitePage" });
assert.equal(resolveSitePageUrl(a, index([a, b])), "");
assert.equal(resolveSitePageUrl(tokens, index([tokens])), "");
assert.equal(resolveSitePageUrl({ _id: "x", parent: null }, new Map()), "");

const records = normalizeSitePageRecords([
  frontend,
  tokens,
  colophon,
  page("ds", "design", docs),
  a,
  b,
]);
assert.deepEqual(records.map((r) => r.url).sort(), [
  "/colophon/",
  "/docs/frontend/",
  "/docs/frontend/tokens/",
]);
const t = records.find((r) => r._id === "tk");
assert.equal(t.navParent, "/docs/frontend/");
assert.deepEqual(t.trail, [
  { url: "/docs/", title: "Docs" },
  { url: "/docs/frontend/", title: "frontend" },
  { url: "/docs/frontend/tokens/", title: "tokens" },
]);
assert.equal(records.find((r) => r._id === "fe").navParent, "Docs");
assert.equal(records.find((r) => r._id === "co").navParent, undefined);

console.log("site-page transform: ok");
