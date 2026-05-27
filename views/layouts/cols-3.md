---
title: "Cols 3"
template: "[[cols-3.njk]]"
templatePath: "views/layouts/cols-3.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "layout"
atomicLevel: "none"
status: "active"
tags:
  - "#eleventy"
  - "#nunjucks"
  - "#template"
  - "#obsidian"
  - "#layout"
links:
  - "[cols-2-before](cols-2-before.md)"
  - "[docs-nav](../organisms/navigation/docs-nav.md)"

---
# Cols 3

Provides a reusable page shell used by other templates via `{% extends %}`.

## Template

- Source: [[cols-3.njk]]
- Path: `views/layouts/cols-3.njk`

## Purpose

Defines the structural shell (head/body wrappers, slots) inherited by pages.

## Role in the System

Classified as a **layout** at the atomic **none** level based on its location under `views/`.

## Data and Context

- `content` — referenced in the template.
- `sidebar_after` — referenced in the template.

## Relationships

- Extends:
  - [[cols-2-before.njk]]
- Imports:
  - [[docs-nav.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
