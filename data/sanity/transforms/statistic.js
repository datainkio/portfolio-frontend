/** @format */

import { resolveProjectCardUrl } from "./project.js";

/**
 * Placeholder statistics for layout work while no project has a featured
 * statistic in Sanity. Invented figures, not claims about real projects: each
 * carries `mock: true` and no project, so a template can tell them apart.
 */
export const MOCK_FEATURED_STATISTICS = [
  {
    value: "40%",
    label: "Faster checkout",
    description:
      "Median time to complete a purchase, before and after the redesign.",
  },
  {
    value: "$2.3M",
    label: "New annual revenue",
    description: "Attributed to the relaunched product in its first year.",
  },
  {
    value: "3×",
    label: "Trial sign-ups",
    description: "Compared with the previous quarter.",
  },
  {
    value: "12 → 4 days",
    label: "Time to onboard",
    description: "From contract to first use.",
  },
  {
    value: "98",
    label: "Accessibility score",
    description: "Lighthouse, up from 61 at kickoff.",
  },
  {
    value: "−35%",
    label: "Support tickets",
    description: "In the six months after launch.",
  },
  {
    value: "1.2M",
    label: "Monthly visitors",
    description: "Peak traffic during the campaign.",
  },
  { value: "14", label: "Industry awards" },
].map((statistic, index) => ({
  _key: `mock-${index + 1}`,
  description: null,
  ...statistic,
  project: null,
  mock: true,
}));

/**
 * Adds each statistic's project URL. When Sanity returns no featured
 * statistics, returns the mock set and warns in the build log.
 */
export function normalizeFeaturedStatisticRecords(records = []) {
  const statistics = Array.isArray(records) ? records.filter(Boolean) : [];

  if (!statistics.length) {
    console.warn(
      "featuredStatistics: none in Sanity, using the 8 mock statistics",
    );
    return MOCK_FEATURED_STATISTICS;
  }

  return statistics.map((statistic) => ({
    ...statistic,
    project: statistic.project
      ? { ...statistic.project, url: resolveProjectCardUrl(statistic.project) }
      : null,
  }));
}
