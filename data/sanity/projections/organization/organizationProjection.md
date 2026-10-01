---
description: "GROQ projection fragment — reusable field shape for Organization documents."
status: stable
tags:
  - cms
  - projections
aliases:
  - Organization projection
links:
  - "[[README.projections]]"
---

# Organization projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **organization**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export                    | Shape of            |
| ------------------------- | ------------------- |
| `ORGANIZATION_PROJECTION` | organization fields |

Includes `orderRank`, the editor-set display order, so queries can sort on it after projecting.

## Source

- Path: `data/sanity/projections/organization/organizationProjection.js`

Related: [[README.projections]]
