/** @format */

import { serializePortableTextToHtml } from "./portableText.js";

// Imported posts carry slugs prefixed with `/feed/`. Strip it so URLs are
// /posts/<slug>/ regardless of which form a document holds.
export function cleanPostSlug(slug) {
  return typeof slug === "string"
    ? slug.replace(/^\/?feed\//, "").replace(/^\/+|\/+$/g, "")
    : "";
}

function withUrl(record) {
  const slug = cleanPostSlug(record?.slug);
  return { ...record, slug, url: slug ? `/posts/${slug}/` : "" };
}

export function addPostUrls(records = []) {
  return Array.isArray(records) ? records.map(withUrl) : [];
}

export function normalizePostPageRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => ({
    ...withUrl(record),
    bodyHtml: serializePortableTextToHtml(record?.body),
    relatedPosts: addPostUrls(record?.relatedPosts),
    relatedProjects: (record?.relatedProjects || []).map((project) => ({
      ...project,
      url: project?.slug ? `/case-studies/${project.slug}/` : "",
    })),
  }));
}

export function normalizePostsLandingRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => ({
    ...record,
    pageBodyHtml: serializePortableTextToHtml(record?.pageBody),
  }));
}
