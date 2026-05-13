/** @format */

/**
 * Project card projection (inner shape — excludes field name and traversal operator).
 * Used in grid/list views and industry groupings (e.g. projectsByIndustry).
 */
export const PROJECT_CARD_PROJECTION = `{
  _id,
  _updatedAt,
  "title": page.title,
  "slug": page.slug.current,
  "abstract": page.abstract,
  "organization": organization[]->{
    _id,
    "title": page.title,
    "slug": page.slug.current,
    "industry": industry->{
      _id,
      "preferredLabel": prefLabel
    },
    organizationType,
    featured
  },
  "featuredImage": featuredImage->{
    "alt": image.alt,
    "caption": image.caption,
    "asset": image.asset->{url, metadata{dimensions, lqip}}
  },
  externalLink,
  caseStudyUrl
}`;
