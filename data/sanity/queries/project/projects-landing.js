/** @format */
import groq from "groq";
import { PROJECTS_LANDING_PROJECTION } from "../../projections/project/projectsLandingProjection.js";

export const projectsLandingQuery = {
  id: "projectsLanding",
  description: "Projects landing page singleton (page title and body copy)",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "projects"][0...1]${PROJECTS_LANDING_PROJECTION}`,
};
