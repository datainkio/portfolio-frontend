---
id: frontend.eleventy.filters.array
role: "Array manipulation and querying filters for templates (group, sort, unique, subset, sum)."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Array filters"
tags:
  - "#frontend/eleventy"
  - "#frontend/eleventy/filters"
links:
  - "[[README.filters]]"
  - "[[filters]]"
---

# Array filters

Array utilities exposed to Nunjucks templates for shaping collection data without
mutating the source.

| Filter | Purpose |
| --- | --- |
| `sum` | total numeric values |
| `groupBy(key)` | group items by a property |
| `unique(key)` | de-duplicate by property |
| `sortByKey(key)` | sort by property |
| `getByIndexRange(a, b)` | extract a subset |

> [!note] `findRecord` lives in the barrel
> The CMS record-join filter (`findRecord`) is registered in [[filters]], not here.

## Source

- Path: `eleventy/filters/array.js`
