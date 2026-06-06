---
title: "Landing"
template: "[[landing.njk]]"
templatePath: "views/layouts/landing.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "layout"
atomicLevel: "template"
status: "active"
tags:
  - "#frontend/eleventy"
  - "#frontend/nunjucks"
  - "#frontend/eleventy/template"
  - "#tooling/Obsidian"
  - "#design/atomic-design"
links:
  - "[base](../../layouts/base.md)"
  - "[landing-header](../../organisms/header/landing/landing-header.md)"
---
# Landing

Provides a reusable page shell used by other templates via `{% extends %}`.

## Template

- Source: [[landing.njk]]
- Path: `views/layouts/landing.njk`

## Purpose

Defines the structural shell (head/body wrappers, slots) inherited by pages.

## Role in the System

Classified as a **layout** at the atomic **none** level based on its location under `views/`.

## Data and Context

- `Hanko` — referenced in the template.
- `body` — referenced in the template.
- `content` — referenced in the template.
- `title` — referenced in the template.

## Relationships

- Extends:
  - [[base.njk]]
- Imports:
  - [[hanko.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
