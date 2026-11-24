/** @format */
import groq from "groq";
import { FEATURED_STATISTIC_PROJECTION } from "../../projections/statistic/featuredStatisticProjection.js";

// Statistics are objects embedded in project.statistics, not documents. The
// query walks the same projects the `projects` query lists (those with an
// industry), keeps each one's featured statistics, and flattens them into one
// array: ordered by project title, then by array position within a project.
export const featuredStatisticsQuery = {
  id: "featuredStatistics",
  description:
    "Featured statistics from every listed project, flattened into one list",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "project" && defined(industry._ref) && count(statistics[featured == true]) > 0] | order(page.title asc) {
    "statistics": statistics[featured == true]${FEATURED_STATISTIC_PROJECTION}
  }.statistics[]`,
};
