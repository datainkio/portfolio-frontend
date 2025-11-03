/** @format */

/**
 * Documentation Collection - Placeholder for future README integration
 */

export async function init(eleventyConfig) {
  console.log('[Documentation] Initializing documentation collection');

  eleventyConfig.addCollection('documentation', function (collectionApi) {
    // Empty collection for now - README files need to be copied to njk/ directory
    // or processed via a different method
    return [];
  });

  console.log('[Documentation] ✅ Documentation collection initialized');
}
