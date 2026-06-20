---
id: frontend.cms.projections.featuredImageProjection
role: "GROQ projection fragment — reusable field shape for Featured image documents."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Featured image projection"
tags:
  - "#frontend/cms"
  - "#frontend/cms/projections"
links:
  - "[[README.projections]]"
---

# Featured image projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **featured image**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export | Shape of |
| --- | --- |
| `FEATURED_IMAGE_PROJECTION` | featured image fields |

## Source

- Path: `data/sanity/projections/image/featuredImageProjection.js`

Related: [[README.projections]]
