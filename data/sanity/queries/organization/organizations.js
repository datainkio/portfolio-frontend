/** @format */
import groq from "groq";

export const organizationsQuery = {
  id: "organizations",
  description: "Organizations with industry concepts and brand assets",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "organization"]{
    _id,
    _updatedAt,
    featured,
    organizationType,
    website,
    location,
    "title": page.title,
    "slug": page.slug.current,
    "abstract": page.abstract,
    "industry": industry->{
      _id,
      "title": prefLabel,
      conceptId,
      "description": coalesce(definition, scopeNote, "")
    },
    logo{
      alt,
      asset->{
        url,
        metadata{dimensions, lqip}
      }
    }
  } | order(featured desc, title asc)`,
};
