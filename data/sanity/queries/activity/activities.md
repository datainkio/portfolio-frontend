---
id: frontend.cms.queries.activities
role: "GROQ query definition registered as an Eleventy collection (Activities)."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Activities query"
tags:
  - cms
  - queries
links:
  - "[[README.queries]]"
  - "[[conceptProjection]]"
  - "[[skos-concept]]"
---

# Activities query

GROQ query definition fetched by the service layer and registered as the **`activities`** Eleventy
collection.

| Export | Collection id |
| --- | --- |
| `activitiesQuery` | `activities` |
- Projection: [[conceptProjection]]

> [!note] SKOS taxonomy concept
> Built via the `makeSkosConceptQuery` factory in [[skos-concept]] — a shared shape for taxonomy concepts.

## Source

- Path: `data/sanity/queries/activity/activities.js`

Related: [[README.queries]], [[queries]]
