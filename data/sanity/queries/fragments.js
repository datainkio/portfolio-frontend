/** @format */

// Shared GROQ projections for project-related queries.

/** Organization reference projection (inner shape only — excludes field name and traversal operator). */
export const ORG_PROJECTION = `{
  _id,
  "title": page.title,
  "slug": page.slug.current,
  "industry": industry->{
    _id,
    "preferredLabel": prefLabel
  },
  organizationType,
  featured
}`;

/** Featured image projection (inner shape only — excludes field name and traversal operator). */
export const FEATURED_IMAGE_PROJECTION = `{
  "alt": image.alt,
  "caption": image.caption,
  "asset": image.asset->{url, metadata{dimensions, lqip}}
}`;
