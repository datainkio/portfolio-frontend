/**
 * ---
 * aix:
 *   id: frontend.eleventy
 *   role: Eleventy configuration entrypoint.
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - .eleventy.js
 * ---
 */
/** @format */
// Silence punycode warning
process.noDeprecation = true;

import logger, { LumberjackStyle } from "@datainkio/lumberjack";

// logger.enabled = false;

import collections from "./eleventy/collections/index.js";
import plugins from "./eleventy/plugins/plugins.js";
import filters from "./eleventy/filters/filters.js";
import shortcodes from "./eleventy/shortcodes/shortcodes.js";

/**
 * Custom Logger Styles for 11ty Operations
 */
const titleStyle = new LumberjackStyle("#EE9B00", "🚀");
const msgStyle = new LumberjackStyle("#CA6702", "•");
const successStyle = new LumberjackStyle("#EE9B00", "\n👍");

export default async function (eleventyConfig) {
  await logger.group(async () => {
    logger.trace("11ty Initialization", null, "brief", titleStyle);
    logger.trace(
      null,
      "Initialization begins by configuring passthrough copy for static assets, including JavaScript and CSS files. It then loads and registers 11ty objects: plugins, filters, shortcodes, and collections. The collections are populated by pulling data from the CMS.\n",
      "brief",
      "standard",
    );
    // Passthrough copy for static assets
    logger.trace("Configuring passthrough copy", null, "brief", msgStyle);
    eleventyConfig.addPassthroughCopy({ "static/robots.txt": "robots.txt" });
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy({ js: "assets/js" });
    eleventyConfig.addPassthroughCopy({
      "node_modules/@datainkio/lumberjack/dist": "assets/js/utils/lumberjack",
    });
    eleventyConfig.addPassthroughCopy({
      "node_modules/gsap": "assets/js/vendor/gsap",
    });
    eleventyConfig.addPassthroughCopy({
      "node_modules/leader-line": "assets/js/vendor/leader-line",
    });
    // Copy JavaScript files to _site/assets/
    // eleventyConfig.addPassthroughCopy({ js: 'assets/js' });
    // Copy video files for background video in StageManager
    // eleventyConfig.addPassthroughCopy({ 'assets/video': 'assets/video' });
    eleventyConfig.setServerOptions({
      watch: ["_site/**/*.css"],
    });
    // eleventyConfig.addPassthroughCopy("video"); // slows down the build
    // eleventyConfig.addPassthroughCopy("svg");
    // eleventyConfig.addPassthroughCopy("src/js");

    // Plugins
    logger.trace("Registering 11ty plugins", null, "brief", msgStyle);
    plugins(eleventyConfig);

    // Filters
    logger.trace("Registering template filters", null, "brief", msgStyle);
    filters(eleventyConfig);

    // Shortcodes
    logger.trace("Registering template shortcodes", null, "brief", msgStyle);
    shortcodes(eleventyConfig);

    // README-as-index permalink rule is scoped to ia/docs/ via
    // ia/docs/docs.11tydata.js to avoid interfering with paginated templates.
    // Decision documented in: /docs/ia/frontmatter/

    // Collections
    logger.trace("Registering data collections", null, "brief", msgStyle);
    // Wait for all data to be fetched (either in parallel or sequential mode) before continuing with the build
    await collections(eleventyConfig);

    // Make Tailwind theme data available globally
    // eleventyConfig.addGlobalData("styles", tailwindConfig.theme.extend);
    logger.outdent();
    logger.trace(
      "11ty configuration complete. Ready to build.",
      null,
      "brief",
      successStyle,
    );
  });

  console.log("\n");

  return {
    dir: {
      input: "ia",
      includes: "../views", // relative to input
      output: "_site",
    },
    markdownTemplateEngine: "njk",
  };
}
