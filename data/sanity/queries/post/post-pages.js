/** @format */
import groq from "groq";
import { POST_PAGE_PROJECTION } from "../../projections/post/postProjection.js";

export const postPagesQuery = {
  id: "postPages",
  description: "Full post data for detail page templates: body, files, relations and SEO",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "post" && defined(page.slug.current)]${POST_PAGE_PROJECTION} | order(publishDate desc, title asc)`,
};
