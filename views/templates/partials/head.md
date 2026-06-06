---
title: "Head"
template: "[[head.njk]]"
templatePath: "views/templates/partials/head.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "partial"
atomicLevel: "template"
status: "active"
tags:
  - "#frontend/eleventy"
  - "#frontend/nunjucks"
  - "#frontend/eleventy/template"
  - "#tooling/Obsidian"
  - "#frontend/nunjucks/partial"
  - "#design/atomic-design"
links:
  - "[gtm-script](gtm-script.md)"
  - "[fonts](fonts.md)"
---
# Head

Reusable partial included by layouts or pages.

## Template

- Source: [[head.njk]]
- Path: `views/templates/partials/head.njk`

## Purpose

Provides a focused fragment intended to be included by larger templates.

## Role in the System

Classified as a **partial** at the atomic **template** level based on its location under `views/`.

## Data and Context

- `author` — referenced in the template.
- `canonicalUrl` — referenced in the template.
- `icon` — referenced in the template.
- `metaDescription` — referenced in the template.
- `metaKeywords` — referenced in the template.
- `ogDescription` — referenced in the template.
- `ogImage` — referenced in the template.
- `ogTitle` — referenced in the template.
- `ogUrl` — referenced in the template.
- `scripts` — referenced in the template.
- `site` — referenced in the template.
- `title` — referenced in the template.

## Relationships

- Includes:
  - [[gtm-script.njk]]
  - [[fonts.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
