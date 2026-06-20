---
id: frontend.cms.projections.conceptProjection
role: "GROQ projection fragment — reusable field shape for SKOS concept documents."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "SKOS concept projection"
tags:
  - "#frontend/cms"
  - "#frontend/cms/projections"
links:
  - "[[README.projections]]"
---

# SKOS concept projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **skos concept**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export | Shape of |
| --- | --- |
| `CONCEPT_PROJECTION` | skos concept fields |

## Source

- Path: `data/sanity/projections/taxonomy/conceptProjection.js`

Related: [[README.projections]]
