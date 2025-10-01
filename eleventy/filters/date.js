import { DateTime } from "luxon";

export default function (eleventyConfig) {
  /**
   * Format the date for a post.
   */
  eleventyConfig.addFilter("postDate", (dateObj) => {
    const d = new Date(dateObj);
    return DateTime.fromJSDate(d).toLocaleString(DateTime.DATE_MED);
  });
}