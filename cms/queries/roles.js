/** @format */
import groq from "groq";

export const rolesQuery = {
  id: "roles",
  description: "Role concepts for project metadata",
  cacheDuration: "1d",
  query: groq`*[
    _type == "skosConcept" && (
      _id in *[_type == "skosConceptScheme" && (schemeId in ["role", "roles"] || title in ["Role", "Roles"])][0].topConcepts[]._ref ||
      _id in *[_type == "skosConceptScheme" && (schemeId in ["role", "roles"] || title in ["Role", "Roles"])][0].concepts[]._ref
    )
  ]{
    _id,
    _updatedAt,
    "title": prefLabel,
    conceptId,
    "description": coalesce(definition, scopeNote, "")
  } | order(title asc)`,
};
