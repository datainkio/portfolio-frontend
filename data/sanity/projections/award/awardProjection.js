/** @format */

/**
 * Award reference projection (inner shape — excludes field name and traversal operator).
 * Used for awards[] references on project documents.
 */
export const AWARD_PROJECTION = `{
  _id,
  title,
  "slug": slug.current
}`;
