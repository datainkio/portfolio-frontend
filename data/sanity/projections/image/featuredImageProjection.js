/** Featured image projection (inner shape only — excludes field name and traversal operator). */
export const FEATURED_IMAGE_PROJECTION = `{
  "alt": image.alt,
  "caption": image.caption,
  "asset": image.asset->{url, metadata{dimensions, lqip}}
}`;
