---
id: frontend.eleventy.filters.filters
role: "Barrel that registers every filter module with 11ty, plus the datatype filter."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Filters barrel"
tags:
  - eleventy
  - filters
links:
  - "[[README.filters]]"
  - "[[array]]"
  - "[[string]]"
---

# Filters barrel

Single registration surface for all filters. [[.eleventy]] imports this one module; it
fans out to each sibling.

```js
import filters from "./eleventy/filters/filters.js";
filters(eleventyConfig);
```

## Registers

- [[array]] · [[date]] · [[dom]] · [[string]] · [[file]] · [[image]] · [[color]]
- `datatype` — runtime type label (`array` / `null` / `date` / …)
- `findRecord` — join a CMS record id to its content

## Source

- Path: `eleventy/filters/filters.js`
