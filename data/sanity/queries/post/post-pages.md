---
description: GROQ query definition registered as an Eleventy collection (Post pages).
status: stable
tags:
  - cms
  - queries
aliases:
  - Post pages query
links:
  - "[[data/sanity/queries/README|queries]]"
  - "[[postProjection]]"
---

# Post pages query

GROQ query definition fetched by the service layer and registered as the **`postPages`** Eleventy
collection. One record per post, with body, files, relations and SEO. Posts without a slug are
left out.

| Export           | Collection id |
| ---------------- | ------------- |
| `postPagesQuery` | `postPages`   |

- Projection: [[postProjection]] (`POST_PAGE_PROJECTION`)
- Transform: `normalizePostPageRecords` in [[post]]
- Paginated at size 1 by `ia/post.md`.

## Source

- Path: `data/sanity/queries/post/post-pages.js`

Related: [[data/sanity/queries/README|queries]], [[queries]]
