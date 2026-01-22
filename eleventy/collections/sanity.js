/**
 * ---
 * aix:
 *   id: frontend.eleventy.collections.sanity
 *   role: Eleventy module: eleventy/collections/sanity.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - eleventy
 *     - collections
 * ---
 */
/** @format */

import logger, { LumberjackStyle } from '@datainkio/lumberjack';
import fetchSanityData from '../../sanity/fetchSanityData.js';
import {
  createSanityClient,
  resolveSanityConfig,
  sanitizeConfigForLogs,
} from '../../sanity/client.js';
import { SANITY_QUERIES } from '../../sanity/queries.js';

logger.enabled = true;

const titleStyle = new LumberjackStyle('#0A9396', '\n🛰️ ');
const msgStyle = new LumberjackStyle('#CA6702', '•');
const successStyle = new LumberjackStyle('#EE9B00', '\n👍');
const warnStyle = new LumberjackStyle('#AE2012', '⛔');

async function fetchAllQueries({ client, cacheDefault }) {
  const useParallel = process.env.SANITY_PARALLEL !== 'false';
  const tasks = SANITY_QUERIES.map(async definition => {
    const cacheDuration = definition.cacheDuration || cacheDefault;
    const data = await fetchSanityData({
      client,
      id: definition.id,
      query: definition.query,
      params: definition.params || {},
      cacheDuration,
    });
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
  logger.trace('Syncing Sanity content', null, 'brief', titleStyle);
  const sanityConfig = resolveSanityConfig(site?.sanity || {});

  if (!sanityConfig.projectId || !sanityConfig.dataset) {
    logger.trace('Sanity skipped: missing projectId/dataset', null, 'brief', warnStyle);
    return;
  }

  const client = createSanityClient(sanityConfig);
  if (!client) return;

  eleventyConfig.addGlobalData('sanityMeta', sanitizeConfigForLogs(sanityConfig));
  logger.trace('Sanity client ready', sanitizeConfigForLogs(sanityConfig), 'verbose', msgStyle);

  const cacheDefault = site?.sanity?.cache || '1d';
  const results = await fetchAllQueries({ client, cacheDefault });

  results.forEach(({ id, data }) => {
    eleventyConfig.addCollection(id, () => data || []);
  });

  logger.trace('Sanity collections registered', null, 'brief', successStyle);
}
