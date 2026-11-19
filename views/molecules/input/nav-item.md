---
description: Reusable presentational component.
type: template
---

# Nav Item

Reusable presentational component.

## Template

- Source: [[nav-item.njk]]
- Path: `views/molecules/input/nav-item.njk`

## Purpose

Encapsulates a reusable molecule per the project's atomic design conventions.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Params

| Param           | Type   | Description                                                                                          |
| --------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| `item`          | object | Nav entry: `key`, `url`, and optional `children`. With children it renders a `<details>` disclosure. |
| `accordionName` | string | Shared `name` for the `<details>` element, so one stays open at a time.                              |

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
