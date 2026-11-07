---
description: "Defines Nunjucks macro: render."
type: template
---

# Stats

Defines Nunjucks macro: `render`.

## Template

- Source: [[stats.njk]]
- Path: `views/molecules/stats/stats.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

| Param     | Type                           | Description                                                                                                                                                                                                                                                                      |
| --------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stats`   | array                          | Array of `{ key, value }`; items with an empty `value` are skipped.                                                                                                                                                                                                              |
| `classes` | string \| variant map \| array | The `<dl>` root (string, variant map, or array).                                                                                                                                                                                                                                 |
| `styles`  | object                         | Slots `{ item, term, value }`. `item` is appended to the `<div>` baseline. `term` and `value` are the only classes on the `<dt>`/`<dd>`. They carry no baked-in colour, so callers set it (`card.njk` passes `term: "text-neutral-300"`, `project.njk` passes `text-slate-400`). |
| `aria`    | string                         | `aria-label` for the `<dl>`; defaults to `"Metadata"`.                                                                                                                                                                                                                           |

Follows the [Component API spec](../../../specs/views/component-api.views-spec.md).

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
