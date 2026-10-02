---
description: "Defines Nunjucks macro: render."
type: template
---

# Inline

Defines Nunjucks macro: `render`.

## Template

- Source: [[inline.njk]]
- Path: `views/atoms/svg/inline.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Data and Context

- `params.svg` — inline SVG markup (or a URL, used as the image source when it isn't SVG).
- `params.src` — image URL fallback.
- `params.alt` — accessible name; defaults to `"Award logo"`.
- `params.classes` — string, variant map, or array; applied through `| classes` to the `<svg>` or `<img>`.
- `params.svgClasses` — extra classes for the `<svg>` only.

Reads nothing from ambient scope (the old `organizationRecord` fallback is removed).

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
