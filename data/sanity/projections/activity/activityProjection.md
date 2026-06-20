---
id: frontend.cms.projections.activityProjection
role: "GROQ projection fragment — reusable field shape for Activity documents."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Activity projection"
tags:
  - "#frontend/cms"
  - "#frontend/cms/projections"
links:
  - "[[README.projections]]"
---

# Activity projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **activity**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export | Shape of |
| --- | --- |
| `ACTIVITY_PROJECTION` | activity fields |

## Source

- Path: `data/sanity/projections/activity/activityProjection.js`

Related: [[README.projections]]
