/** @format */
import groq from "groq";
import { SITE_PAGE_PROJECTION } from "../../projections/sitePage/sitePageProjection.js";

export const sitePagesQuery = {
  id: "sitePages",
  description: "Every general-use site page: title, body, parent and SEO",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "sitePage" && defined(page.slug.current)]${SITE_PAGE_PROJECTION} | order(title asc)`,
};
