/** @format */
import groq from "groq";
import { SITE_SETTINGS_PROJECTION } from "../../projections/siteSettings/siteSettingsProjection.js";

export const siteSettingsQuery = {
  id: "siteSettings",
  description: "Site Settings singleton (brand, SEO defaults, integrations)",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_id == "siteSettings"][0...1]${SITE_SETTINGS_PROJECTION}`,
};
