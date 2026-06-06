/**
 * ---
 * aix:
 *   id: frontend.eleventy.filters.date
 *   role: Eleventy module: eleventy/filters/date.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - eleventy
 *     - filters
 * ---
 */
/**
 * Date Filters for Eleventy
 *
 * Provides human-readable date formatting for template rendering.
 * Uses Luxon (modern date library) for reliable date handling.
 *
 * USAGE IN TEMPLATES:
 * {{ post.date | postDate }}           {# "Jan 1, 2024" #}
 * {{ project.created | postDate }}     {# Human-readable format #}
 *
 * Works with JavaScript Date objects and ISO 8601 date strings.
 */

import { DateTime } from "luxon";

export default function (eleventyConfig) {
  /**
   * Format a date in human-readable medium format.
   * Example: "Jan 1, 2024" instead of "2024-01-01T00:00:00.000Z"
   *
   * @param {Date|string} dateObj - Date object or ISO date string
   * @returns {string} Formatted date string (e.g., "Jan 1, 2024")
   *
   * EXAMPLE:
   * {{ post.published | postDate }}   {# Article publish date #}
   * {{ event.date | postDate }}       {# Event date in calendar #}
   * {{ activity.created | postDate }} {# Activity timestamp #}
   *
   * NOTE: Works with both JavaScript Date objects and ISO 8601 date strings.
   */
  eleventyConfig.addFilter("postDate", (dateObj) => {
    const d = new Date(dateObj);
    return DateTime.fromJSDate(d).toLocaleString(DateTime.DATE_MED);
  });

  /**
   * Format a date with a consistent, reusable API.
   *
   * Default output matches `postDate` (DATE_MED), but supports:
   * - Luxon format strings (e.g., "DDD", "yyyy-LL-dd")
   * - Luxon presets via DateTime constants (e.g., DateTime.DATE_MED)
   *
   * USAGE:
   * {{ page.date | formatDate }}
   * {{ page.date | formatDate('DDD') }}
   * {{ activity.fields.date | formatDate('yyyy LLL dd') }}
   */
  eleventyConfig.addFilter("formatDate", (dateObj, format = "DATE_MED") => {
    if (!dateObj) return "";

    const jsDate = dateObj instanceof Date ? dateObj : new Date(dateObj);
    const dt = DateTime.fromJSDate(jsDate);
    if (!dt.isValid) return "";

    // Allow passing a Luxon preset key, e.g. "DATE_MED".
    if (typeof format === "string" && format in DateTime) {
      return dt.toLocaleString(DateTime[format]);
    }

    // Treat any other string as a Luxon format string.
    if (typeof format === "string") {
      return dt.toFormat(format);
    }

    // Allow direct passing of a Luxon preset object.
    return dt.toLocaleString(format);
  });
}
