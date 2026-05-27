---
title: "Field"
template: "[[field.njk]]"
templatePath: "views/atoms/field.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "atom"
status: "active"
tags:
  - "#eleventy"
  - "#nunjucks"
  - "#template"
  - "#obsidian"
  - "#component"
  - "#atom"
  - "#atomic-design"
---
# Field

Reusable presentational component.

## Template

- Source: [[field.njk]]
- Path: `views/atoms/field.njk`

## Purpose

Encapsulates a reusable atom per the project's atomic design conventions.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Data and Context

- `field` — referenced in the template.
- `key` — referenced in the template.
- `val` — referenced in the template.
- `value` — referenced in the template.

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
