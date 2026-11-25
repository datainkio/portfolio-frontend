/** @format */
import groq from "groq";

/**
 * Featured statistic projection (inner shape — excludes field name and traversal operator).
 * Applied to the `statistic` objects embedded in `project.statistics`, so `^`
 * is the project that owns the statistic.
 */
export const FEATURED_STATISTIC_PROJECTION = groq`{
  _key,
  label,
  value,
  description,
  "project": {
    "_id": ^._id,
    "title": ^.page.title,
    "slug": ^.page.slug.current
  }
}`;
