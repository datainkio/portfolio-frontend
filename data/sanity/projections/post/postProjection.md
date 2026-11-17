---
description: "GROQ projection fragments — reusable field shapes for post documents (reference, card, page)."
status: stable
tags:
  - cms
  - projections
aliases:
  - Post projections
links:
  - "[[data/sanity/projections/README|projections]]"
---

# Post projections

GROQ projection fragments — the reusable `{ ... }` field shapes selected for **post**
documents. Extracted into their own file so queries stay thin and shapes compose consistently.

| Export                 | Shape of                                                                   |
| ---------------------- | -------------------------------------------------------------------------- |
| `POST_REF_PROJECTION`  | post reference fields (`relatedPosts[]`)                                   |
| `POST_CARD_PROJECTION` | inventory list entry: title, slug, abstract, date, author, reading time, image |
| `POST_PAGE_PROJECTION` | detail page: the card fields plus body, files, topics, relations, SEO      |

Reading time is derived from `body` (`readingMinutes`, about 200 words per minute); it is not a
stored field. `topics` merges activity, role and industry labels into one list.

## Source

- Path: `data/sanity/projections/post/postProjection.js`
- Contract: `content-model/documents/writing/post.md`

Related: [[data/sanity/projections/README|projections]]
