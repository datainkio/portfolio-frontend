---
title: "Link"
template: "[[link.njk]]"
templatePath: "views/atoms/link/link.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "atom"
status: "active"
tags:
  - "#frontend/eleventy"
  - "#frontend/nunjucks"
  - "#frontend/eleventy/template"
  - "#tooling/Obsidian"
  - "#frontend/eleventy/component"
  - "#design/atomic-design/atom"
  - "#design/atomic-design"
links:
  - "[external-link](atoms/icon/external-link.njk)"
---
# Link

Reusable presentational component.

## Template

- Source: [[link.njk]]
- Path: `views/atoms/link/link.njk`

## Purpose

Encapsulates a reusable atom per the project's atomic design conventions.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Data and Context

- `ariaLabel` — referenced in the template.
- `class` — referenced in the template.
- `title` — referenced in the template.

## Relationships

- Includes:
  - [[external-link.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
