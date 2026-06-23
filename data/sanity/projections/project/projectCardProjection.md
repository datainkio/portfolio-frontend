---
id: frontend.cms.projections.projectCardProjection
role: "GROQ projection fragment — reusable field shape for Project card documents."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Project card projection"
tags:
  - cms
  - projections
links:
  - "[[README.projections]]"
---

# Project card projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **project card**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export | Shape of |
| --- | --- |
| `PROJECT_CARD_PROJECTION` | project card fields |

## Source

- Path: `data/sanity/projections/project/projectCardProjection.js`

Related: [[README.projections]]
