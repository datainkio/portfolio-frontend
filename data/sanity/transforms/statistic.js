/** @format */

import { resolveProjectCardUrl } from "./project.js";

/**
 * Adds each featured statistic's project URL.
 */
export function normalizeFeaturedStatisticRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.filter(Boolean).map((statistic) => ({
    ...statistic,
    project: statistic.project
      ? { ...statistic.project, url: resolveProjectCardUrl(statistic.project) }
      : null,
  }));
}
