---
description: "Defines Nunjucks macro: render."
type: template
---

# Margin Bleed Marks

Defines Nunjucks macro: `render`.

## Template

- Source: [[margin-bleed-marks.njk]]
- Path: `views/atoms/printmarks/margin-bleed-marks.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Params

| Param         | Type   | Description                                                                    |
| ------------- | ------ | ------------------------------------------------------------------------------ |
| `color`       | string | Colour suffix for the border (`border-{color}`). Defaults to `white`.          |
| `size`        | string | Border width suffix (`border-{size}`). Defaults to `1`.                        |
| `style`       | string | Border style suffix (`border-{style}`) on the outer box. Defaults to `dashed`. |
| `bleedInset`  | string | Inset suffix for the outer box (`inset-{bleedInset}`). Defaults to `8`.        |
| `marginInset` | string | Inset suffix for the inner box (`inset-{marginInset}`). Defaults to `6`.       |

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
