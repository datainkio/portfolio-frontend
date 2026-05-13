/** @format */
import groq from "groq";

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
    "featuredImage": featuredImage->{
      "alt": image.alt,
      "caption": image.caption,
      "asset": image.asset->{url, metadata{dimensions, lqip}}
    },
    externalLink,
    caseStudyUrl
  } | order(page.title asc)`,
};
