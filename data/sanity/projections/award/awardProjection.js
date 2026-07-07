/** @format */
import groq from "groq";
import { ORGANIZATION_PROJECTION } from "../organization/organizationProjection.js";
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
    organization->{...${ORGANIZATION_PROJECTION}},
    project->{
      _id,
      "title": page.title,
      "slug": page.slug.current,
      "published": meta.published,
      "featured": meta.featured
    }
  }`;
