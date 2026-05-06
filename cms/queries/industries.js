/** @format */
import groq from "groq";

export const industriesQuery = {
  id: "industries",
  description: "Industry concepts for organizations and projects",
  cacheDuration: "1d",
  query: groq`*[
    _type == "skosConcept" && (
      _id in *[_type == "skosConceptScheme" && (schemeId in ["industry", "industries"] || title in ["Industry", "Industries"])][0].topConcepts[]._ref ||
      _id in *[_type == "skosConceptScheme" && (schemeId in ["industry", "industries"] || title in ["Industry", "Industries"])][0].concepts[]._ref
    )
  ]{
    _id,
    _updatedAt,
    "title": prefLabel,
    conceptId,
    "description": coalesce(definition, scopeNote, "")
  } | order(title asc)`,
};
