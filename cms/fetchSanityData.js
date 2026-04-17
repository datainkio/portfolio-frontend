/**
 * ---
 * aix:
 *   id: frontend.cms.fetchdata
 *   role: CMS integration module: cms/fetchSanityData.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - cms
 *     - fetchSanityData.js
 * ---
 */
/** @format */

import { AssetCache } from "@11ty/eleventy-fetch";
import { createHash } from "crypto";
import logger, { LumberjackStyle } from "@datainkio/lumberjack";
// TODO: Logger enable/disable is not respected in this module
// Issue URL: https://github.com/datainkio/portfolio-frontend/issues/27
logger.enabled = true;

const fetchStyle = new LumberjackStyle("#0A9396", "📡");
const cacheStyle = new LumberjackStyle("#CA6702", "💾");
const errorStyle = new LumberjackStyle("#AE2012", "⛔");

export default async function fetchSanityData({
  client,
  id,
  query,
  params = {},
  cacheDuration,
}) {
  if (!client) {
    logger.trace("Sanity client not initialized", null, "brief", errorStyle);
    return [];
  }

  const querySignature = createHash("sha1")
    .update(String(query))
    .update(JSON.stringify(params))
    .digest("hex");
  const cacheKey = `sanity-${id}-${querySignature}`;
  const asset = new AssetCache(cacheKey);

  const forceRefresh = process.env.SANITY_FORCE_REFRESH === "true";

  if (!forceRefresh && asset.isCacheValid(cacheDuration)) {
    const cached = await asset.getCachedValue();
    // TODO: Confirm that caching logic works as intended. There are some edge cases where one content type is cached while another is not. For example, outcomes and posts.
    // Issue URL: https://github.com/datainkio/portfolio-frontend/issues/26
    // If we cached an empty response (e.g., first fetch failed or data arrived later),
    // proactively refresh so the build doesn't get stuck showing nothing.
    if (Array.isArray(cached) && cached.length === 0) {
      //logger.trace(`${id}: cache empty, refreshing`, null, "brief", fetchStyle);
    } else {
      // logger.trace(`${id}: using cache`, null, "brief", cacheStyle);
      return cached;
    }
  }

  // logger.trace(`${id}: fetching from Sanity`, null, "brief", fetchStyle);

  try {
    const data = await client.fetch(query, params);
    await asset.save(data, "json");
    return data;
  } catch (error) {
    logger.trace(
      `${id}: fetch error`,
      error.message || error,
      "brief",
      errorStyle,
    );
    return [];
  }
}
