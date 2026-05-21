---
title: "Site Preloader"
template: "[[SitePreloader.njk]]"
templatePath: "views/organisms/SitePreloader.njk"
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
# Site Preloader

Defines Nunjucks macro: `render`.

## Template

- Source: [[SitePreloader.njk]]
- Path: `views/organisms/SitePreloader.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Data and Context

- `LoaderStack` — referenced in the template.
- `Preloader` — referenced in the template.
- `params` — referenced in the template.

## Relationships

- Imports:
  - [[LoaderStack.njk]]
  - [[SitePreloader.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
