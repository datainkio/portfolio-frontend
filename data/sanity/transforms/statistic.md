---
description: Normalize featured statistic records, with a mock set when Sanity has none.
status: stable
tags:
  - cms
  - transforms
aliases:
  - Statistic transforms
links:
  - "[[data/sanity/transforms/README|transforms]]"
  - "[[data/sanity/queries/statistic/featured-statistics|featured-statistics]]"
---

# Statistic transforms

| Export                                       | Purpose                                                          |
| -------------------------------------------- | ---------------------------------------------------------------- |
| `normalizeFeaturedStatisticRecords(records)` | add `project.url`; return the mock set when there are no records |
| `MOCK_FEATURED_STATISTICS`                   | eight placeholder statistics                                     |

## Record shape

`{ _key, label, value, description, project: { _id, title, slug, url } }`. `project.url` comes
from `resolveProjectCardUrl` in [project.js](project.js).

## Mock set

No project in Sanity has a statistic yet (checked 2026-11-24). Until one is featured, the
transform returns `MOCK_FEATURED_STATISTICS` and logs a warning in the build. The figures are
invented for layout work and are not claims about real projects. Each mock has `mock: true` and
`project: null`, so a template can tell it from a real record. Remove the fallback, or keep the
mocks out of production, before the statistics display ships.

## Source

- Path: `data/sanity/transforms/statistic.js`

Related: [[data/sanity/transforms/README|transforms]]
