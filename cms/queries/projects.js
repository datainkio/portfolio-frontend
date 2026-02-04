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
    "weight": page.weight,
    "status": meta.status,
    "featured": meta.featured,
    "organization": meta.organization->{
      _id,
      "title": page.title,
      "slug": page.slug.current,
      organizationType,
      featured
    },
    "roles": meta.roles[]->{_id, title, "slug": slug.current},
    "activities": meta.activities[]->{_id, title, "slug": slug.current, color, icon},
    "outcomes": meta.outcomes[]->{_id, title, "slug": slug.current},
    "awards": meta.awards[]->{_id, title, "slug": slug.current},
    featuredImage{
      alt,
      asset->{url, metadata{dimensions, lqip}}
    },
    externalLink,
    caseStudyUrl
  } | order(featured desc, weight desc, title asc)`,
};
