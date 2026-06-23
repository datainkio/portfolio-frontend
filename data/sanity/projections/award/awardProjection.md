---
id: frontend.cms.projections.awardProjection
role: "GROQ projection fragment — reusable field shape for Award documents."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Award projection"
tags:
  - cms
  - projections
links:
  - "[[README.projections]]"
---

# Award projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **award**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export | Shape of |
| --- | --- |
| `AWARD_PROJECTION` | award fields |

## Source

- Path: `data/sanity/projections/award/awardProjection.js`

Related: [[README.projections]]
