---
title: "Ink Marks"
template: "[[ink-marks.njk]]"
templatePath: "views/atoms/printmarks/ink-marks.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "atom"
status: "active"
tags:
  - eleventy
  - nunjucks
  - template
  - obsidian
  - component
  - atom
---
# Ink Marks

Defines Nunjucks macro: `render`.

## Template

- Source: [[ink-marks.njk]]
- Path: `views/atoms/printmarks/ink-marks.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Data and Context

- `Colors` — referenced in the template.
- `Neutrals` — referenced in the template.
- `params` — referenced in the template.

## Relationships

- Imports:
  - [[neutrals.njk]]
  - [[colors.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
