---
description: Normalize post records: clean slugs, add URLs, serialize the body, shape the posts landing page.
status: stable
tags:
  - cms
  - transforms
aliases:
  - Post transforms
links:
  - "[[data/sanity/transforms/README|transforms]]"
---

# Post transforms

Pure, stateless normalization between raw Sanity results and Eleventy collections — the semantic
work GROQ can't do (URL resolution, Portable Text → HTML, safe defaults).

| Export                               | Purpose                                                              |
| ------------------------------------ | -------------------------------------------------------------------- |
| `cleanPostSlug(slug)`                | strip the legacy `/feed/` prefix and stray slashes                   |
| `addPostUrls(records)`               | clean `slug` and add `url` (`/posts/<slug>/`) to inventory records   |
| `normalizePostPageRecords(records)`  | URLs, `bodyHtml`, and URLs on `relatedPosts` / `relatedProjects`     |
| `normalizePostsLandingRecords(records)` | add `pageBodyHtml` to the landing singleton                       |

`cleanPostSlug` is also used by `navigation.js`, so a nav reference to a post resolves to the same URL.

## Source

- Path: `data/sanity/transforms/post.js`

Related: [[data/sanity/transforms/README|transforms]]
