---
title: "Hero"
template: "[[hero.njk]]"
templatePath: "views/organisms/section/hero.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "organism"
status: "active"
tags:
  - "#frontend/eleventy"
  - "#frontend/nunjucks"
  - "#frontend/eleventy/template"
  - "#tooling/Obsidian"
  - "#frontend/eleventy/component"
  - "#design/atomic-design/organism"
  - "#design/atomic-design"
links:
  - "[hanko](../../atoms/hanko/hanko.md)"
---
# Hero

Defines Nunjucks macro: `render`.

## Template

- Source: [[hero.njk]]
- Path: `views/organisms/section/hero.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Data and Context

- `Hanko` — referenced in the template.

## Relationships

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
