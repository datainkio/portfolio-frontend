/** @format */
// Silence punycode warning
process.noDeprecation = true;

import chalk from "chalk"; // style console logs

import collections from "./eleventy/collections/index.js";
import plugins from "./eleventy/plugins/plugins.js";
import filters from "./eleventy/filters/filters.js";
import shortcodes from "./eleventy/shortcodes/shortcodes.js";

export default function (eleventyConfig) {
  console.log("\n");
  console.log(chalk.gray(".".repeat(50)));
  console.log(chalk.magenta("\n11ty is running\n"));
  console.log("\n");

  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy({ "static/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy("assets");
  // Copy JavaScript files to _site/assets/
  eleventyConfig.addPassthroughCopy({ js: "assets/js" });
  eleventyConfig.setServerOptions({
    watch: ["_site/**/*.css"],
  });
  // eleventyConfig.addPassthroughCopy("video"); // slows down the build
  // eleventyConfig.addPassthroughCopy("svg");
  // eleventyConfig.addPassthroughCopy("src/js");

  // Plugins
  plugins(eleventyConfig);

  // Filters
  filters(eleventyConfig);

  // Shortcodes
  shortcodes(eleventyConfig);

  // Collections
  collections(eleventyConfig);

  // Make Tailwind theme data available globally
  // eleventyConfig.addGlobalData("styles", tailwindConfig.theme.extend);

  return {
    dir: {
      input: "njk/_pages",
      includes: "../_includes",
      data: "../_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
}
