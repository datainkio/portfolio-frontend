/**
 * ---
 * aix:
 *   id: frontend.cms.queries
 *   role: CMS integration module: data/sanity/queries.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - cms
 *     - queries.js
 * ---
 */
/** @format */

import { activitiesQuery } from "./queries/activities.js";
import { awardsQuery } from "./queries/awards.js";
import { imageAssetsQuery } from "./queries/image-assets.js";
import { industriesQuery } from "./queries/industries.js";
import { projectsByIndustryQuery } from "./queries/projects-by-industry.js";
import { homeQuery } from "./queries/home.js";
import { organizationsQuery } from "./queries/organizations.js";
import { navigationQuery } from "./queries/navigation.js";
import { outcomesQuery } from "./queries/outcomes.js";
import { postsQuery } from "./queries/posts.js";
import { projectsQuery } from "./queries/projects.js";
import { rolesQuery } from "./queries/roles.js";

export const CMS_QUERIES = [
  organizationsQuery,
  industriesQuery,
  projectsByIndustryQuery,
  activitiesQuery,
  rolesQuery,
  outcomesQuery,
  awardsQuery,
  projectsQuery,
  homeQuery,
  navigationQuery,
  imageAssetsQuery,
  postsQuery,
];
