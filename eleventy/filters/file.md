---
description: "File/asset filters: size reporting, type tallies, cache age, and async inline-SVG fetching."
status: stable
tags:
  - filters
aliases:
  - File filters
links:
  - "[[eleventy/filters/README|filters]]"
  - "[[filters]]"
---

# File filters

Asset metadata + inline-SVG filters for templates.

| Filter                         | Purpose                                     |
| ------------------------------ | ------------------------------------------- |
| `filesize`                     | human-readable byte size                    |
| `uniqueTypes`                  | distinct asset types                        |
| `countByType`                  | tally assets per type                       |
| `totalSize`                    | sum of sizes                                |
| `lastCacheUpdate`              | cache freshness timestamp                   |
| `inlineSvgFromUrl(url, class)` | **async** fetch + inline an SVG             |
| `localAsset(url)`              | **async** copy a remote file into the build |

> [!warning] Module-scope SVG cache — migration pending
> `inlineSvgFromUrl` memoizes fetched markup in a module-level `Map` (`svgMarkupCache`).
> This is the cache targeted by [[replace-module-scope-svg-cache-with-@11t]] — replace
> with `@11ty/eleventy-fetch` for proper TTL/persistence. Do not add more module-scope
> caches here in the meantime.

## localAsset

Downloads `url` through `@11ty/eleventy-fetch` (cached 30 days in `.cache/`), writes it to
`<output>/cms/<file name>` and returns `/cms/<file name>`. Use it for assets the browser fetches
in CORS mode, such as CSS mask images: the Sanity CDN only answers the project's listed CORS
origins, so a mask loaded from another host (a LAN address, `www`) is blocked and the masked
element disappears. If the download fails it logs a warning and returns the remote URL.

## Source

- Path: `eleventy/filters/file.js`
