---
description: "GROQ projection fragment — reusable field shape for the Posts landing singleton."
status: stable
tags:
  - cms
  - projections
aliases:
  - Posts landing projection
links:
  - "[[data/sanity/projections/README|projections]]"
---

# Posts landing projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for the **posts landing**
singleton: title, nav label, and the intro body with image assets resolved.

| Export                    | Shape of                |
| ------------------------- | ----------------------- |
| `POSTS_LANDING_PROJECTION` | posts landing fields   |

## Source

- Path: `data/sanity/projections/post/postsLandingProjection.js`

Related: [[data/sanity/projections/README|projections]]
