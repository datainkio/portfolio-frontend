---
id: frontend.cms.queries.outcomes
role: "GROQ query definition registered as an Eleventy collection (Outcomes)."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Outcomes query"
tags:
  - "#frontend/cms"
  - "#frontend/cms/queries"
links:
  - "[[README.queries]]"
  - "[[conceptProjection]]"
  - "[[skos-concept]]"
---

# Outcomes query

GROQ query definition fetched by the service layer and registered as the **`outcomes`** Eleventy
collection.

| Export | Collection id |
| --- | --- |
| `outcomesQuery` | `outcomes` |
- Projection: [[conceptProjection]]

> [!note] SKOS taxonomy concept
> Built via the `makeSkosConceptQuery` factory in [[skos-concept]] — a shared shape for taxonomy concepts.

## Source

- Path: `data/sanity/queries/outcome/outcomes.js`

Related: [[README.queries]], [[queries]]
