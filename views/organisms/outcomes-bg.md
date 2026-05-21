---
title: "Outcomes Bg"
template: "[[outcomes-bg.njk]]"
templatePath: "views/organisms/outcomes-bg.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "organism"
status: "active"
tags:
  - eleventy
  - nunjucks
  - template
  - obsidian
  - component
  - organism
---
# Outcomes Bg

Reusable presentational component.

## Template

- Source: [[outcomes-bg.njk]]
- Path: `views/organisms/outcomes-bg.njk`

## Purpose

Encapsulates a reusable organism per the project's atomic design conventions.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Data and Context

- `stat` — referenced in the template.

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
