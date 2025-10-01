/** @format */
import markdownIt from "markdown-it";
import * as cheerio from "cheerio";
export default function (eleventyConfig) {
  /**
   * Convert a string to uppercase.
   */
  eleventyConfig.addFilter("uppercase", (str) => {
    return str.toUpperCase();
  });

  eleventyConfig.addFilter("truncate", truncate);
  eleventyConfig.addFilter("markdownify", markdownify);
  eleventyConfig.addFilter("prettify", prettify);
}

/**
 * Truncate a string to a specific length.
 */
export function truncate(str, length) {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

/**
 * Convert a markdown string to HTML.
 */
export function markdownify(markdownString) {
  const md = new markdownIt({
    html: false,
    breaks: true,
    linkify: true,
    typographer: true,
  });

  return md.render(markdownString);
}

/**
 * Convert a markdown string to HTML and add classes to the generated paragraph elements.
 */
export function prettify(markdownString, parClasses) {
  const $ = cheerio.load(markdownify(markdownString));
  $("p").addClass(parClasses);
  return $.html();
}
