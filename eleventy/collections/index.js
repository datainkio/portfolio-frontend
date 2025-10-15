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
 * 2. Navigation (navigation.js):
 *    - Builds navigation structure from njk/_pages/ directory
 *    - Creates nav_primary and nav_projects collections
 *    - Respects eleventyNavigation frontmatter
 *
 * EXECUTION ORDER:
 * 1. site.json loaded (synchronously)
 * 2. initAirtable() - Fetches external data (async)
 * 3. initNavigation() - Builds navigation tree (async)
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
import { init as initAirtable } from './content.js';

// ESM __dirname equivalent
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load site configuration synchronously (required for all initializers)
const site = JSON.parse(readFileSync(join(__dirname, '../../njk/_data/site.json'), 'utf8'));

/**
 * Initialize all Eleventy collections
 *
 * Orchestrates collection initialization in the correct order:
 * 1. Airtable data collections (external CMS content)
 * 2. Navigation collections (file structure-based)
 *
 * @param {Object} eleventyConfig - Eleventy configuration object
 * @returns {Promise<void>}
 */
export default async function (eleventyConfig) {
  try {
    // Initialize Airtable data collections
    // Creates collections for each table in site.airtables array
    await initAirtable(eleventyConfig, site);

    // Initialize navigation collections
    // Builds nav_primary and nav_projects from njk/_pages/
    await initNavigation(eleventyConfig, site);
  } catch (error) {
    // Log collection initialization errors without breaking build
    console.error(chalk.red('💥 Error loading data:'), error);
  }
}
