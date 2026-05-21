/** @format */
import groq from "groq";
import { ORGANIZATION_PROJECTION } from "../organization/organizationProjection.js";
import { ROLE_PROJECTION } from "../role/roleProjection.js";
import { ACTIVITY_PROJECTION } from "../activity/activityProjection.js";

/**
 * Project card projection (inner shape — excludes field name and traversal operator).
 * Used in grid/list views and industry groupings (e.g. projectsByIndustry).
 */
export const PROJECT_CARD_PROJECTION = groq`{
  _id,
  _updatedAt,
  "title": page.title,
  "slug": page.slug.current,
  "abstract": page.abstract,
  "industry": coalesce(
    industry->prefLabel,
    organization[0]->industry->prefLabel,
    projectMeta.organization[0]->industry->prefLabel,
    "Uncategorized"
  ),
  "rolesTitles": array::unique(roles[]->prefLabel),
  "activityTitles": array::unique(activities[]->prefLabel),
  "organization": organization[]->${ORGANIZATION_PROJECTION},
  "roles": roles[]->${ROLE_PROJECTION},
  "activities": activities[]->${ACTIVITY_PROJECTION},
  "featuredImage": featuredImage->{
    "alt": image.alt,
    "caption": image.caption,
    "asset": image.asset->{url, metadata{dimensions, lqip}}
  },
  externalLink,
  caseStudyUrl
}`;
