---
title: "Tree Nav"
template: "[[tree-nav.njk]]"
templatePath: "views/organisms/navigation/tree-nav.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "organism"
status: "active"
tags:
  - "#eleventy"
  - "#nunjucks"
  - "#template"
  - "#obsidian"
  - "#component"
  - "#organism"
  - "#atomic-design"
links:
  - "[nav-link](../../atoms/link/nav-link.md)"

---
# Tree Nav

Defines Nunjucks macros: `render`, `renderItems`.

## Template

- Source: [[tree-nav.njk]]
- Path: `views/organisms/navigation/tree-nav.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Data and Context

- `navLink` — referenced in the template.

## Relationships

- Imports:
  - [[nav-link.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
