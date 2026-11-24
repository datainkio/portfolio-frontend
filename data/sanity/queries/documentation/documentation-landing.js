/** @format */
import groq from "groq";
import { DOCUMENTATION_LANDING_PROJECTION } from "../../projections/documentation/documentationLandingProjection.js";

// The Sanity type is `documentation_landing`; the query id is camelCase like
// the other landing singletons, so templates read `cms.documentationLanding`.
export const documentationLandingQuery = {
  id: "documentationLanding",
  description:
    "Documentation landing page singleton (page title, nav label and body copy)",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "documentation_landing"][0...1]${DOCUMENTATION_LANDING_PROJECTION}`,
};
