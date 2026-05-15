/** @format */
import groq from "groq";

/**
 * Activity concept reference projection (inner shape — excludes field name and traversal operator).
 * Used for activities[] references on project documents.
 */
export const ACTIVITY_PROJECTION = groq`{
  _id,
  "title": prefLabel,
  conceptId
}`;
