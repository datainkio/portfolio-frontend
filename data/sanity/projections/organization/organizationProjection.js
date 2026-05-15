/** @format */
import groq from "groq";
/** Organization reference projection (inner shape only — excludes field name and traversal operator). */
export const ORGANIZATION_PROJECTION = groq`{
  _id,
  "title": page.title,
  "slug": page.slug.current,
  description,
  "logo": logo->{
    "alt": image.alt,
    "asset": image.asset->{url, metadata{dimensions, lqip}}
  },
  "industry": industry->{
    _id,
    "preferredLabel": prefLabel
  },
  organizationType,
  website,
  location,
  featured
}`;
