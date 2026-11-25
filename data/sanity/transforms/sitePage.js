/** @format */

import logger, { LumberjackStyle } from "@datainkio/lumberjack";
import { serializePortableTextToHtml } from "./portableText.js";

const warnStyle = new LumberjackStyle("#AE2012", "⛔");

const DOCS_LANDING = "documentation_landing";
// Static folders under /docs/ that a sitePage must not shadow.
const RESERVED_DOCS_SLUGS = new Set([
  "design",
  "ia",
  "content-strategy",
  "content strategy",
]);

function slugOf(page) {
  return typeof page?.slug === "string"
    ? page.slug.replace(/^\/+|\/+$/g, "")
    : "";
}

/**
 * Walk `parent` upward. Returns { pages, root } (pages from the top down, the
 * page itself last; root is "docs" or "site"), or null for a cycle, a missing
 * parent record, or a missing slug.
 */
function walk(page, byId) {
  const pages = [];
  const seen = new Set();
  let current = page;
  let root = "site";

  while (current) {
    if (seen.has(current._id) || !slugOf(current)) return null;
    seen.add(current._id);
    pages.unshift(current);

    const parent = current.parent;
    if (!parent) break;
    if (parent._type === DOCS_LANDING) {
      root = "docs";
      break;
    }
    current = byId.get(parent._id);
    if (!current) return null;
  }

  return { pages, root };
}

export function resolveSitePageUrl(page, byId = new Map()) {
  const chain = page ? walk(page, byId) : null;
  if (!chain) return "";
  const prefix = chain.root === "docs" ? "/docs/" : "/";
  return `${prefix}${chain.pages.map(slugOf).join("/")}/`;
}

export function normalizeSitePageRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  const byId = new Map(records.map((record) => [record._id, record]));
  const urlOf = (record) => resolveSitePageUrl(record, byId);
  const normalized = [];

  for (const record of records) {
    const url = urlOf(record);
    const slug = slugOf(record);
    const title = record.title || "";

    if (!url) {
      logger.trace(
        `sitePage "${title || record._id}" dropped: no URL (cycle, missing parent or slug)`,
        null,
        "brief",
        warnStyle,
      );
      continue;
    }
    if (
      record.parent?._type === DOCS_LANDING &&
      RESERVED_DOCS_SLUGS.has(slug.toLowerCase())
    ) {
      logger.trace(
        `sitePage "${title}" dropped: slug "${slug}" collides with a static docs folder`,
        null,
        "brief",
        warnStyle,
      );
      continue;
    }

    const chain = walk(record, byId);
    const trail = chain.pages.map((page) => ({
      url: urlOf(page),
      title: page.title,
    }));
    if (chain.root === "docs") trail.unshift({ url: "/docs/", title: "Docs" });

    let navParent;
    if (record.parent?._type === DOCS_LANDING) navParent = "Docs";
    else if (record.parent) navParent = urlOf(byId.get(record.parent._id));

    normalized.push({
      ...record,
      url,
      bodyHtml: serializePortableTextToHtml(record.body),
      navTitle: record.navLabel || record.title,
      navParent,
      trail,
    });
  }

  return normalized;
}
