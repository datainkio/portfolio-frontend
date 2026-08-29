---
description: "File/asset filters: size reporting, type tallies, cache age, and async inline-SVG fetching."
status: stable
tags:
  - filters
aliases:
  - File filters
links:
  - "[[README.filters]]"
  - "[[filters]]"
---

# File filters

Asset metadata + inline-SVG filters for templates.

| Filter                         | Purpose                         |
| ------------------------------ | ------------------------------- |
| `filesize`                     | human-readable byte size        |
| `uniqueTypes`                  | distinct asset types            |
| `countByType`                  | tally assets per type           |
| `totalSize`                    | sum of sizes                    |
| `lastCacheUpdate`              | cache freshness timestamp       |
| `inlineSvgFromUrl(url, class)` | **async** fetch + inline an SVG |

> [!warning] Module-scope SVG cache — migration pending
> `inlineSvgFromUrl` memoizes fetched markup in a module-level `Map` (`svgMarkupCache`).
> This is the cache targeted by [[replace-module-scope-svg-cache-with-@11t]] — replace
> with `@11ty/eleventy-fetch` for proper TTL/persistence. Do not add more module-scope
> caches here in the meantime.

## Source

- Path: `eleventy/filters/file.js`
