---
id: frontend.cms.projections.projectsLandingProjection
role: "GROQ projection fragment — reusable field shape for Projects landing documents."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Projects landing projection"
tags:
  - cms
  - projections
links:
  - "[[README.projections]]"
---

# Projects landing projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **projects landing**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export | Shape of |
| --- | --- |
| `PROJECTS_LANDING_PROJECTION` | projects landing fields |

## Source

- Path: `data/sanity/projections/project/projectsLandingProjection.js`

Related: [[README.projections]]
