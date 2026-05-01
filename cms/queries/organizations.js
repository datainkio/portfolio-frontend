/** @format */
import groq from "groq";

export const organizationsQuery = {
  id: "organizations",
  description: "Organizations with industry taxonomy and brand assets",
  cacheDuration: "1d",
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
      title,
      "slug": slug.current,
      description,
      color,
      icon
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
