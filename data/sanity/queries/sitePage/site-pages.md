---
description: GROQ query definition registered as an Eleventy collection (site pages).
status: stable
tags:
  - cms
  - queries
aliases:
  - Site pages query
links:
  - "[[data/sanity/queries/README|queries]]"
  - "[[sitePageProjection]]"
---

# Site pages query

Fetched by the service layer and registered as the **`sitePages`** Eleventy collection. One record
per `sitePage` document that has a slug, ordered by title.

| Export           | Collection id |
| ---------------- | ------------- |
| `sitePagesQuery` | `sitePages`   |

- Projection: [[sitePageProjection]] (`SITE_PAGE_PROJECTION`)
- Transform: `normalizeSitePageRecords` in [[sitePage]]
- Paginated at size 1 by `ia/site-page.md`.

## Source

- Path: `data/sanity/queries/sitePage/site-pages.js`

Related: [[data/sanity/queries/README|queries]], [[queries]]
