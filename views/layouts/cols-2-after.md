---
title: "Cols 2 After"
template: "[[cols-2-after.njk]]"
templatePath: "views/layouts/cols-2-after.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "layout"
atomicLevel: "none"
status: "active"
tags:
  - "#frontend/eleventy"
  - "#frontend/nunjucks"
  - "#frontend/eleventy/template"
  - "#tooling/Obsidian"
  - "#design/atomic-design/layout"
links:
  - "[base](base.md)"
  - "[docs-nav](../organisms/navigation/docs-nav.md)"
---
# Cols 2 After

Provides a reusable page shell used by other templates via `{% extends %}`.

## Template

- Source: [[cols-2-after.njk]]
- Path: `views/layouts/cols-2-after.njk`

## Purpose

Defines the structural shell (head/body wrappers, slots) inherited by pages.

## Role in the System

Classified as a **layout** at the atomic **none** level based on its location under `views/`.

## Data and Context

- `content` — referenced in the template.
- `sidebar_after` — referenced in the template.

## Relationships

- Extends:
  - [[base.njk]]
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
