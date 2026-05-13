/** @format */
import groq from "groq";

export const outcomesQuery = {
  id: "outcomes",
  description: "Deliverable concepts for projects",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[
    _type == "skosConcept" && (
      _id in *[_type == "skosConceptScheme" && (schemeId in ["deliverable", "deliverables", "outcome", "outcomes"] || title in ["Deliverable", "Deliverables", "Outcome", "Outcomes"])][0].topConcepts[]._ref ||
      _id in *[_type == "skosConceptScheme" && (schemeId in ["deliverable", "deliverables", "outcome", "outcomes"] || title in ["Deliverable", "Deliverables", "Outcome", "Outcomes"])][0].concepts[]._ref
    )
  ]{
    _id,
    _updatedAt,
    "title": prefLabel,
    conceptId,
    "description": coalesce(definition, scopeNote, "")
  } | order(title asc)`,
};
