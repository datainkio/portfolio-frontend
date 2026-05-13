/** Organization reference projection (inner shape only — excludes field name and traversal operator). */
export const ORGANIZATION_PROJECTION = `{
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
