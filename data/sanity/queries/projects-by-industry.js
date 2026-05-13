/** @format */
import groq from "groq";
import { ORG_PROJECTION, FEATURED_IMAGE_PROJECTION } from "./fragments.js";

export const projectsByIndustryQuery = {
  id: "projectsByIndustry",
  description:
    "Projects grouped by industry concepts that are linked through project organizations (max 5 industries)",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[
    _type == "skosConcept" &&
    (
      _id in *[_type == "skosConceptScheme" && (schemeId in ["industry", "industries"] || title in ["Industry", "Industries"])][0].concepts[]._ref ||
      _id in *[_type == "skosConceptScheme" && (schemeId in ["industry", "industries"] || title in ["Industry", "Industries"])][0].topConcepts[]._ref
    ) &&
    (
      _id in *[_type == "project"].organization[]->industry._ref ||
      _id in *[_type == "project"].projectMeta.organization[]->industry._ref
    )
  ]{
    _id,
    "title": prefLabel,
    "conceptId": coalesce(conceptId, _id),
    "projects": *[
      _type == "project" &&
      (
        ^._id in organization[]->industry._ref ||
        ^._id in projectMeta.organization[]->industry._ref
      )
    ]{
      _id,
      _updatedAt,
      "title": page.title,
      "slug": page.slug.current,
      "abstract": page.abstract,
      "organizations": organization[]->${ORG_PROJECTION},
      "organization": organization[0]->${ORG_PROJECTION},
      "featuredImage": featuredImage->${FEATURED_IMAGE_PROJECTION},
      externalLink,
      caseStudyUrl
    } | order(page.title asc)
  } | order(title asc)[0...5]`,
};
