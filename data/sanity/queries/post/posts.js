/** @format */
import groq from "groq";
import { POST_CARD_PROJECTION } from "../../projections/post/postProjection.js";

// Publish state comes from the client perspective ("published" by default),
// not from a field, so drafts never reach this query. A post without a slug
// has no URL, so it is left out.
export const postsQuery = {
  id: "posts",
  description: "Posts for the inventory list, newest first",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "post" && defined(page.slug.current)]${POST_CARD_PROJECTION} | order(publishDate desc, title asc)`,
};
