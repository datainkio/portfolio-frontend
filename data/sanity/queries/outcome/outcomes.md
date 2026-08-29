---
description: GROQ query definition registered as an Eleventy collection (Outcomes).
status: stable
tags:
  - cms
  - queries
aliases:
  - Outcomes query
links:
  - "[[README.queries]]"
  - "[[conceptProjection]]"
  - "[[skos-concept]]"
---

# Outcomes query

GROQ query definition fetched by the service layer and registered as the **`outcomes`** Eleventy
collection.

| Export          | Collection id |
| --------------- | ------------- |
| `outcomesQuery` | `outcomes`    |

- Projection: [[conceptProjection]]

> [!note] SKOS taxonomy concept
> Built via the `makeSkosConceptQuery` factory in [[skos-concept]] — a shared shape for taxonomy concepts.

## Source

- Path: `data/sanity/queries/outcome/outcomes.js`

Related: [[README.queries]], [[queries]]
