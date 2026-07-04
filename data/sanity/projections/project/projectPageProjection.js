/** @format */
import groq from "groq";
import { ORGANIZATION_PROJECTION } from "../organization/organizationProjection.js";
import { ROLE_PROJECTION } from "../role/roleProjection.js";
import { ACTIVITY_PROJECTION } from "../activity/activityProjection.js";
import { AWARD_PROJECTION } from "../award/awardProjection.js";
/**
 * Project page projection (inner shape — excludes field name and traversal operator).
 * Used for project detail/page views with full relational data.
 */
export const PROJECT_PAGE_PROJECTION = groq`{
  _id,
  _updatedAt,
  "title": page.title,
  "slug": page.slug.current,
  "abstract": page.abstract,
  "industry": industry->prefLabel,
  "rolesTitles": array::unique(roles[]->prefLabel),
  "activityTitles": array::unique(activities[]->prefLabel),
  "organization": organization[]->${ORGANIZATION_PROJECTION},
  "roles": roles[]->${ROLE_PROJECTION},
  "activities": activities[]->${ACTIVITY_PROJECTION},
  "awards": awards[]->${AWARD_PROJECTION},
  body[]{
    ...,
    _type == "image" => {
      ...,
      asset->{url, metadata{dimensions, lqip}}
    },
    _type == "project_aside" => {
      ...,
      body[]{
        ...
      },
      resources[]{
        ...
      }
    }
  },
  "featuredImage": featuredImage->{
    "alt": image.alt,
    "caption": image.caption,
    "asset": image.asset->{url, metadata{dimensions, lqip}}
  },
  externalLink,
  caseStudyUrl
}`;
