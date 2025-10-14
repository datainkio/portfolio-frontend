/** @format */
// Silence punycode warning
process.noDeprecation = true;

import logger from './js/utils/logger/index.js';

import collections from './eleventy/collections/index.js';
import plugins from './eleventy/plugins/plugins.js';
import filters from './eleventy/filters/filters.js';
import shortcodes from './eleventy/shortcodes/shortcodes.js';

export default async function (eleventyConfig) {
  console.log('\n');

  await logger.group(async () => {
    logger.trace(
      '11ty Configuration:',
      'Initializing Eleventy static site generator...',
      'brief',
      'headsup'
    );

    // Passthrough copy for static assets
    logger.trace(
      'Configuring passthrough copy:',
      'Setting up static asset routing...',
      'brief',
      'standard'
    );
    eleventyConfig.addPassthroughCopy({ 'static/robots.txt': 'robots.txt' });
    eleventyConfig.addPassthroughCopy('assets');
    // Copy JavaScript files to _site/assets/
    eleventyConfig.addPassthroughCopy({ js: 'assets/js' });
    eleventyConfig.setServerOptions({
      watch: ['_site/**/*.css'],
    });
    // eleventyConfig.addPassthroughCopy("video"); // slows down the build
    // eleventyConfig.addPassthroughCopy("svg");
    // eleventyConfig.addPassthroughCopy("src/js");

    // Plugins
    logger.trace('Loading plugins:', 'Registering 11ty plugins...', 'brief', 'standard');
    plugins(eleventyConfig);

    // Filters
    logger.trace('Loading filters:', 'Registering template filters...', 'brief', 'standard');
    filters(eleventyConfig);

    // Shortcodes
    logger.trace('Loading shortcodes:', 'Registering template shortcodes...', 'brief', 'standard');
    shortcodes(eleventyConfig);

    // Collections
    logger.trace('Loading collections:', 'Registering data collections...', 'brief', 'standard');
    collections(eleventyConfig);

    // Make Tailwind theme data available globally
    // eleventyConfig.addGlobalData("styles", tailwindConfig.theme.extend);

    logger.trace('11ty configuration complete:', 'Ready to build site', 'brief', 'success');
  });

  console.log('\n');

  return {
    dir: {
      input: 'njk/_pages',
      includes: '../_includes',
      data: '../_data',
      output: '_site',
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
  };
}
