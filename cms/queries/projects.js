/** @format */
import groq from "groq";

export const projectsQuery = {
  id: "projects",
  description: "Published projects for portfolio grids and detail pages",
  cacheDuration: "1d",
  query: groq`*[_type == "project" && meta.published == true]{
    _id,
    _updatedAt,
    "title": page.title,
    "slug": page.slug.current,
    "abstract": page.abstract,
    "status": meta.status,
    "featured": meta.featured,
    "organizations": meta.organization[]->{
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
    "organization": meta.organization[0]->{
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
    "roles": meta.roles[]->{_id, "title": prefLabel, conceptId},
    "activities": meta.activities[]->{_id, "title": prefLabel, conceptId},
    "outcomes": meta.outcomes[]->{_id, "title": prefLabel, conceptId},
    "awards": meta.awards[]->{_id, title, "slug": slug.current},
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
  } | order(featured desc, title asc)`,
};
