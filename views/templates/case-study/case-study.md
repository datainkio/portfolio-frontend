---
title: "Case Study"
template: "[[case-study.njk]]"
templatePath: "views/layouts/case-study.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "layout"
atomicLevel: "none"
status: "active"
tags:
  - eleventy
  - nunjucks
  - template
  - obsidian
  - layout
---
# Case Study

Provides a reusable page shell used by other templates via `{% extends %}`.

## Template

- Source: [[case-study.njk]]
- Path: `views/layouts/case-study.njk`

## Purpose

Defines the structural shell (head/body wrappers, slots) inherited by pages.

## Role in the System

Classified as a **layout** at the atomic **none** level based on its location under `views/`.

## Data and Context

- `activity` — referenced in the template.
- `award` — referenced in the template.
- `outcome` — referenced in the template.
- `project` — referenced in the template.
- `role` — referenced in the template.

## Relationships

- Extends:
  - [[base.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
