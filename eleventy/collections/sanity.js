/**
 * ---
 * aix:
 *   id: frontend.eleventy.collections.cms
 *   role: Eleventy module: eleventy/collections/sanity.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - eleventy
 *     - collections
 *     - cms
 * ---
 */
/** @format */
import fetchSanityData from '../../cms/fetchSanityData.js';
import {
  createSanityClient,
  resolveSanityConfig,
  sanitizeConfigForLogs,
} from '../../cms/client.js';
import { CMS_QUERIES } from '../../cms/queries.js';

logger.enabled = true;

const titleStyle = new LumberjackStyle('#0A9396', '\n🛰️ ');
const msgStyle = new LumberjackStyle('#CA6702', '•');
const successStyle = new LumberjackStyle('#EE9B00', '\n👍');
const warnStyle = new LumberjackStyle('#AE2012', '⛔');

async function fetchAllQueries({ client, cacheDefault }) {
  const useParallel = process.env.SANITY_PARALLEL !== 'false';
  const tasks = CMS_QUERIES.map(async definition => {
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
  logger.trace('Syncing CMS content', null, 'brief', titleStyle);
  const cmsConfig = resolveSanityConfig(site?.cms || site?.sanity || {});

  if (!cmsConfig.projectId || !cmsConfig.dataset) {
    logger.trace('CMS skipped: missing projectId/dataset', null, 'brief', warnStyle);
    return;
  }

  const client = createSanityClient(cmsConfig);
  if (!client) return;

  eleventyConfig.addGlobalData('cmsMeta', sanitizeConfigForLogs(cmsConfig));
  logger.trace('CMS client ready', sanitizeConfigForLogs(cmsConfig), 'verbose', msgStyle);

  const cacheDefault = site?.cms?.cache || site?.sanity?.cache || '1d';
  const results = await fetchAllQueries({ client, cacheDefault });

  results.forEach(({ id, data }) => {
    eleventyConfig.addCollection(id, () => data || []);
  });

  logger.trace('CMS collections registered', null, 'brief', successStyle);
}
