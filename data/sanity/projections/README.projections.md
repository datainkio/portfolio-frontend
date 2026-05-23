---
title: "Sanity Projections"
description: "Reference guide for GROQ projection files: when to extract, anatomy, composition, and directory conventions."
docType: "reference"
status: "active"
owner: "frontend"
tags:
  - sanity
  - groq
  - projections
  - data-layer
  - reference
  - aix
permalink: false
aliases:
  - "Projections Reference"
  - "GROQ Projections"
aix:
  intent: "reference"
  audience:
    - frontend
  canonical: true
---

<!-- @format -->

# Sanity Projections

Projection files define the **inner shape** of a GROQ query — the `{ ... }` block that follows the document filter and traversal operator (`->`). They are extracted into standalone files so queries stay thin and shapes are reusable.

## Rule: when to extract a projection

| Condition                                                                          | Action                        |
| ---------------------------------------------------------------------------------- | ----------------------------- |
| Projection is used in more than one query                                          | Always extract                |
| Projection is used in only one query but is non-trivial (>5 fields, nested derefs) | Extract                       |
| Projection is a single flat inline block                                           | Inline in query is acceptable |

## Anatomy

```js
/** @format */
import groq from "groq";

/**
 * [DocumentType] projection (inner shape — excludes field name and traversal operator).
 * [One-line description of where it is used.]
 */
export const SCREAMING_SNAKE_PROJECTION = groq`{
  _id,
  _updatedAt,
  fieldName,
  "alias": someField->{subField},
}`;
```

- Export name: `SCREAMING_SNAKE_CASE` constant, ending in `_PROJECTION`.
- JSDoc: state that it is the inner shape and excludes the traversal operator — callers append it directly after `->` or after the filter slice.
- Asset derefs: always use the explicit alias form `"asset": asset->{ url }` (not bare `url`).
- Computed fields: use quoted alias keys — `"slug": page.slug.current`.

## Composing projections

Projections can import and embed other projections. Use template-literal interpolation:

```js
import { ROLE_PROJECTION } from "../role/roleProjection.js";

export const PROJECT_CARD_PROJECTION = groq`{
  "roles": roles[]->${ROLE_PROJECTION},
}`;
```

## Directory conventions

One subdirectory per document/concept type, named in camelCase matching the Sanity `_type`. Each file is named `<TypeName>Projection.js` (PascalCase type, camelCase suffix).

```
projections/
  project/
    projectCardProjection.js       → PROJECT_CARD_PROJECTION
    projectPageProjection.js       → PROJECT_PAGE_PROJECTION
    projectsLandingProjection.js   → PROJECTS_LANDING_PROJECTION
  userGuide/
    userGuideProjection.js         → USER_GUIDE_PROJECTION
  organization/
    organizationProjection.js      → ORGANIZATION_PROJECTION
  role/
    roleProjection.js              → ROLE_PROJECTION
  ...
```

## Current projections index

| Export constant               | File                                   | Used by query                                                          |
| ----------------------------- | -------------------------------------- | ---------------------------------------------------------------------- |
| `PROJECT_CARD_PROJECTION`     | `project/projectCardProjection.js`     | `projects.js`, `projects-by-industry.js`, `home.js` (featuredProjects) |
| `PROJECT_PAGE_PROJECTION`     | `project/projectPageProjection.js`     | `project/project-pages.js`                                             |
| `PROJECTS_LANDING_PROJECTION` | `project/projectsLandingProjection.js` | `project/projects-landing.js`                                          |
| `USER_GUIDE_PROJECTION`       | `userGuide/userGuideProjection.js`     | `user-guide.js`                                                        |

> Keep this table up to date when adding projections.
