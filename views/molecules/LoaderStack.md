---
title: "Loader Stack"
template: "[[LoaderStack.njk]]"
templatePath: "views/molecules/LoaderStack.njk"
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
  - "[LoaderMark](../atoms/loader/LoaderMark.md)"
  - "[LoaderIndicator](../atoms/loader/LoaderIndicator.md)"
  - "[LoaderText](../atoms/loader/LoaderText.md)"

---
# Loader Stack

Defines Nunjucks macro: `render`.

## Template

- Source: [[LoaderStack.njk]]
- Path: `views/molecules/LoaderStack.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

- `Indicator` — referenced in the template.
- `LoaderText` — referenced in the template.
- `Mark` — referenced in the template.

## Relationships

- Imports:
  - [[LoaderMark.njk]]
  - [[LoaderIndicator.njk]]
  - [[LoaderText.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
