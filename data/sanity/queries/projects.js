/** @format */
import groq from "groq";
import {
  ORG_PROJECTION,
  FEATURED_IMAGE_PROJECTION,
} from "../projections/fragments.js";

export const projectsQuery = {
  id: "projects",
  description: "Published projects for portfolio grids and detail pages",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "project"]{
    _id,
    _updatedAt,
    "title": page.title,
    "slug": page.slug.current,
    "abstract": page.abstract,
    "organization": organization[]->${ORG_PROJECTION},
    "roles": roles[]->{_id, "title": prefLabel, conceptId},
    "activities": activities[]->{_id, "title": prefLabel, conceptId},
    "outcomes": outcomes[]->{_id, "title": prefLabel, conceptId},
    "awards": awards[]->{_id, title, "slug": slug.current},
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
    "featuredImage": featuredImage->${FEATURED_IMAGE_PROJECTION},
    externalLink,
    caseStudyUrl
  } | order(page.title asc)`,
};
