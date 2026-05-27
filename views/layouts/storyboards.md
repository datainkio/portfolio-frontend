---
title: "Storyboards"
template: "[[storyboards.njk]]"
templatePath: "views/layouts/storyboards.njk"
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
---
# Storyboards

Provides a reusable page shell used by other templates via `{% extends %}`.

## Template

- Source: [[storyboards.njk]]
- Path: `views/layouts/storyboards.njk`

## Purpose

Defines the structural shell (head/body wrappers, slots) inherited by pages.

## Role in the System

Classified as a **layout** at the atomic **none** level based on its location under `views/`.

## Data and Context

- `content` — referenced in the template.
- `page` — referenced in the template.
- `title` — referenced in the template.

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
