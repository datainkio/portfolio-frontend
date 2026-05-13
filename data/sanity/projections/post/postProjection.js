/** @format */

/**
 * Post reference projection (inner shape — excludes field name and traversal operator).
 * Used for relatedPosts[] references on post documents.
 */
export const POST_REF_PROJECTION = `{
  _id,
  "title": page.title,
  "slug": page.slug.current,
  status,
  featured
}`;
