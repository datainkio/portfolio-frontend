/** @format */
import groq from "groq";

/**
 * Outcome concept reference projection (inner shape — excludes field name and traversal operator).
 * Used for outcomes[] references on project documents.
 */
export const OUTCOME_PROJECTION = groq`{
  _id,
  "title": prefLabel,
  conceptId
}`;
