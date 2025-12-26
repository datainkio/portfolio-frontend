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
 * AIRTABLE INTEGRATION:
 * Airtable date fields come as ISO strings - this filter makes them readable:
 * {{ activity.date | postDate }}       {# Converts ISO → "Jan 15, 2024" #}
 */

import { DateTime } from 'luxon';

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
   * NOTE: Works with both JavaScript Date objects and ISO 8601 date strings
   * from Airtable API responses.
   */
  eleventyConfig.addFilter('postDate', dateObj => {
    const d = new Date(dateObj);
    return DateTime.fromJSDate(d).toLocaleString(DateTime.DATE_MED);
  });
}
