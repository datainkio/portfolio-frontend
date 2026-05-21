---
title: "Registry"
template: "[[_registry.njk]]"
templatePath: "views/_registry.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "macro"
atomicLevel: "unknown"
status: "active"
tags:
  - eleventy
  - nunjucks
  - template
  - obsidian
  - macro
---
# Registry

Defines Nunjucks macros: `component`, `icon`, `button`, `listComponents`, `validateComponent`, `designToken`.

## Template

- Source: `_registry.njk`
- Path: `views/_registry.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **macro** based on its location under `views/`.

## Data and Context

- `category` — referenced in the template.
- `fallback` — referenced in the template.
- `name` — referenced in the template.
- `note` — referenced in the template.
- `prop` — referenced in the template.

## Relationships

- Includes:
  - [[{{ name }}.njk]]
  - [[icon.njk]]
  - [[button.njk]]
- Imports:
  - [[_registry.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
