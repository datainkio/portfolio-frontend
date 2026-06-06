/** @format */
import groq from "groq";
/** Featured image projection (inner shape only — excludes field name and traversal operator). */
export const FEATURED_IMAGE_PROJECTION = groq`{
  "alt": image.alt,
  "caption": image.caption,
  "asset": image.asset->{url, metadata{dimensions, lqip}}
}`;
