---
id: frontend.cms.projections.projectPageProjection
role: "GROQ projection fragment — reusable field shape for Project page documents."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Project page projection"
tags:
  - "#frontend/cms"
  - "#frontend/cms/projections"
links:
  - "[[README.projections]]"
---

# Project page projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **project page**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export | Shape of |
| --- | --- |
| `PROJECT_PAGE_PROJECTION` | project page fields |

## Source

- Path: `data/sanity/projections/project/projectPageProjection.js`

Related: [[README.projections]]
