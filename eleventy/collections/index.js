/**
 * ---
 * aix:
 *   id: frontend.eleventy.collections.index
 *   role: Eleventy module: eleventy/collections/index.js
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

/**
 * Eleventy Collections Manager
 *
 * Central orchestration point for all Eleventy collections. This module coordinates
 * the initialization of content collections (from Airtable CMS) and navigation
 * collections (from file structure).
 *
 * @module eleventy/collections
 *
 * CRITICAL INTEGRATION POINTS:
 * - Loads site.json configuration before initializing collections
 * - Executes collection initializers in specific order (Airtable → Navigation)
 * - Used by .eleventy.js via eleventyConfig.addPlugin()
 *
 * COLLECTION SOURCES:
 * 1. Airtable CMS (content.js):
 *    - Fetches data from Airtable API
 *    - Creates collections based on site.airtables configuration
 *    - Each table becomes a collection (e.g., 'projects', 'work')
 *
 * 2. Sanity CMS (sanity.js):
 *    - Fetches data from Sanity via GROQ and @sanity/client
 *    - Creates collections defined in cms/queries.js
 *    - Uses site.cms for defaults and caching behavior
 *
 * 3. Navigation (navigation.js):
 *    - Builds navigation structure from njk/_pages/ directory
 *    - Creates nav_primary and nav_projects collections
 *    - Respects eleventyNavigation frontmatter
 *
 * EXECUTION ORDER:
 * 1. site.json loaded (synchronously)
 * 2. initAirtable() - Fetches external data (async)
 * 3. initSanity() - Fetches Sanity data (async)
 * 4. initNavigation() - Builds navigation tree (async)
 *
 * ERROR HANDLING:
 * - Catches and logs errors from collection initializers
 * - Prevents individual collection failures from breaking entire build
 * - Uses chalk for error visibility in terminal output
 *
 * CONFIGURATION:
 * Site configuration loaded from njk/_data/site.json must include:
 * - site.airtables: Array of Airtable table configurations
 * - site.navigation: Navigation-specific settings
 *
 * @param {Object} eleventyConfig - Eleventy configuration object
 * @returns {Promise<void>}
 *
 * @example
 * // In .eleventy.js
 * import collections from './eleventy/collections/index.js';
 *
 * export default async function(eleventyConfig) {
 *   await collections(eleventyConfig);
 * }
 */

import chalk from 'chalk';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { init as initNavigation } from './navigation.js';
// import { init as initAirtable } from './content.js';
import { init as initSanity } from './sanity.js';
import { init as initDocumentation } from './documentation.js';

// ESM __dirname equivalent
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load site configuration synchronously (required for all initializers)
const site = JSON.parse(readFileSync(join(__dirname, '../../njk/_data/site.json'), 'utf8'));

/**
 * Initialize all Eleventy collections
 *
 * CRITICAL: Collections must be registered in dependency order.
 * 11ty builds collections in the order they're registered, so dependencies
 * must be registered before collections that depend on them.
 *
 * DEPENDENCY CHAIN:
 * 1. Airtable collections (no dependencies)
 *    - projects, work, activities, etc.
 * 2. Navigation collections (depends on Airtable)
 *    - nav_dirs (no dependencies)
 *    - nav_projects (depends on 'projects' collection)
 *    - nav_primary (depends on nav_dirs and nav_projects)
 * 3. Documentation collection (no dependencies)
 *    - documentation (auto-discovered from README.md files)
 *
 * @param {Object} eleventyConfig - Eleventy configuration object
 * @returns {Promise<void>}
 */
export default async function (eleventyConfig) {
  try {
    // STEP 1: Initialize Airtable data collections FIRST
    // These have no dependencies and are required by navigation
    // TODO(cms): Remove Airtable collections entirely once Sanity parity is complete.
    // await initAirtable(eleventyConfig, site);

    // STEP 2: Initialize Sanity collections
    await initSanity(eleventyConfig, site);

    // STEP 3: Initialize navigation collections AFTER Airtable
    // nav_projects depends on 'projects' collection from Airtable
    // nav_primary depends on nav_dirs and nav_projects
    await initNavigation(eleventyConfig, site);

    // STEP 4: Initialize documentation collection
    // Auto-discovers README.md files and creates documentation pages
    await initDocumentation(eleventyConfig);
  } catch (error) {
    // Log collection initialization errors without breaking build
    console.error(chalk.red('💥 Error loading data:'), error);
  }
}
