/** @format */

import logger, { LumberjackStyle } from "@datainkio/lumberjack";
import { cleanPostSlug } from "./post.js";

const warnStyle = new LumberjackStyle("#AE2012", "⛔");

function warn(message) {
  logger.trace(`[navigation] ${message}`, null, "brief", warnStyle);
}

export function resolveNavigationHref(item) {
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
    default:
      return "";
  }
}

export function resolveNavigationLabel(item) {
  const label = typeof item?.label === "string" ? item.label.trim() : "";
  return label || "Untitled";
}

export function normalizeNavigationItems(items = []) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const url = resolveNavigationHref(item);
      if (!url) {
        warn(
          `Dropped item with _type "${item?._type}" (_id ${item?._id}, label "${item?.label}"): no URL for this type`,
        );
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

export function normalizeNavigationRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => {
    const headerItems = normalizeNavigationItems(record?.headerItems);
    const footerItems = normalizeNavigationItems(record?.footerItems);

    if (!headerItems.length) {
      warn("headerItems is empty after normalization");
    }
    if (!footerItems.length) {
      warn("footerItems is empty after normalization");
    }

    return { ...record, headerItems, footerItems };
  });
}
