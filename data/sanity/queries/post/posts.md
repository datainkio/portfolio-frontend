---
description: GROQ query definition registered as an Eleventy collection (Posts).
status: stable
tags:
  - cms
  - queries
aliases:
  - Posts query
links:
  - "[[data/sanity/queries/README|queries]]"
  - "[[postProjection]]"
---

# Posts query

GROQ query definition fetched by the service layer and registered as the **`posts`** Eleventy
collection: the card-shaped list behind the `/posts/` inventory, newest first. Publish state comes
from the client perspective, not a field. Posts without a slug are left out.

| Export       | Collection id |
| ------------ | ------------- |
| `postsQuery` | `posts`       |

- Projection: [[postProjection]] (`POST_CARD_PROJECTION`)
- Transform: `addPostUrls` in [[post]]
- Paginated at size 10 by `ia/posts.md`.

## Source

- Path: `data/sanity/queries/post/posts.js`

Related: [[data/sanity/queries/README|queries]], [[queries]]
