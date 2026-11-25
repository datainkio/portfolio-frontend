---
description: GROQ query definition registered as an Eleventy collection (Documentation landing singleton).
status: stable
tags:
  - cms
  - queries
aliases:
  - Documentation landing query
links:
  - "[[data/sanity/queries/README|queries]]"
  - "[[documentationLandingProjection]]"
---

# Documentation landing query

GROQ query definition fetched by the service layer and registered as the
**`documentationLanding`** Eleventy collection: the singleton behind the `/documentation/` landing
page. The Sanity document type is `documentation_landing`; the collection id is camelCase to match
the other landing singletons. Empty until that document exists in Sanity.

| Export                      | Collection id          |
| --------------------------- | ---------------------- |
| `documentationLandingQuery` | `documentationLanding` |

- Projection: [[documentationLandingProjection]]
- Transform: `normalizePostsLandingRecords` in [[post]], which adds `pageBodyHtml`

## Source

- Path: `data/sanity/queries/documentation/documentation-landing.js`

Related: [[data/sanity/queries/README|queries]], [[queries]]
