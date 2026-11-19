---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[ink-marks](../atoms/printmarks/ink-marks.md)"
  - "[trim-marks](../atoms/printmarks/trim-marks.md)"
  - "[margin-bleed-marks](../atoms/printmarks/margin-bleed-marks.md)"
  - "[registration-marks](../atoms/printmarks/registration-marks.md)"
---

# Printmarks

Defines Nunjucks macro: `render`.

## Template

- Source: [[printmarks.njk]]
- Path: `views/molecules/printmarks.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Params

| Param         | Type   | Description                                                                                                                                                                                      |
| ------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `classes`     | string | Appended as-is to the root `<div>`. No `classes` filter.                                                                                                                                         |
| `marginBleed` | object | Passed to the margin bleed marks. Keys: `color`, `size`, `bleedInset`, `style`, `marginInset`. Defaults to `{ color: "white", size: "1", bleedInset: "12", style: "dashed", marginInset: "6" }`. |
| `trim`        | object | Passed to the trim marks. Keys: `color`, `size`, `inset`, `weight`. Defaults to `{ color: "white", size: "3", inset: "12", weight: "1" }`.                                                       |

## Relationships

- Imports:
  - [[ink-marks.njk]]
  - [[trim-marks.njk]]
  - [[margin-bleed-marks.njk]]
  - [[registration-marks.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
