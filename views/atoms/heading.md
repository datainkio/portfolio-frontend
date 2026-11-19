---
description: "Defines Nunjucks macro: render."
type: template
---

# Heading

Defines Nunjucks macro: `render`.

## Template

- Source: [[heading.njk]]
- Path: `views/atoms/heading.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Params

| Param     | Type                          | Description                                                                  |
| --------- | ----------------------------- | ---------------------------------------------------------------------------- |
| `level`   | number                        | Heading level, 1 to 6. Values outside that range render `h2`. Defaults to 2. |
| `text`    | string                        | Heading text.                                                                |
| `id`      | string                        | Optional `id` on the heading.                                                |
| `classes` | string, variant map, or array | Applied to the heading through `classes`.                                    |

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
