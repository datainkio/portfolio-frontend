---
id: frontend.cms.projections.roleProjection
role: "GROQ projection fragment — reusable field shape for Role documents."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Role projection"
tags:
  - cms
  - projections
links:
  - "[[README.projections]]"
---

# Role projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **role**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export | Shape of |
| --- | --- |
| `ROLE_PROJECTION` | role fields |

## Source

- Path: `data/sanity/projections/role/roleProjection.js`

Related: [[README.projections]]
