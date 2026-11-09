---
description: "Defines Nunjucks macro: render."
type: template
---

# Gel

Defines Nunjucks macro: `render`.

## Template

- Source: [[gel.njk]]
- Path: `views/atoms/gel.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Params

| Param       | Type   | Description                                                                                                                                                                                                                             |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | string | Element `id`. Must match the gel arrangement keys used by the choreography. Defaults to `gel-default`.                                                                                                                                  |
| `color`     | string | Colour class, next to `gel`: `gel-primary`, `gel-secondary`, `gel-accent`, `gel-neutral` or `gel-neutral-light`. Defaults to `gel-primary`.                                                                                             |
| `direction` | string | Optional direction class: `gel-top`, `gel-bottom`, `gel-left`, `gel-right` or a corner such as `gel-bottom-left`. The stylesheet default is `gel-top`.                                                                                  |
| `fade`      | string | Optional fade distance class: `gel-fade-xs` to `gel-fade-xl`, `gel-fade-full`, or an arbitrary value such as `gel-fade-[30%]`. The stylesheet default is `gel-fade-full`.                                                               |
| `opacity`   | string | Optional gradient opacity class: `gel-opacity-<n>` for 0 to 100, or an arbitrary value such as `gel-opacity-[35%]`. The stylesheet default is 100. It tints the gradient and is not the element's opacity, which the choreography owns. |
| `blend`     | string | Optional blend mode class: `gel-blend-<mode>`, for example `gel-blend-screen` or `gel-blend-normal`. The stylesheet default is multiply. An arrangement's `blendMode` is set inline by the gel manager and still overrides it.          |

## Relationships

- Imports:
  - [[gel.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
