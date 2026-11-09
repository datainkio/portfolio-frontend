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

| Param   | Type   | Description                                                                                                                                                   |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`    | string | Element `id`. Must match the gel arrangement keys used by the choreography. Defaults to `gel-default`.                                                        |
| `color` | string | Classes added to the root, next to `bg-gel`: a colour such as `bg-gel-primary` and optionally a direction such as `bg-gel-top`. Defaults to `bg-gel-primary`. |

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
