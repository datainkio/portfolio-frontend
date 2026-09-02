---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[icon](../../atoms/icon.md)"
---

# Article Nav Links

Defines Nunjucks macro: `render`.

## Template

- Source: [[article-nav-links.njk]]
- Path: `views/molecules/navigation/article-nav-links.njk`

## Purpose

Renders an on-page jumplink nav from a list of headings, with a mobile-collapsed/desktop-open toggle.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

- `params.headings` — required array of `{id, text}` objects from the `extractHeadings` filter.
- `params.classes` — optional extra CSS classes on the `<nav>`.

## Relationships

- Imports:
  - [[icon.njk|atoms/icon.njk]]
- Wired by `assets/js/choreography/molecules/article-nav-toggle.js` (`createArticleNavToggle`) for the mobile toggle behavior.
- Likely used by:
  - [[article.njk|templates/article.njk]]

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.
- In-template comment header still labels this "Molecule: Jumplinks" from before it was renamed — reconcile if touching the file.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
