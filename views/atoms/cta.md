---
description: "Defines Nunjucks macro: render."
type: template
---

# Cta

Defines Nunjucks macro: `render`.

## Template

- Source: [[cta.njk]]
- Path: `views/atoms/cta.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Params

| Param     | Type   | Description                                                                                    |
| --------- | ------ | ---------------------------------------------------------------------------------------------- |
| `text`    | string | Link text.                                                                                     |
| `url`     | string | Link target (`href`).                                                                          |
| `classes` | string | Applied to the `<a>` as-is. No `classes` filter, so variant maps and arrays are not supported. |

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
