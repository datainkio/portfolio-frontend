/** @format */

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
    case "post":
      return item.slug ? `/posts/${item.slug}/` : "/posts/";
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
        return null;
      }

      const title = resolveNavigationLabel(item);
      return {
        title,
        key: title,
        url,
      };
    })
    .filter(Boolean);
}

export function normalizeNavigationRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => ({
    ...record,
    headerItems: normalizeNavigationItems(record?.headerItems),
    footerItems: normalizeNavigationItems(record?.footerItems),
  }));
}
