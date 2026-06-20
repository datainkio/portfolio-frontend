---
id: frontend.cms.queries.skos_concept
role: "Factory that builds standard SKOS taxonomy-concept queries."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "SKOS concept query factory"
tags:
  - "#frontend/cms"
  - "#frontend/cms/queries"
links:
  - "[[README.queries]]"
  - "[[conceptProjection]]"
---

# SKOS concept query factory

Factory that builds a standard taxonomy-concept query from a config object, so the SKOS-backed
collections share one shape.

| Export | Purpose |
| --- | --- |
| `makeSkosConceptQuery({ id, description, cacheDuration, query })` | produce a query object for a SKOS concept scheme |

Consumed by the [[activities]], [[industries]], [[outcomes]], and [[roles]] queries.

## Source

- Path: `data/sanity/queries/taxonomy/skos-concept.js`

Related: [[README.queries]], [[conceptProjection]]
