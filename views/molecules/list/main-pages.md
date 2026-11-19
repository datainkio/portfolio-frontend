---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[nav-link](../../atoms/link/nav-link.md)"
  - "[hanko](../../atoms/hanko/hanko.md)"
---

# Main Pages

Defines Nunjucks macro: `render`.

## Template

- Source: [[main-pages.njk]]
- Path: `views/molecules/list/main-pages.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Params

| Param        | Type                          | Description                                                                                                                  |
| ------------ | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `items`      | array                         | Navigation entries (`url` or `href`, plus `title` or `key`). Entries without a link or label are skipped. Defaults to empty. |
| `currentUrl` | string                        | The matching entry renders as a `<span aria-current="page">` instead of a link.                                              |
| `classes`    | string, variant map, or array | Applied to the `<ul>` through `classes`.                                                                                     |
| `styles`     | object                        | Slot map. See the slot table.                                                                                                |

| Slot   | Element                                                                          |
| ------ | -------------------------------------------------------------------------------- |
| `item` | Each `<li>`.                                                                     |
| `link` | The link, or the current-page `<span>`. Passed to the nav link as its `classes`. |

## Relationships

- Imports:
  - [[nav-link.njk]]
  - [[hanko.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
