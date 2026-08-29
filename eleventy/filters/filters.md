---
description: "Barrel that registers every filter module with 11ty, plus the datatype filter."
status: stable
tags:
  - filters
aliases:
  - Filters barrel
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
