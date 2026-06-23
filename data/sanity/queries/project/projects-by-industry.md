---
id: frontend.cms.queries.projects_by_industry
role: "GROQ query definition registered as an Eleventy collection (Projects by industry)."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Projects by industry query"
tags:
  - cms
  - queries
links:
  - "[[README.queries]]"
  - "[[projectCardProjection]]"
---

# Projects by industry query

GROQ query definition fetched by the service layer and registered as the **`projectsByIndustry`** Eleventy
collection.

| Export | Collection id |
| --- | --- |
| `projectsByIndustryQuery` | `projectsByIndustry` |
- Projection: [[projectCardProjection]]

## Source

- Path: `data/sanity/queries/project/projects-by-industry.js`

Related: [[README.queries]], [[queries]]
