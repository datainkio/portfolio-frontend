---
id: frontend.cms.projections.outcomeProjection
role: "GROQ projection fragment — reusable field shape for Outcome documents."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Outcome projection"
tags:
  - "#frontend/cms"
  - "#frontend/cms/projections"
links:
  - "[[README.projections]]"
---

# Outcome projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **outcome**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export | Shape of |
| --- | --- |
| `OUTCOME_PROJECTION` | outcome fields |

## Source

- Path: `data/sanity/projections/outcome/outcomeProjection.js`

Related: [[README.projections]]
