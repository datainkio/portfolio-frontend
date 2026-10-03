---
description: "Defines Nunjucks macro: render."
type: template
---

# Icon

Defines Nunjucks macro: `render`.

## Template

- Source: [[icon.njk]]
- Path: `views/atoms/icon.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Data and Context

- `params.name` — key in the `svg` or `unicode` registry. Includes `chevron-left`/`chevron-right` and `grid` (Material "grid_view", added 2026-10-02 for the pager's "All" link).
- `params.size` — `xs`…`2xl` (sets `w-*`/`h-*`). Use this for size rather than passing `w-*`/`h-*` in classes: both would set the same properties, and the winner would depend on CSS order.
- `params.classes` — string, variant map, or array (applied through `| classes`). The legacy `className`/`class` are used only when `classes` is absent.

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
