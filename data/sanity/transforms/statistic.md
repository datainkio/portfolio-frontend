---
description: Normalize featured statistic records by adding each one's project URL.
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

| Export                                       | Purpose           |
| -------------------------------------------- | ----------------- |
| `normalizeFeaturedStatisticRecords(records)` | add `project.url` |

## Record shape

`{ _key, label, value, description, project: { _id, title, slug, url } }`. `project.url` comes
from `resolveProjectCardUrl` in [project.js](project.js).

An empty result stays empty, and the homepage Work section then renders no grid. A mock set
stood in until statistics were entered in Sanity (removed 2026-11-24).

## Source

- Path: `data/sanity/transforms/statistic.js`

Related: [[data/sanity/transforms/README|transforms]]
