---
id: frontend.cms.projections.organizationProjection
role: "GROQ projection fragment — reusable field shape for Organization documents."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Organization projection"
tags:
  - cms
  - projections
links:
  - "[[README.projections]]"
---

# Organization projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **organization**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export | Shape of |
| --- | --- |
| `ORGANIZATION_PROJECTION` | organization fields |

## Source

- Path: `data/sanity/projections/organization/organizationProjection.js`

Related: [[README.projections]]
