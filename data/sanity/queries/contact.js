/** @format */
import groq from "groq";
import { CONTACT_PROJECTION } from "../projections/contact/contactProjection.js";

export const contactQuery = {
  id: "contact",
  description: "Contact page singleton (page title and body copy)",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "contact"][0...1]${CONTACT_PROJECTION}`,
};
