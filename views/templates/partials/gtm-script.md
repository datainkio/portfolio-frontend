---
title: "Gtm Script"
template: "[[gtm-script.njk]]"
templatePath: "views/templates/partials/gtm-script.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "partial"
atomicLevel: "template"
status: "active"
tags:
  - "#eleventy"
  - "#nunjucks"
  - "#template"
  - "#obsidian"
  - "#partial"
  - "#atomic-design"
---
# Gtm Script

Reusable partial included by layouts or pages.

## Template

- Source: [[gtm-script.njk]]
- Path: `views/templates/partials/gtm-script.njk`

## Purpose

Provides a focused fragment intended to be included by larger templates.

## Role in the System

Classified as a **partial** at the atomic **template** level based on its location under `views/`.

## Data and Context

- `site` — referenced in the template.

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
