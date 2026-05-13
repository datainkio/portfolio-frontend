/** @format */
import groq from 'groq';

export const awardsQuery = {
  id: 'awards',
  description: 'Awards with organization and project context',
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "award"]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    description,
    level,
    category,
    url,
    featured,
    organization->{
      _id,
      "title": page.title,
      "slug": page.slug.current,
      logo{
        alt,
        asset->{url, metadata{dimensions, lqip}}
      }
    },
    project->{
      _id,
      "title": page.title,
      "slug": page.slug.current,
      "published": meta.published,
      "featured": meta.featured
    }
  } | order(featured desc, title asc)`,
};
