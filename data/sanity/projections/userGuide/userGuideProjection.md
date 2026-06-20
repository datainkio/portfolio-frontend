---
id: frontend.cms.projections.userGuideProjection
role: "GROQ projection fragment — reusable field shape for User guide documents."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "User guide projection"
tags:
  - cms
  - projections
links:
  - "[[README.projections]]"
---

# User guide projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **user guide**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export | Shape of |
| --- | --- |
| `USER_GUIDE_PROJECTION` | user guide fields |

## Source

- Path: `data/sanity/projections/userGuide/userGuideProjection.js`

Related: [[README.projections]]
