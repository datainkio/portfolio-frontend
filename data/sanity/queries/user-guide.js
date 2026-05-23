/** @format */
import groq from "groq";
import { USER_GUIDE_PROJECTION } from "../../projections/userGuide/userGuideProjection.js";

export const userGuideQuery = {
  id: "userGuide",
  description: "User Guide page singleton (page title and body copy)",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "userGuide"][0...1]${USER_GUIDE_PROJECTION}`,
};
