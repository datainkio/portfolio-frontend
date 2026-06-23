---
id: frontend.cms.projections.pageProjection
role: "GROQ projection fragment — reusable field shape for Page documents."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Page projection"
tags:
  - cms
  - projections
links:
  - "[[README.projections]]"
---

# Page projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **page**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export | Shape of |
| --- | --- |
| `PAGE_PROJECTION` | page fields |

## Source

- Path: `data/sanity/projections/page/pageProjection.js`

Related: [[README.projections]]
