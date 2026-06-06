/** @format */
import groq from "groq";
import { PROJECT_CARD_PROJECTION } from "../../projections/project/projectCardProjection.js";

export const projectsQuery = {
  id: "projects",
  description: "Project cards for portfolio grids and listing views",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "project"]${PROJECT_CARD_PROJECTION} | order(page.title asc)`,
};
