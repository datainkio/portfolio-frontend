---
title: "Sanity Queries"
description: "Reference guide for Sanity GROQ query files: query object shape, inline vs. referenced projection patterns, singleton vs. collection conventions, and directory layout."
docType: "reference"
status: "active"
owner: "frontend"
tags:
  - sanity
  - groq
  - queries
  - data-layer
  - reference
  - aix
permalink: false
aliases:
  - "Queries Reference"
  - "GROQ Queries"
aix:
  intent: "reference"
  audience:
    - frontend
  canonical: true
---

<!-- @format -->

# Sanity Queries

Query files assemble the full GROQ expression that fetches a collection or singleton. Each file exports a single query object consumed by the Eleventy collection layer.

## Query object shape

```js
export const myQuery = {
  id: "collectionId", // Eleventy collection key: collections.collectionId
  description: "...", // Human/agent-readable summary of what is fetched
  cacheDuration: "1d", // Defaults to SANITY_CACHE_DURATION env var, then "1d"
  query: groq`...`, // Full GROQ expression
};
```

## Two authoring patterns

### 1. Referenced projection (preferred for non-trivial shapes)

Import a named projection constant and interpolate it after the filter slice. The query file stays to one line.

```js
import { MY_PROJECTION } from "../../projections/myType/myTypeProjection.js";

export const myQuery = {
  query: groq`*[_type == "myType"]${MY_PROJECTION} | order(title asc)`,
};
```

Examples: `project/projects.js`, `project/project-pages.js`, `user-guide.js`.

### 2. Inline projection (singletons with mixed/unique fields)

Embed the projection directly when the shape is unique and reuse is unlikely. Still acceptable to leave inline; extract if it grows beyond ~10 fields or gains nested derefs.

```js
export const myQuery = {
  query: groq`*[_type == "mySingleton"][0...1]{
    _id,
    fieldA,
    fieldB,
  }`,
};
```

Example: `home.js` (mixes inline fields with an imported projection for `featuredProjects`).

## Singleton vs. collection queries

| Pattern    | Filter                 | Slice     | Sort                                 |
| ---------- | ---------------------- | --------- | ------------------------------------ |
| Singleton  | `*[_type == "myType"]` | `[0...1]` | optional `\| order(_updatedAt desc)` |
| Collection | `*[_type == "myType"]` | none      | `\| order(field asc)`                |

## Directory conventions

Flat files for singletons; a subdirectory for document types with multiple query variants.

```
queries/
  home.js                          → collections.home (singleton)
  user-guide.js                    → collections.userGuide (singleton)
  project/
    projects.js                    → collections.projects (card list)
    project-pages.js               → collections.projectPages (full detail)
    projects-landing.js            → collections.projectsLanding (singleton)
    projects-by-industry.js        → collections.projectsByIndustry (grouped)
  activity/
    activities.js                  → collections.activities
  ...
```

## Current query index

| Export                    | File                              | Collection key       | Projection source                  |
| ------------------------- | --------------------------------- | -------------------- | ---------------------------------- |
| `homeQuery`               | `home.js`                         | `home`               | inline + `PROJECT_CARD_PROJECTION` |
| `userGuideQuery`          | `user-guide.js`                   | `userGuide`          | `USER_GUIDE_PROJECTION`            |
| `projectsQuery`           | `project/projects.js`             | `projects`           | `PROJECT_CARD_PROJECTION`          |
| `projectPagesQuery`       | `project/project-pages.js`        | `projectPages`       | `PROJECT_PAGE_PROJECTION`          |
| `projectsLandingQuery`    | `project/projects-landing.js`     | `projectsLanding`    | `PROJECTS_LANDING_PROJECTION`      |
| `projectsByIndustryQuery` | `project/projects-by-industry.js` | `projectsByIndustry` | `PROJECT_CARD_PROJECTION`          |

> Keep this table up to date when adding queries.
