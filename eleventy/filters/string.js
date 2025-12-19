/** @format */

/**
 * String Filters for Eleventy
 *
 * Provides text processing utilities for template rendering:
 * - Markdown conversion with HTML support
 * - String truncation for preview text
 * - Case transformation
 * - HTML class injection into rendered markdown
 *
 * USAGE IN TEMPLATES:
 * {{ description | markdownify }}         {# Markdown to HTML #}
 * {{ title | truncate(50) }}              {# Shorten with ellipsis #}
 * {{ body | prettify("prose prose-lg") }} {# Markdown with classes #}
 * {{ text | uppercase }}                  {# UPPERCASE TEXT #}
 */

import markdownIt from 'markdown-it';
import * as cheerio from 'cheerio';

export default function (eleventyConfig) {
  /**
   * Convert a string to uppercase.
   */
  eleventyConfig.addFilter('uppercase', str => {
    return str.toUpperCase();
  });

  eleventyConfig.addFilter('truncate', truncate);
  eleventyConfig.addFilter('markdownify', markdownify);
  eleventyConfig.addFilter('prettify', prettify);
}

/**
 * Truncate a string to a specific length and add ellipsis.
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length before truncation
 * @returns {string} Truncated string with "..." appended if truncated
 *
 * EXAMPLE:
 * {{ "This is a long title" | truncate(10) }}
 * => "This is a ..."
 */
export function truncate(str, length) {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

/**
 * Convert a markdown string to HTML.
 * Supports:
 * - Inline formatting (bold, italic, links)
 * - Code blocks and inline code
 * - Lists and nested lists
 * - Line breaks (single \n becomes <br>)
 * - URL auto-linking
 *
 * @param {string} markdownString - Markdown content to convert
 * @returns {string} HTML output safe for template rendering
 *
 * EXAMPLE:
 * {{ "**Bold** and *italic* text" | markdownify }}
 * => "<p><strong>Bold</strong> and <em>italic</em> text</p>"
 */
export function markdownify(markdownString) {
  const md = new markdownIt({
    html: false, // Don't allow raw HTML in markdown
    breaks: true, // Convert \n to <br> in paragraphs
    linkify: true, // Auto-link URLs
    typographer: true, // Smart quotes and dashes
  });

  return md.render(markdownString);
}

/**
 * Convert markdown to HTML and add CSS classes to paragraph elements.
 * Useful for applying prose styling classes to generated content.
 *
 * @param {string} markdownString - Markdown content to convert
 * @param {string} parClasses - CSS classes to add to <p> elements
 * @returns {string} HTML with classes applied
 *
 * EXAMPLE:
 * {{ article.body | prettify("text-gray-700 leading-relaxed") }}
 * => "<p class="text-gray-700 leading-relaxed">First paragraph...</p>"
 */
export function prettify(markdownString, parClasses) {
  const $ = cheerio.load(markdownify(markdownString));
  $('p').addClass(parClasses);
  return $.html();
}
