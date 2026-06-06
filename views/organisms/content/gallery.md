---
title: "Gallery"
template: "[[gallery.njk]]"
templatePath: "views/organisms/content/gallery.njk"
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
---
# Gallery

Reusable presentational component.

## Template

- Source: [[gallery.njk]]
- Path: `views/organisms/content/gallery.njk`

## Purpose

Encapsulates a reusable organism per the project's atomic design conventions.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Data and Context

- `gallery` — referenced in the template.
- `galleryNavStyles` — referenced in the template.
- `galleryStyles` — referenced in the template.
- `i` — referenced in the template.

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
