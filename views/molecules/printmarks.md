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

| Param          | Type    | Description                                                                                                                                                                                      |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `classes`      | string  | Appended as-is to the root `<div>`. No `classes` filter.                                                                                                                                         |
| `inset`        | string  | Inset suffix for the root (`inset-{inset}`): distance from the positioned parent's edges, in scaled units (see Scaling). Defaults to `24`.                                                       |
| `ink`          | boolean | `false` leaves out the ink marks. Defaults to shown.                                                                                                                                             |
| `registration` | boolean | `false` leaves out the registration marks. Defaults to shown.                                                                                                                                    |
| `marginBleed`  | object  | Passed to the margin bleed marks. Keys: `color`, `size`, `bleedInset`, `style`, `marginInset`. Defaults to `{ color: "white", size: "1", bleedInset: "12", style: "dashed", marginInset: "6" }`. |
| `trim`         | object  | Passed to the trim marks. Keys: `color`, `size`, `inset`, `weight`. Defaults to `{ color: "white", size: "3", inset: "12", weight: "1" }`.                                                       |

## Scaling (2026-11-24)

The marks scale with the element they sit on. The root `<div>` is `absolute inset-0` and a size container (`container-type: inline-size`). An inner `<div>` carries the `inset-{inset}` and the `printmarks-scale` utility from [decorations.css](../../styles/decorations.css), which redefines the spacing tokens up to 24 as multiples of `0.45cqi` (0.45% of the container's width). Every spacing-based class under it (`inset-*`, `size-*`, `h-*`, `gap-*`) therefore scales, including the ones the atoms build from their params. One unit equals the usual `0.25rem` step at a container about 890px wide. Border weights are not spacing tokens and stay in px. The parent must be positioned, as before. The inner `<div>` exists because an element's own container units resolve against an ancestor container, not itself.

## Relationships

- Imports:
  - [[ink-marks.njk]]
  - [[trim-marks.njk]]
  - [[margin-bleed-marks.njk]]
  - [[registration-marks.njk]]
- Likely used by:
  - [[section-statement.njk]]
  - [[work.njk]] (margin, bleed and trim marks only)

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
