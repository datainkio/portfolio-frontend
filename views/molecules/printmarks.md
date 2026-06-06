---
title: "Printmarks"
template: "[[printmarks.njk]]"
templatePath: "views/molecules/printmarks.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "molecule"
status: "active"
tags:
  - "#frontend/eleventy"
  - "#frontend/nunjucks"
  - "#frontend/eleventy/template"
  - "#tooling/Obsidian"
  - "#frontend/eleventy/component"
  - "#design/atomic-design/molecule"
  - "#design/atomic-design"
links:
  - "[ink-marks](../atoms/printmarks/ink-marks.md)"
  - "[trim-marks](../atoms/printmarks/trim-marks.md)"
  - "[margin-bleed-marks](../atoms/printmarks/margin-bleed-marks.md)"
  - "[registration-marks](../atoms/printmarks/registration-marks.md)"
---
# Printmarks

Defines Nunjucks macro: `render`.

## Template

- Source: [[printmarks.njk]]
- Path: `views/molecules/printmarks.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

- `InkMarks` — referenced in the template.
- `MarginBleedMarks` — referenced in the template.
- `RegistrationMarks` — referenced in the template.
- `TrimMarks` — referenced in the template.

## Relationships

- Imports:
  - [[ink-marks.njk]]
  - [[trim-marks.njk]]
  - [[margin-bleed-marks.njk]]
  - [[registration-marks.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
