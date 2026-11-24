---
description: GROQ query definition registered as an Eleventy collection (featured statistics).
status: stable
tags:
  - cms
  - queries
aliases:
  - Featured statistics query
links:
  - "[[data/sanity/queries/README|queries]]"
  - "[[featuredStatisticProjection]]"
  - "[[data/sanity/transforms/statistic|statistic transforms]]"
---

# Featured statistics query

GROQ query definition fetched by the service layer and registered as the **`featuredStatistics`**
Eleventy collection (`cms.featuredStatistics`).

| Export                    | Collection id        |
| ------------------------- | -------------------- |
| `featuredStatisticsQuery` | `featuredStatistics` |

- Projection: [[featuredStatisticProjection]]

Statistics are objects embedded in `project.statistics`, not documents. The query takes the
projects the `projects` query lists (those with an industry), keeps each one's statistics with
`featured == true`, and flattens them into one array. Order: project title, then array position
within the project.

When the result is empty, the transform substitutes a mock set (see
[[data/sanity/transforms/statistic|statistic transforms]]).

## Source

- Path: `data/sanity/queries/statistic/featured-statistics.js`

Related: [[data/sanity/queries/README|queries]], [[queries]]
