/** @format */
import groq from "groq";
import { AWARD_PROJECTION } from "../../projections/award/awardProjection.js";
export const awardsQuery = {
  id: "awards",
  description: "Awards with organization and project context",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "award"]${AWARD_PROJECTION} | order(title asc)`,
};
