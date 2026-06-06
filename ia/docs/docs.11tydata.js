/**
 * Directory data file: ia/docs/
 *
 * Applies the README-as-index permalink rule to all files under ia/docs/.
 * README.md files act as section index pages — this rewrites their URLs to
 * the parent directory path (e.g. docs/design/README.md → /docs/design/).
 *
 * Scoped here (rather than in .eleventy.js addGlobalData) to prevent
 * interference with paginated templates elsewhere in the input tree.
 *
 * Decision documented in: /docs/ia/frontmatter/
 */
export default {
  eleventyComputed: {
    permalink: (data) => {
      // Honor any explicit permalink defined in frontmatter
      if (data.permalink) return data.permalink;
      if (data.page?.inputPath?.endsWith("/README.md")) {
        return data.page.filePathStem.replace(/\/README$/, "/") + "/";
      }
    },
  },
};
