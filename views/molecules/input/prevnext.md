---
title: "Prevnext"
template: "[[prevnext.njk]]"
templatePath: "views/molecules/input/prevnext.njk"
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
links:
  - "[icon](../../atoms/icon.md)"

---
# Prevnext

Reusable presentational component.

## Template

- Source: [[prevnext.njk]]
- Path: `views/molecules/input/prevnext.njk`

## Purpose

Encapsulates a reusable molecule per the project's atomic design conventions.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

- `direction` — referenced in the template.
- `org` — referenced in the template.
- `sibling` — referenced in the template.

## Relationships

- Includes:
  - [[icon.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
