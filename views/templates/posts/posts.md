---
description: Renders the paginated posts inventory at /posts/.
type: template
links:
  - "[landing](../../layouts/landing.md)"
  - "[post-summary](../../molecules/post-summary/post-summary.md)"
  - "[pager](../../molecules/navigation/pager.md)"
---

# Posts

Renders a top-level Eleventy page: the posts inventory.

## Template

- Source: [[posts.njk]]
- Path: `views/templates/posts/posts.njk`

## Purpose

Extends the landing template with a list of post summaries and a pager. The landing header supplies the title and intro copy.

## Role in the System

Classified as a **page type** at the atomic **template** level based on its location under `views/`.

## Data and Context

- `postsPage` — the current page's slice of `collections.posts` (10 per page). Paginated by `ia/posts.md`.
- `pagination` — Eleventy's pagination object. `pagination.href.previous` / `.next` feed the pager; it renders only when there is more than one page.
- `title`, `abstract` — from `ia/posts.md`, computed from the `postsLanding` singleton (`cms.postsLanding[0]`), with "Posts" as the fallback title.

Page 1 is `/posts/`; later pages are `/posts/page/2/`, `/posts/page/3/` and so on.

## Relationships

- Extends:
  - [[landing.njk]]
- Imports:
  - [[post-summary.njk]]
  - [[pager.njk]]

## Notes for Future Maintenance

- The pager's `previous` is the newer page and `next` the older one, because the query orders newest first.
- Keep this sidecar in sync when the template signature changes.
