---
title: "Activities"
template: "[[activities.njk]]"
templatePath: "views/molecules/list/activities.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "molecule"
status: "active"
tags:
  - "#eleventy"
  - "#nunjucks"
  - "#template"
  - "#obsidian"
  - "#component"
  - "#molecule"
  - "#atomic-design"
---
# Activities

Reusable presentational component.

## Template

- Source: [[activities.njk]]
- Path: `views/molecules/list/activities.njk`

## Purpose

Encapsulates a reusable molecule per the project's atomic design conventions.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

- `activity` — referenced in the template.

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
