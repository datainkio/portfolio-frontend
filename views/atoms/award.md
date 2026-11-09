---
description: "Defines Nunjucks macro: render."
type: template
---

# Award

Defines Nunjucks macro: `render`.

## Template

- Source: [[award.njk]]
- Path: `views/atoms/award.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Params

| Param   | Type   | Description                                                     |
| ------- | ------ | --------------------------------------------------------------- |
| `title` | string | Award name, output as plain text. Defaults to "Untitled award". |

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
