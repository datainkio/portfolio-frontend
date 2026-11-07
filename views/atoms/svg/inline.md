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

| Param                 | Type                           | Description                                                                                                                                                                   |
| --------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `svg`                 | string                         | Inline SVG markup (or a URL, used as the image source when it isn't SVG).                                                                                                     |
| `src`                 | string                         | Image URL fallback.                                                                                                                                                           |
| `alt`                 | string                         | Accessible name; defaults to `"Award logo"`.                                                                                                                                  |
| `classes`             | string \| variant map \| array | String, variant map, or array; applied through `\| classes` to the `<svg>` or `<img>`.                                                                                        |
| `svgClasses`          | string                         | Extra classes for the `<svg>` only.                                                                                                                                           |
| `preserveAspectRatio` | string                         | Value for the `<svg>`'s `preserveAspectRatio` when the markup has none; defaults to `"xMidYMin meet"` (top-aligned). Pass `"xMidYMid meet"` to center the artwork in its box. |

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
