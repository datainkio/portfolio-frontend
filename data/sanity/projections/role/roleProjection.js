/** @format */

import groq from "groq";

/**
 * Role concept reference projection (inner shape — excludes field name and traversal operator).
 * Used for roles[] references on project documents.
 */
export const ROLE_PROJECTION = groq`{
  _id,
  "title": prefLabel,
  conceptId
}`;
