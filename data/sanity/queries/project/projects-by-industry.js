/** @format */
import groq from "groq";
import { PROJECT_CARD_PROJECTION } from "../../projections/project/projectCardProjection.js";

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
    _id in *[_type == "project"].industry._ref
  ]{
    _id,
    "title": prefLabel,
    "conceptId": coalesce(conceptId, _id),
    "projects": *[
      _type == "project" &&
      ^._id == industry._ref
    ]${PROJECT_CARD_PROJECTION} | order(page.title asc)
  } | order(title asc)[0...5]`,
};
