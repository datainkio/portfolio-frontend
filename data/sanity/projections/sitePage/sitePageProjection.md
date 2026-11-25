---
description: Reusable GROQ projection for sitePage documents.
status: stable
tags:
  - cms
  - projections
aliases:
  - Site page projection
links:
  - "[[data/sanity/queries/sitePage/site-pages|site-pages]]"
---

# Site page projection

Inner projection (no field name, no traversal operator) for `sitePage` documents.

| Export                 | Purpose                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `SITE_PAGE_PROJECTION` | `_id`, `title`, `slug`, `abstract`, `navLabel`, `parent{_id,_type}`, body, and `seo` |

- `parent` carries only `_id` and `_type`; the transform walks the chain through the `_id` map.
- Body images expand their `asset` the way the landing projection does.

## Source

- Path: `data/sanity/projections/sitePage/sitePageProjection.js`
