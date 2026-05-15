/** @format */
import groq from "groq";
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
  "roles": roles->{_id, "title": prefLabel, conceptId},
  "activities": activities->{_id, "title": prefLabel, conceptId},
  "outcomes": outcomes->{_id, "title": prefLabel, conceptId},
  "awards": awards->{_id, title, "slug": slug.current},
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
