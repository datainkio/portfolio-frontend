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
 * the initialization of content collections (from Sanity CMS) and navigation
 * collections (from file structure).
 *
 * @module eleventy/collections
 *
 * CRITICAL INTEGRATION POINTS:
 * - Loads site.json configuration before initializing collections
 * - Executes collection initializers in specific order (Sanity → Navigation)
 * - Used by .eleventy.js via eleventyConfig.addPlugin()
 *
 * COLLECTION SOURCES:
 * 1. Sanity CMS (sanity.js):
 *    - Fetches data from Sanity via GROQ and @sanity/client
 *    - Creates collections defined in data/sanity/queries.js
 *    - Uses site.cms for defaults and caching behavior
 *
 * 2. Navigation (navigation.js):
 *    - Builds navigation structure from `ia/` routes (Eleventy input dir)
 *    - Creates nav_primary and nav_projects collections
 *    - Respects eleventyNavigation frontmatter
 *
 * EXECUTION ORDER:
 * 1. site.json loaded (synchronously)
 * 2. initSanity() - Fetches Sanity data (async)
 * 3. initNavigation() - Builds navigation tree (async)
 *
 * ERROR HANDLING:
 * - Catches and logs errors from collection initializers
 * - Prevents individual collection failures from breaking entire build
 * - Uses chalk for error visibility in terminal output
 *
 * CONFIGURATION:
 * Site configuration loaded from site.json must include:
 * [ ] CHORE: Update site.json path to current location.
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

import chalk from "chalk";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { init as initNavigation } from "./navigation.js";
import { init as initSanity } from "./sanity.js";
import { init as initDocumentation } from "./documentation.js";

// ESM __dirname equivalent
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load site configuration synchronously (required for all initializers)
const SITE = JSON.parse(
  readFileSync(join(__dirname, "../../site.json"), "utf8"),
);

/**
 * Initialize all Eleventy collections
 *
 * CRITICAL: Collections must be registered in dependency order.
 * 11ty builds collections in the order they're registered, so dependencies
 * must be registered before collections that depend on them.
 *
 * DEPENDENCY CHAIN:
 * 1. Sanity collections (no dependencies)
 *    - projects, work, activities, etc.
 * 2. Navigation collections (depends on Sanity)
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
    // Make site.json available to all templates/frontmatter as `site`.
    eleventyConfig.addGlobalData("site", SITE);

    // Just a little thing to display the date of the last build
    eleventyConfig.addGlobalData("buildDate", () => new Date());

    // STEP 1: Initialize Sanity collections
    await initSanity(eleventyConfig, SITE);

    // STEP 2: Initialize navigation collections
    await initNavigation(eleventyConfig, SITE);

    // STEP 3: Initialize documentation collection
    // Auto-discovers README.md files and creates documentation pages
    // await initDocumentation(eleventyConfig);
  } catch (error) {
    // Log collection initialization errors without breaking build
    console.error(chalk.red("💥 Error loading data:"), error);
  }
}
