/**
 * ---
 * aix:
 *   id: frontend.cms.client
 *   role: CMS integration module: cms/client.js
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

import { config as loadEnv } from 'dotenv';
import { createClient } from '@sanity/client';
import logger, { LumberjackStyle } from '@datainkio/lumberjack';

loadEnv();
logger.enabled = true;

const infoStyle = new LumberjackStyle('#0A9396', '🛰️');
const errorStyle = new LumberjackStyle('#AE2012', '⛔');

const clean = value =>
  typeof value === 'string' ? value.trim().replace(/^['"]|['"]$/g, '') : value;

function resolveUseCdn({ token, siteUseCdn }) {
  const envFlag = process.env.SANITY_USE_CDN;
  const preferCdn = envFlag ? envFlag !== 'false' : (siteUseCdn ?? true);
  return token ? false : preferCdn;
}

export function resolveSanityConfig(siteSanity = {}) {
  const projectId = clean(process.env.SANITY_PROJECT_ID) || clean(siteSanity.projectId);
  const dataset = clean(process.env.SANITY_DATASET) || clean(siteSanity.dataset) || 'production';
  const token = clean(process.env.SANITY_API_TOKEN) || clean(siteSanity.token);
  const apiVersion =
    clean(process.env.SANITY_API_VERSION) || clean(siteSanity.apiVersion) || '2025-12-26';
  const useCdn = resolveUseCdn({ token, siteUseCdn: siteSanity.useCdn });
  const perspective = token ? 'previewDrafts' : 'published';

  return {
    projectId,
    dataset,
    token,
    apiVersion,
    useCdn,
    perspective,
  };
}

export function createSanityClient(config) {
  if (!config?.projectId || !config?.dataset) {
    logger.trace('Sanity config missing projectId or dataset', null, 'brief', errorStyle);
    return null;
  }

  logger.trace(
    'Creating Sanity client',
    { projectId: config.projectId, dataset: config.dataset, useCdn: config.useCdn },
    'verbose',
    infoStyle
  );

  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    token: config.token,
    useCdn: config.useCdn,
    perspective: config.perspective,
    requestTagPrefix: '11ty',
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
