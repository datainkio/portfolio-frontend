---
description: Renders a single post page at /posts/<slug>/.
type: template
links:
  - "[base](../../layouts/base.md)"
  - "[stats](../../molecules/stats/stats.md)"
  - "[pager](../../molecules/navigation/pager.md)"
  - "[link](../../atoms/link/link.md)"
---

# Post

Renders one post: header with details, featured image, body, files and related content, then a pager.

## Template

- Source: [[post.njk]]
- Path: `views/pages/post/post.njk`

## Purpose

Presents a `post` document per its contract, [`content-model/documents/writing/post.md`](../../../../content-model/documents/writing/post.md). Each part renders only when its data exists, so an imported post with just a title still renders.

## Role in the System

Classified as a **page** at the atomic **page** level based on its location under `views/`.

## Data and Context

- `post` — one record from `collections.postPages`, paginated at size 1 by `ia/post.md`. Shaped by `POST_PAGE_PROJECTION` and `normalizePostPageRecords`.
- Fields used: `title`, `abstract`, `author`, `publishDate`, `updateDate`, `readingMinutes`, `topics`, `featuredImage`, `bodyHtml`, `attachments`, `relatedProjects`, `relatedPosts`.
- `pagination` — feeds the pager: newer post on the left, older on the right, no wrap-around.
- `postIndex` — from `ia/post.md`; target of the pager's "All" link.

The details block reuses the `stats` molecule, which skips empty values, so "Updated" appears only when `updateDate` is set.

## Accessibility

- One `<h1>`; the Files and Related sections are `<section aria-labelledby>` with `<h2>`.
- Body headings come from the Portable Text serializer's default styles. An `h1` in a body would duplicate the page heading; editors should start at `h2`.
- The featured image's `alt` comes from the image asset. An empty `alt` marks it decorative.

## Relationships

- Extends:
  - [[base.njk]]
- Imports:
  - [[stats.njk]]
  - [[pager.njk]]
  - [[link.njk]]

## Notes for Future Maintenance

- Keep this sidecar in sync when the template signature changes.
- Article structured data (`Article` JSON-LD) is not emitted yet. The contract says `author` drives it.
