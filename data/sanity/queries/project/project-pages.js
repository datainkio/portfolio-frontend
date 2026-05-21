/** @format */
import groq from "groq";
import { PROJECT_PAGE_PROJECTION } from "../../projections/project/projectPageProjection.js";

export const projectPagesQuery = {
  id: "projectPages",
  description:
    "Full project data for detail page templates including body, taxonomy relations, and awards",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "project"]${PROJECT_PAGE_PROJECTION} | order(page.title asc)`,
};
