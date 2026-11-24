---
description: "GROQ projection fragment — reusable field shape for the Documentation landing singleton."
status: stable
tags:
  - cms
  - projections
aliases:
  - Documentation landing projection
links:
  - "[[data/sanity/projections/README|projections]]"
---

# Documentation landing projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for the **documentation
landing** singleton: title, nav label, and the body with image assets resolved. The schema's
`decisions` field is not selected.

| Export                             | Shape of                     |
| ---------------------------------- | ---------------------------- |
| `DOCUMENTATION_LANDING_PROJECTION` | documentation landing fields |

## Source

- Path: `data/sanity/projections/documentation/documentationLandingProjection.js`

Related: [[data/sanity/projections/README|projections]]
