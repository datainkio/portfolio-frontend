---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[section-cap](../../molecules/section-cap.md)"
  - "[organization](../../atoms/organization.md)"
---

# Organizations

Defines Nunjucks macro: `render`.

## Template

- Source: [[organizations.njk]]
- Path: `views/organisms/section/organizations.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Params

| Param           | Type   | Description                                                                                                                    |
| --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `id`            | string | Section id. Defaults to `organizations`.                                                                                       |
| `classes`       | string | Read into a variable but never applied to the `<section>`. No effect.                                                          |
| `copy`          | object | `heading` (`h2`, defaults to "Organizations"), `subheading` (read but not rendered), and `body` (paragraph under the heading). |
| `order`         | string | Read but not used.                                                                                                             |
| `headingId`     | string | Id for the heading and `aria-labelledby`. Defaults to the section id.                                                          |
| `organizations` | array  | Each item is passed as the params of `atoms/organization.njk`. Shows "No organizations found." when empty.                     |

## Relationships

- Imports:
  - [[section-cap.njk]]
  - [[organization.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
