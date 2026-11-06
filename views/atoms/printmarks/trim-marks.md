---
description: "Defines Nunjucks macro: render."
type: template
---

# Trim Marks

Defines Nunjucks macro: `render`.

## Template

- Source: [[trim-marks.njk]]
- Path: `views/atoms/printmarks/trim-marks.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Params

| Param     | Type   | Description                                                                              |
| --------- | ------ | ---------------------------------------------------------------------------------------- |
| `classes` | string | Appended as-is to the root `<div>`. No `classes` filter.                                 |
| `inset`   | string | Inset suffix (`inset-{inset}`). Defaults to `10`.                                        |
| `size`    | string | Corner size suffix (`size-{size}`). Defaults to `6`.                                     |
| `weight`  | string | Border width suffix for the corner edges (`border-{t,r,b,l}-{weight}`). Defaults to `1`. |
| `color`   | string | Border colour suffix (`border-{color}`). Defaults to `black`.                            |

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
