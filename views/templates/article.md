---
description: "Standalone article page template, extending the base layout."
type: template
links:
  - "[base](../layouts/base.md)"
  - "[article-header](../organisms/header/article/article-header.md)"
  - "[article-nav-links](../molecules/navigation/article-nav-links.md)"
---

# Article

Standalone article page template, extending the base layout.

## Template

- Source: [[article.njk]]
- Path: `views/templates/article.njk`

## Purpose

Composes an article page: header, sticky on-page nav (jumplinks), and body content, and wires the client-side toggle script for the nav on mobile.

## Role in the System

Classified as a **page composition** at the atomic **template** level based on its location under `views/`.

## Data and Context

- `title` — article title, defaults to `"Untitled"`.
- `brandLogoSvg` — logo passed to the article header.
- `body` — article HTML content; also piped through the `extractHeadings` filter to build the nav.

## Relationships

- Extends:
  - [[base.njk|layouts/base.njk]]
- Imports:
  - [[article-header.njk|organisms/header/article/article-header.njk]]
  - [[article-nav-links.njk|molecules/navigation/article-nav-links.njk]]
- Depends on `assets/js/choreography/molecules/article-nav-toggle.js` at runtime.

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
- Confirm this is the current pattern vs. [[blog.njk|templates/blog/blog.njk]] for article-shaped content — the two overlap in purpose.
