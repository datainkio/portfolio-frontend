---
description: GROQ query definition registered as an Eleventy collection (Awards).
status: stable
tags:
  - cms
  - queries
aliases:
  - Awards query
links:
  - "[[data/sanity/queries/README|queries]]"
  - "[[awardProjection]]"
---

# Awards query

GROQ query definition fetched by the service layer and registered as the **`awards`** Eleventy
collection.

| Export        | Collection id |
| ------------- | ------------- |
| `awardsQuery` | `awards`      |

- Projection: [[awardProjection]]
- Order: `organization.orderRank asc, title asc`. `groupByOrg` keeps the order in which it first meets each organization, so this makes the organization groups come out in the editor-set order.

## Source

- Path: `data/sanity/queries/award/awards.js`

Related: [[data/sanity/queries/README|queries]], [[queries]]
