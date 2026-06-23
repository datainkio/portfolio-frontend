/** @format */
import groq from "groq";
/** Organization reference projection (inner shape only — excludes field name and traversal operator). */
/** Used for rendering organization details in the frontend */
export const ORGANIZATION_PROJECTION = groq`{
  _id,
  _updatedAt,
  "title": page.title,
  "slug": page.slug.current,
  "logo": logo->{
    "alt": image.alt,
    "asset": image.asset->{url, metadata{dimensions, lqip}}
  },
  organizationType,
  website,
  location,
  featured
}`;
