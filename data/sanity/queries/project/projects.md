---
description: GROQ query definition registered as an Eleventy collection (Projects).
status: stable
tags:
  - cms
  - queries
aliases:
  - Projects query
links:
  - "[[data/sanity/queries/README|queries]]"
  - "[[projectCardProjection]]"
---

# Projects query

GROQ query definition fetched by the service layer and registered as the **`projects`** Eleventy
collection.

| Export          | Collection id |
| --------------- | ------------- |
| `projectsQuery` | `projects`    |

- Projection: [[projectCardProjection]]
- Filter: only projects with an `industry` reference. A project without one is left out of every
  listing built from this collection (the homepage Work section, `/work/`, the site map's industry
  links). Its detail page still builds, from the project-pages query.

## Source

- Path: `data/sanity/queries/project/projects.js`

Related: [[data/sanity/queries/README|queries]], [[queries]]
