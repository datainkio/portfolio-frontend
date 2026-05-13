/** @format */

/**
 * Page metadata projection (inner shape — excludes field name and traversal operator).
 * Covers the shared `page` field used across project, post, and organization documents.
 */
export const PAGE_PROJECTION = `{
  "title": page.title,
  "slug": page.slug.current,
  "abstract": page.abstract
}`;
