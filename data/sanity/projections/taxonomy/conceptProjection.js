/** @format */
import groq from "groq";

/**
 * SKOS concept projection (inner shape — excludes field name and traversal operator).
 * Used as the base shape for taxonomy concept queries (activities, roles, outcomes, industries).
 */
export const CONCEPT_PROJECTION = groq`{
  _id,
  _updatedAt,
  "title": prefLabel,
  conceptId,
  "description": coalesce(definition, scopeNote, "")
}`;
