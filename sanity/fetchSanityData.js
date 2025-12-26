/** @format */

import { AssetCache } from '@11ty/eleventy-fetch';
import logger, { LumberjackStyle } from '@datainkio/lumberjack';

logger.enabled = true;

const fetchStyle = new LumberjackStyle('#0A9396', '📡');
const cacheStyle = new LumberjackStyle('#CA6702', '💾');
const errorStyle = new LumberjackStyle('#AE2012', '⛔');

export default async function fetchSanityData({
  client,
  id,
  query,
  params = {},
  cacheDuration = '1d',
}) {
  if (!client) {
    logger.trace('Sanity client not initialized', null, 'brief', errorStyle);
    return [];
  }

  const cacheKey = `sanity-${id}`;
  const asset = new AssetCache(cacheKey);

  const forceRefresh =
    process.env.FORCE_REFRESH === 'true' ||
    process.env.SANITY_FORCE_REFRESH === 'true' ||
    process.env.SANITY_FORCE_REFRESH_QUERY === id;

  if (!forceRefresh && asset.isCacheValid(cacheDuration)) {
    logger.trace(`${id}: using cache`, null, 'brief', cacheStyle);
    return asset.getCachedValue();
  }

  logger.trace(`${id}: fetching from Sanity`, null, 'brief', fetchStyle);

  try {
    const data = await client.fetch(query, params);
    await asset.save(data, 'json');
    return data;
  } catch (error) {
    logger.trace(`${id}: fetch error`, error.message || error, 'brief', errorStyle);
    return [];
  }
}
