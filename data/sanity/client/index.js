/**
 * ---
 * aix:
 *   id: frontend.cms.client
 *   role: CMS integration module: data/sanity/client/index.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - cms
 *     - client.js
 * ---
 */
/** @format */

import { config as loadEnv } from "dotenv";
import { createClient } from "@sanity/client";
import logger, { LumberjackStyle } from "@datainkio/lumberjack";

loadEnv();
logger.enabled = true;

const infoStyle = new LumberjackStyle("#0A9396", "🛰️");
const errorStyle = new LumberjackStyle("#AE2012", "⛔");

const clean = (value) =>
  typeof value === "string" ? value.trim().replace(/^['"]|['"]$/g, "") : value;

export function resolveSanityConfig() {
  const projectId = clean(process.env.SANITY_PROJECT_ID);
  const dataset = clean(process.env.SANITY_DATASET);
  const token = clean(process.env.SANITY_API_TOKEN);
  const apiVersion = clean(process.env.SANITY_API_VERSION);
  const cacheDuration = clean(process.env.SANITY_CACHE_DURATION);
  const parallel = clean(process.env.SANITY_PARALLEL);
  const useCdn = clean(token ? false : process.env.SANITY_USE_CDN);
  const perspective = clean(process.env.SANITY_PERSPECTIVE || "published");

  return {
    projectId,
    dataset,
    token,
    apiVersion,
    cacheDuration,
    parallel,
    useCdn,
    perspective,
  };
}

export function createSanityClient(config) {
  if (!config?.projectId || !config?.dataset) {
    logger.trace(
      "Sanity config missing projectId or dataset",
      null,
      "brief",
      errorStyle,
    );
    return null;
  }

  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    token: config.token,
    useCdn: config.useCdn,
    perspective: config.perspective,
    requestTagPrefix: "11ty",
  });
}

export function sanitizeConfigForLogs(config) {
  return {
    projectId: config?.projectId,
    dataset: config?.dataset,
    apiVersion: config?.apiVersion,
    useCdn: config?.useCdn,
    perspective: config?.perspective,
    hasToken: Boolean(config?.token),
  };
}
