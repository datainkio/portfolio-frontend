---
id: frontend.cms.queries.projects
role: "GROQ query definition registered as an Eleventy collection (Projects)."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Projects query"
tags:
  - "#frontend/cms"
  - "#frontend/cms/queries"
links:
  - "[[README.queries]]"
  - "[[projectCardProjection]]"
---

# Projects query

GROQ query definition fetched by the service layer and registered as the **`projects`** Eleventy
collection.

| Export | Collection id |
| --- | --- |
| `projectsQuery` | `projects` |
- Projection: [[projectCardProjection]]

## Source

- Path: `data/sanity/queries/project/projects.js`

Related: [[README.queries]], [[queries]]
