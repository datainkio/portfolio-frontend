/** @format */

import { cleanPostSlug } from "./post.js";

/**
 * `urlById` maps sitePage `_id` to its built URL. Nav items carry no parent
 * chain, so the caller supplies the map; it defaults to empty.
 */
export function resolveNavigationHref(item, urlById = new Map()) {
  if (!item || typeof item !== "object") {
    return "";
  }

  switch (item._type) {
    case "home":
      return "/";
    case "projects":
      return "/work/";
    case "contact":
      return "/contact/";
    case "project":
      return item.slug ? `/case-studies/${item.slug}/` : "";
    case "postsLanding":
      return "/posts/";
    case "post":
      return item.slug ? `/posts/${cleanPostSlug(item.slug)}/` : "/posts/";
    case "documentation":
      return "/docs/";
    case "documentation_landing":
      return "/docs/";
    case "sitePage":
      return urlById.get(item._id) || "";
    default:
      return "";
  }
}

export function resolveNavigationLabel(item) {
  const label = typeof item?.label === "string" ? item.label.trim() : "";
  return label || "Untitled";
}

export function normalizeNavigationItems(items = [], urlById = new Map()) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const url = resolveNavigationHref(item, urlById);
      if (!url) {
        return null;
      }

      const title = resolveNavigationLabel(item);
      return {
        title,
        key: title,
        pageNavLabel: title,
        url,
      };
    })
    .filter(Boolean);
}

export function normalizeNavigationRecords(records = [], urlById = new Map()) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => ({
    ...record,
    headerItems: normalizeNavigationItems(record?.headerItems, urlById),
    footerItems: normalizeNavigationItems(record?.footerItems, urlById),
  }));
}
