---
description: Build sitePage URLs from the parent chain and shape records for the site-page route.
status: stable
tags:
  - cms
  - transforms
aliases:
  - Site page transforms
links:
  - "[[data/sanity/transforms/README|transforms]]"
---

# Site page transforms

| Export                              | Purpose                                                                                                                                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `resolveSitePageUrl(page, byId)`    | walk `parent` through `byId` (Map of `_id` to record); `/docs/` root for `documentation_landing`, `/` for none; `""` on a cycle, a missing parent or a missing slug                        |
| `normalizeSitePageRecords(records)` | add `url`, `bodyHtml`, `navTitle`, `navParent`, `trail`; drop records with no URL and top-level docs pages reusing a static folder slug (`design`, `ia`, `content-strategy`), logging each |

`navParent` is `"Docs"` under the documentation landing, the parent's `url` under another page, else
`undefined`. `trail` is `{ url, title }[]` from the root down to the page; under Docs the first item is
`/docs/`.

## Source

- Path: `data/sanity/transforms/sitePage.js`
- Contract: `content-model/documents/pages/sitePage.md`

Related: [[data/sanity/transforms/README|transforms]]
