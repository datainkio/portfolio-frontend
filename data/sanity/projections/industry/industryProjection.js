/** @format */
import groq from "groq";

/**
 * Industry concept projection (inner shape — excludes field name and traversal operator).
 * Used for industry-> references on organization documents.
 */
export const INDUSTRY_PROJECTION = groq`{
  _id,
  "title": prefLabel,
  conceptId,
  "description": coalesce(definition, scopeNote, "")
}`;
