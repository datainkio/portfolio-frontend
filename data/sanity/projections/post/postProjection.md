---
id: frontend.cms.projections.postProjection
role: "GROQ projection fragment — reusable field shape for Post reference documents."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Post reference projection"
tags:
  - "#frontend/cms"
  - "#frontend/cms/projections"
links:
  - "[[README.projections]]"
---

# Post reference projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **post reference**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export | Shape of |
| --- | --- |
| `POST_REF_PROJECTION` | post reference fields |

## Source

- Path: `data/sanity/projections/post/postProjection.js`

Related: [[README.projections]]
