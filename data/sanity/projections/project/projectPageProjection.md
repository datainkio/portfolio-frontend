---
description: "GROQ projection fragment — reusable field shape for Project page documents."
status: stable
tags:
  - cms
  - projections
aliases:
  - Project page projection
links:
  - "[[README.projections]]"
---

# Project page projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **project page**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export                    | Shape of            |
| ------------------------- | ------------------- |
| `PROJECT_PAGE_PROJECTION` | project page fields |

`awards` is sorted `organization.orderRank asc, title asc`, matching `awardsQuery`, so the
Recognition groups (built by `groupByOrg`) follow the editor-set organization order rather
than the order awards were added to the project.

## Source

- Path: `data/sanity/projections/project/projectPageProjection.js`

Related: [[README.projections]]
