---
id: frontend.cms.projections.industryProjection
role: "GROQ projection fragment — reusable field shape for Industry documents."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Industry projection"
tags:
  - "#frontend/cms"
  - "#frontend/cms/projections"
links:
  - "[[README.projections]]"
---

# Industry projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **industry**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export | Shape of |
| --- | --- |
| `INDUSTRY_PROJECTION` | industry fields |

## Source

- Path: `data/sanity/projections/industry/industryProjection.js`

Related: [[README.projections]]
