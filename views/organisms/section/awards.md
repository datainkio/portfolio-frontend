---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[award](../../atoms/award.md)"
  - "[inline](../../atoms/svg/inline.md)"
---

# Awards

Defines Nunjucks macro: `render`.

## Template

- Source: [[awards.njk]]
- Path: `views/organisms/section/awards.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Params

| Param               | Type   | Description                                                                                                                                                                                                              |
| ------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                | string | Section id. Defaults to `awards`.                                                                                                                                                                                        |
| `classes`           | string | Read into a variable but never applied to the `<section>`. No effect.                                                                                                                                                    |
| `copy`              | object | `heading` is the `h2` text.                                                                                                                                                                                              |
| `order`             | string | Read but not used.                                                                                                                                                                                                       |
| `headingId`         | string | Id for the heading and `aria-labelledby`. Defaults to the section id.                                                                                                                                                    |
| `headerAwardInline` | string | Default SVG markup. Read but not rendered.                                                                                                                                                                               |
| `headerAwardMedia`  | string | Read but not rendered.                                                                                                                                                                                                   |
| `awards`            | array  | Award records, grouped by organisation with `groupByOrg`. Each group renders through `molecules/card/award-organization.njk` with `logoOnly: true`, so the homepage shows a grid of logos without titles or award names. |

## Relationships

- Imports:
  - [[award.njk]]
  - [[inline.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
