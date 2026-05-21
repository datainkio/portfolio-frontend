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

import { activitiesQuery } from "./queries/activity/activities.js";
import { awardsQuery } from "./queries/award/awards.js";
import { imageAssetsQuery } from "./queries/image/image-assets.js";
import { industriesQuery } from "./queries/industry/industries.js";
import { projectsByIndustryQuery } from "./queries/project/projects-by-industry.js";
import { homeQuery } from "./queries/home.js";
import { organizationsQuery } from "./queries/organization/organizations.js";
import { navigationQuery } from "./queries/navigation/navigation.js";
import { outcomesQuery } from "./queries/outcome/outcomes.js";
import { postsQuery } from "./queries/post/posts.js";
import { projectPagesQuery } from "./queries/project/project-pages.js";
import { projectsLandingQuery } from "./queries/project/projects-landing.js";
import { projectsQuery } from "./queries/project/projects.js";
import { rolesQuery } from "./queries/role/roles.js";
import { siteSettingsQuery } from "./queries/siteSettings/siteSettings.js";

export const CMS_QUERIES = [
  siteSettingsQuery,
  organizationsQuery,
  industriesQuery,
  projectsByIndustryQuery,
  activitiesQuery,
  rolesQuery,
  outcomesQuery,
  awardsQuery,
  projectsQuery,
  projectsLandingQuery,
  projectPagesQuery,
  homeQuery,
  navigationQuery,
  imageAssetsQuery,
  postsQuery,
];
