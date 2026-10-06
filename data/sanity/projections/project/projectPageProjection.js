/** @format */
import groq from "groq";
import { ORGANIZATION_PROJECTION } from "../organization/organizationProjection.js";
import { ROLE_PROJECTION } from "../role/roleProjection.js";
import { ACTIVITY_PROJECTION } from "../activity/activityProjection.js";
import { AWARD_PROJECTION } from "../award/awardProjection.js";
import { INDUSTRY_PROJECTION } from "../industry/industryProjection.js";
import { OUTCOME_PROJECTION } from "../outcome/outcomeProjection.js";
import { FEATURED_IMAGE_PROJECTION } from "../image/featuredImageProjection.js";
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
  situation,
  task,
  action,
  result,
  "industry": industry->${INDUSTRY_PROJECTION},
  "rolesTitles": array::unique(roles[]->prefLabel),
  "activityTitles": array::unique(activities[]->prefLabel),
  "organization": organization[]->${ORGANIZATION_PROJECTION},
  "roles": roles[]->${ROLE_PROJECTION},
  "activities": activities[]->${ACTIVITY_PROJECTION},
  "outcomes": outcomes[]->${OUTCOME_PROJECTION},
  "awards": awards[]->${AWARD_PROJECTION} | order(organization.orderRank asc, title asc),
  "decisions": decisions[published == true]{
    _key,
    decision,
    result,
    "activities": activities[]->${ACTIVITY_PROJECTION},
    "artifact": artifact->${FEATURED_IMAGE_PROJECTION}
  },
  body[]{
    ...,
    _type == "image" => {
      ...,
      asset->{url, description, metadata{dimensions, lqip}}
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
  caseStudyUrl,
  "seo": seo{
    title,
    description,
    noIndex,
    "ogImage": ogImage.asset->url
  }
}`;
