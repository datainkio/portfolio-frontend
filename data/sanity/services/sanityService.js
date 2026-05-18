/**
 * ---
 * aix:
 *   id: frontend.cms.services.sanity
 *   role: Orchestrates CMS client initialization, query execution, and collection registration for Eleventy.
 *   status: stable
 *   surface: internal
 *   tags:
 *     - frontend
 *     - cms
 *     - services
 *   type: module
 *   scope: frontend
 *   audience: maintainers
 *   perf:
 *     readPriority: high
 *     cacheSafe: false
 *     critical: true
 * ---
 */
/** @format */

import fetchSanityData from "./fetchSanityData.js";
import {
  createSanityClient,
  resolveSanityConfig,
  sanitizeConfigForLogs,
} from "../client/index.js";
import { CMS_QUERIES } from "../queries.js";
import { hydrateAwardInlineLogos } from "../transforms/award.js";
import { normalizeLandingRecords } from "../transforms/home.js";
import { normalizeProjectsLandingRecords } from "../transforms/projectsLanding.js";
import {
  addProjectUrls,
  addUrlsToProjectsByIndustry,
  normalizeProjectPageRecords,
} from "../transforms/project.js";
import { normalizeNavigationRecords } from "../transforms/navigation.js";
import logger, { LumberjackStyle } from "@datainkio/lumberjack";

logger.enabled = true;

const titleStyle = new LumberjackStyle("#0A9396", "\n🛰️ ");
const msgStyle = new LumberjackStyle("#CA6702", "•");
const successStyle = new LumberjackStyle("#EE9B00", "\n👍");
const warnStyle = new LumberjackStyle("#AE2012", "⛔");

async function fetchAllQueries({ client, cacheDefault, useParallel }) {
  const tasks = CMS_QUERIES.map(async (definition) => {
    const cacheDuration = definition.cacheDuration || cacheDefault;
    let data = await fetchSanityData({
      client,
      id: definition.id,
      query: definition.query,
      params: definition.params || {},
      cacheDuration,
    });

    if (definition.id === "awards") {
      data = await hydrateAwardInlineLogos(data);
    }

    if (definition.id === "home") {
      data = normalizeLandingRecords(data);
    }

    if (definition.id === "projectsLanding") {
      data = normalizeProjectsLandingRecords(data);
    }

    if (definition.id === "projects") {
      data = addProjectUrls(data);
    }

    if (definition.id === "projectsByIndustry") {
      data = addUrlsToProjectsByIndustry(data);
    }

    if (definition.id === "projectPages") {
      data = normalizeProjectPageRecords(data);
    }

    if (definition.id === "navigation") {
      data = normalizeNavigationRecords(data);
    }

    return { id: definition.id, data };
  });

  if (useParallel) {
    return Promise.all(tasks);
  }

  const results = [];
  for (const task of tasks) {
    results.push(await task);
  }
  return results;
}

export async function init(eleventyConfig, site) {
  logger.trace("Syncing CMS content", null, "brief", titleStyle);
  logger.trace(
    "process.env.SANITY_CACHE_DURATION: " + process.env.SANITY_CACHE_DURATION,
    null,
    "brief",
    msgStyle,
  );
  logger.trace(
    "process.env.FORCE_REFRESH: " + process.env.SANITY_FORCE_REFRESH,
    null,
    "brief",
    msgStyle,
  );

  const cmsConfig = resolveSanityConfig(site?.cms || site?.sanity || {});

  if (!cmsConfig.projectId || !cmsConfig.dataset) {
    eleventyConfig.addGlobalData("cms", {});
    logger.trace(
      "CMS skipped: missing projectId/dataset",
      null,
      "brief",
      warnStyle,
    );
    return;
  }

  const client = createSanityClient(cmsConfig);
  if (!client) {
    eleventyConfig.addGlobalData("cms", {});
    return;
  }

  eleventyConfig.addGlobalData("cmsMeta", sanitizeConfigForLogs(cmsConfig));

  const cacheDuration = cmsConfig.cacheDuration || "1d";
  const useParallel = cmsConfig.parallel !== false;
  const results = await fetchAllQueries({
    client,
    cacheDefault: cacheDuration,
    useParallel,
  });

  const cmsPayload = results.reduce((payload, { id, data }) => {
    payload[id] = data || [];
    return payload;
  }, {});

  eleventyConfig.addGlobalData("cms", cmsPayload);

  results.forEach(({ id, data }) => {
    eleventyConfig.addCollection(id, () => data || []);
  });

  logger.trace("CMS collections registered", null, "brief", successStyle);
}
