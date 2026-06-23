---
id: frontend.cms.queries.roles
role: "GROQ query definition registered as an Eleventy collection (Roles)."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Roles query"
tags:
  - cms
  - queries
links:
  - "[[README.queries]]"
  - "[[conceptProjection]]"
  - "[[skos-concept]]"
---

# Roles query

GROQ query definition fetched by the service layer and registered as the **`roles`** Eleventy
collection.

| Export | Collection id |
| --- | --- |
| `rolesQuery` | `roles` |
- Projection: [[conceptProjection]]

> [!note] SKOS taxonomy concept
> Built via the `makeSkosConceptQuery` factory in [[skos-concept]] — a shared shape for taxonomy concepts.

## Source

- Path: `data/sanity/queries/role/roles.js`

Related: [[README.queries]], [[queries]]
