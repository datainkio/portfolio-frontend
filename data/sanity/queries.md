---
description: "Barrel that aggregates every query definition into CMS_QUERIES, the array the service layer iterates to build Eleventy collections."
status: stable
tags:
  - cms
  - queries
aliases:
  - CMS queries barrel
links:
  - "[[README.queries]]"
  - "[[README.sanity]]"
---

# CMS queries barrel

Aggregates every query definition into `CMS_QUERIES`, the array the service layer iterates to
build Eleventy collections.

```js
export const CMS_QUERIES = [
  /* one entry per query in queries/ */
];
```

> [!note] Query id → collection name
> Each query's `id` becomes its Eleventy collection name (e.g. `collections.projects`). Keep ids
> source-agnostic. Add new queries under `queries/` and register them here.

## Source

- Path: `data/sanity/queries.js`
