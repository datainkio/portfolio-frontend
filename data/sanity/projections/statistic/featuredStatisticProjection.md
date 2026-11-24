---
description: "GROQ projection fragment: the field shape for featured statistic objects, with the project each belongs to."
status: stable
tags:
  - cms
  - projections
aliases:
  - Featured statistic projection
links:
  - "[[data/sanity/projections/README|projections]]"
  - "[[data/sanity/queries/statistic/featured-statistics|featured-statistics]]"
---

# Featured statistic projection

GROQ projection fragment for the `statistic` objects embedded in `project.statistics`
(schema: `backend/schemaTypes/objects/atoms/statistic.ts`).

| Export                          | Shape of                  |
| ------------------------------- | ------------------------- |
| `FEATURED_STATISTIC_PROJECTION` | featured statistic fields |

## Fields of note

- `_key`, `label`, `value`, `description`: the statistic as stored. `value` is display text ("40%"), not a number. `description` is optional.
- `project`: `{ _id, title, slug }` of the project that owns the statistic, read through `^`. The projection only works where the parent scope is a project.
- `featured` is not returned: the query filters on it.

## Source

- Path: `data/sanity/projections/statistic/featuredStatisticProjection.js`

Related: [[data/sanity/projections/README|projections]]
