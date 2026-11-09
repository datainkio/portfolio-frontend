---
description: "Defines Nunjucks macro: render."
type: template
---

# Hanko

Defines Nunjucks macro: `render`.

## Template

- Source: [[hanko.njk]]
- Path: `views/atoms/hanko/hanko.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Params

| Param     | Type   | Description                                                                                                     |
| --------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| `svg`     | string | Inlined SVG markup, output with `safe`.                                                                         |
| `classes` | string | Applied as-is to the wrapper `<span>`. Defaults to `inline-block w-12 text-secondary-700`. No `classes` filter. |
| `attrs`   | string | Raw attributes added to the wrapper `<span>`. Defaults to empty.                                                |

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
