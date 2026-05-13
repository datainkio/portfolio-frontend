/** @format */
import groq from "groq";

export const activitiesQuery = {
  id: "activities",
  description: "Activity concepts for project classification",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[
    _type == "skosConcept" && (
      _id in *[_type == "skosConceptScheme" && (schemeId in ["activity", "activities"] || title in ["Activity", "Activities"])][0].topConcepts[]._ref ||
      _id in *[_type == "skosConceptScheme" && (schemeId in ["activity", "activities"] || title in ["Activity", "Activities"])][0].concepts[]._ref
    )
  ]{
    _id,
    _updatedAt,
    "title": prefLabel,
    conceptId,
    "description": coalesce(definition, scopeNote, "")
  } | order(title asc)`,
};
