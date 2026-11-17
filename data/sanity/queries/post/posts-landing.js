/** @format */
import groq from "groq";
import { POSTS_LANDING_PROJECTION } from "../../projections/post/postsLandingProjection.js";

export const postsLandingQuery = {
  id: "postsLanding",
  description: "Posts inventory page singleton (page title, nav label and intro copy)",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "postsLanding"][0...1]${POSTS_LANDING_PROJECTION}`,
};
