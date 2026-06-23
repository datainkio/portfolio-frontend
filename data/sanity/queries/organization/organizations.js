/** @format */
/** Returns all client/partner organizations (i.e. any orgs that are not award-granting) */
import groq from "groq";
import { ORGANIZATION_PROJECTION } from "../../projections/organization/organizationProjection.js";
export const organizationsQuery = {
  id: "organizations",
  description:
    "Client and partner organizations (i.e. any orgs that are not award-granting)",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "organization" && organizationType != "awarding-body"]${ORGANIZATION_PROJECTION} | order(title asc)`,
};
