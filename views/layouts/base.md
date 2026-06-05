---
title: "Base"
template: "[[base.njk]]"
templatePath: "views/layouts/base.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "layout"
atomicLevel: "none"
status: "active"
tags:
  - "#frontend/eleventy"
  - "#frontend/nunjucks"
  - "#frontend/eleventy/template"
  - "#tooling/Obsidian"
  - "#design/atomic-design/layout"
links:
  - "[global-header](../organisms/header/global-header.md)"
  - "[global-footer](../organisms/footer/global-footer.md)"
  - "[skip-links-nav](organisms/navigation/skip-links-nav.njk)"
  - "[head](../templates/partials/head.md)"
  - "[gtm-noscript](../templates/partials/gtm-noscript.md)"
---
# Base

Provides a reusable page shell used by other templates via `{% extends %}`.

## Template

- Source: [[base.njk]]
- Path: `views/layouts/base.njk`

## Purpose

Defines the structural shell (head/body wrappers, slots) inherited by pages.

## Role in the System

Classified as a **layout** at the atomic **none** level based on its location under `views/`.

## Data and Context

- `breadcrumbs` — referenced in the template.
- `content` — referenced in the template.
- `footer` — referenced in the template.
- `header` — referenced in the template.
- `skip_links` — referenced in the template.

## Relationships

- Includes:
  - [[head.njk]]
  - [[gtm-noscript.njk]]
- Imports:
  - [[global-header.njk]]
  - [[global-footer.njk]]
  - [[skip-links-nav.njk]]
  - [[breadcrumbs-nav.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
