---
description: "Defines Nunjucks macro: render."
type: template
---

# Organization

Defines Nunjucks macro: `render`.

## Template

- Source: [[organization.njk]]
- Path: `views/atoms/organization.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Params

| Param   | Type   | Description                                              |
| ------- | ------ | -------------------------------------------------------- |
| `title` | string | Name shown as text. Defaults to "Untitled organization". |

Logos were switched off on 2026-08-23 (`dc5ff743`): the homepage list is
text-only. The dead logo branch and the unused `id`, `headingId`, `copy`,
`logo`, `logoAlt` and `logoUrl` params were removed on 2026-11-07.

## Relationships

- Used by:
  - [[organizations.njk]] (`views/organisms/section/organizations.njk`), one per list item

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
