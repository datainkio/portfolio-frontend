---
description: GROQ query definition registered as an Eleventy collection (Organizations).
status: stable
tags:
  - cms
  - queries
aliases:
  - Organizations query
links:
  - "[[README.queries]]"
  - "[[organizationProjection]]"
---

# Organizations query

GROQ query definition fetched by the service layer and registered as the **`organizations`** Eleventy
collection.

| Export               | Collection id   |
| -------------------- | --------------- |
| `organizationsQuery` | `organizations` |

- Projection: [[organizationProjection]]
- Order: `orderRank asc`, the editor-set order from Studio's drag-to-order Organizations list (`@sanity/orderable-document-list`). See the content-model contract `documents/system/organization.md`.

## Source

- Path: `data/sanity/queries/organization/organizations.js`

Related: [[README.queries]], [[queries]]
