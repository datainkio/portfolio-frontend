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
  // `markdownify(true)` also gives headings ids, keyed by the current page.
  eleventyConfig.addFilter(
    "markdownify",
    function (markdownString, headingIds) {
      return markdownify(
        markdownString,
        headingIds ? this.page?.url : undefined,
      );
    },
  );
  // Page content: Eleventy's markdown library, for /docs/ pages only.
  eleventyConfig.amendLibrary("md", (md) =>
    headingIdsRule(md, (env) => env?.page?.url),
  );
  eleventyConfig.on("eleventy.before", () => usedHeadingIds.clear());
  eleventyConfig.addFilter("prettify", prettify);
  eleventyConfig.addFilter("classes", classes);
  eleventyConfig.addFilter("slugify", slugify);
  eleventyConfig.addFilter("clearSVGFills", clearSVGFills);
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
  return str.length > length ? str.substring(0, length) + "..." : str;
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
export function markdownify(markdownString, pageUrl) {
  const md = new markdownIt({
    html: false, // Don't allow raw HTML in markdown
    breaks: true, // Convert \n to <br> in paragraphs
    linkify: true, // Auto-link URLs
    typographer: true, // Smart quotes and dashes
  });

  if (pageUrl) headingIdsRule(md, () => pageUrl);

  return md.render(markdownString);
}

/** Ids handed out so far, by page URL. Every render path shares it, so a page
 * that renders markdown more than once never repeats an id. */
const usedHeadingIds = new Map();

/**
 * markdown-it rule: give each heading without an id the slug of its text.
 * A repeat on the same page gets -2, -3. Acts only when `getUrl(env)` returns
 * a URL under /docs/, so no other page changes.
 *
 * @param {object} md - markdown-it instance
 * @param {(env: object) => string | undefined} getUrl - the page URL for a render
 */
export function headingIdsRule(md, getUrl) {
  md.core.ruler.push("heading_ids", (state) => {
    const url = getUrl(state.env);
    if (typeof url !== "string" || !url.startsWith("/docs/")) return;
    const used =
      usedHeadingIds.get(url) ?? usedHeadingIds.set(url, new Set()).get(url);
    state.tokens.forEach((token, i) => {
      if (token.type !== "heading_open" || token.attrGet("id")) return;
      const text = (state.tokens[i + 1].children ?? [])
        .filter((t) => t.type === "text" || t.type === "code_inline")
        .map((t) => t.content)
        .join("");
      const base = slugify(text);
      if (!base) return;
      let id = base;
      for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
      used.add(id);
      token.attrSet("id", id);
    });
  });
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
 * {{ article.body | prettify("text-neutral-700 leading-relaxed") }}
 * => "<p class="text-neutral-700 leading-relaxed">First paragraph...</p>"
 */
export function prettify(markdownString, parClasses) {
  const $ = cheerio.load(markdownify(markdownString));
  $("p").addClass(parClasses);
  return $.html();
}

/**
 * Flatten a class-variants object into a single space-delimited string.
 *
 * Designed for managing Tailwind responsive variants keyed by breakpoint
 * (e.g. base, sm, md, lg, xl), but accepts any plain object whose values
 * are strings or arrays of strings. Insertion order is preserved.
 * Non-string/empty values are skipped, and internal whitespace is
 * collapsed so the result is safe to drop directly into `class="…"`.
 *
 * @param {object|string} variants - Class-variants object, or a string
 *   (returned trimmed for convenience when callers may pass either).
 * @returns {string} Space-delimited class string.
 *
 * EXAMPLE:
 * {% set header = {
 *   "base": "flex items-center",
 *   "sm":   "gap-4",
 *   "md":   "gap-6",
 *   "lg":   "",
 *   "xl":   "gap-10"
 * } %}
 * <header class="{{ header | classes }}">
 * => <header class="flex items-center sm:gap-4 md:gap-6 xl:gap-10">
 */
export function classes(variants) {
  if (variants == null) return "";
  if (typeof variants === "string") return variants.trim().replace(/\s+/g, " ");
  if (Array.isArray(variants)) {
    return variants
      .map((v) => classes(v))
      .filter(Boolean)
      .join(" ");
  }
  if (typeof variants !== "object") return "";

  return Object.entries(variants)
    .map(([key, value]) => {
      if (!value) return "";
      const str =
        typeof value === "string"
          ? value.trim().replace(/\s+/g, " ")
          : classes(value);
      if (!str) return "";
      if (key === "base") return str;
      return str
        .split(" ")
        .map((cls) => `${key}:${cls}`)
        .join(" ");
    })
    .filter(Boolean)
    .join(" ");
}

/**
 * Convert a string to a URL-safe slug.
 *
 * EXAMPLE:
 * {{ "Getting Started!" | slugify }}
 * => "getting-started"
 */
export function slugify(str) {
  return String(str ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 Remove hard-coded fills from any SVG element.

  Removes:
    fill="#000"
    fill='red'
    fill = "#fff"

  Preserves:
    fill-rule
    fill-opacity
    fill-rule="evenodd"
 * @param {string} source- The SVG string to process
 * @returns {string} The processed SVG string with styles replaced by classes
 *
 * EXAMPLE:
 * {{ svgString | replaceStylesWithClasses }}
 * => "<svg class="w-6 h-6 text-neutral-500">...</svg>"
 */
export function clearSVGFills(source) {
  return source.replace(/\sfill\s*=\s*["'][^"']*["']/g, "");
}
