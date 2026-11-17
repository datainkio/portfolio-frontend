---
description: GROQ query definition registered as an Eleventy collection (Posts landing singleton).
status: stable
tags:
  - cms
  - queries
aliases:
  - Posts landing query
links:
  - "[[data/sanity/queries/README|queries]]"
  - "[[postsLandingProjection]]"
---

# Posts landing query

GROQ query definition fetched by the service layer and registered as the **`postsLanding`**
Eleventy collection: the singleton behind the `/posts/` inventory page. Empty until the
`postsLanding` document exists in Sanity; the page then falls back to the title "Posts".

| Export               | Collection id  |
| -------------------- | -------------- |
| `postsLandingQuery`  | `postsLanding` |

- Projection: [[postsLandingProjection]]
- Transform: `normalizePostsLandingRecords` in [[post]]

## Source

- Path: `data/sanity/queries/post/posts-landing.js`

Related: [[data/sanity/queries/README|queries]], [[queries]]
