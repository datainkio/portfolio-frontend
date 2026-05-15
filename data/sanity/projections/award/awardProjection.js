/** @format */
import groq from "groq";
/**
 * Award reference projection (inner shape — excludes field name and traversal operator).
 * Used for awards[] references on project documents.
 */
export const AWARD_PROJECTION = groq`{
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
  }`;
