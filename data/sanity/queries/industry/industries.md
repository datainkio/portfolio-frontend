---
id: frontend.cms.queries.industries
role: "GROQ query definition registered as an Eleventy collection (Industries)."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Industries query"
tags:
  - cms
  - queries
links:
  - "[[README.queries]]"
  - "[[conceptProjection]]"
  - "[[skos-concept]]"
---

# Industries query

GROQ query definition fetched by the service layer and registered as the **`industries`** Eleventy
collection.

| Export | Collection id |
| --- | --- |
| `industriesQuery` | `industries` |
- Projection: [[conceptProjection]]

> [!note] SKOS taxonomy concept
> Built via the `makeSkosConceptQuery` factory in [[skos-concept]] — a shared shape for taxonomy concepts.

## Source

- Path: `data/sanity/queries/industry/industries.js`

Related: [[README.queries]], [[queries]]
