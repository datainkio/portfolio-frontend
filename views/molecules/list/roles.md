---
description: Reusable presentational component.
type: template
---

# Roles

Reusable presentational component.

## Template

- Source: [[roles.njk]]
- Path: `views/molecules/list/roles.njk`

## Purpose

Encapsulates a reusable molecule per the project's atomic design conventions.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Params

| Param   | Type  | Description                                                         |
| ------- | ----- | ------------------------------------------------------------------- |
| `roles` | array | Objects with `title`. Rendered comma-separated. Omitted when empty. |

Fixed design: takes no styling params.

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
