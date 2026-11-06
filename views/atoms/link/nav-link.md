---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[icon](../icon.md)"
---

# Nav Link

Defines Nunjucks macro: `render`.

## Template

- Source: [[nav-link.njk]]
- Path: `views/atoms/link/nav-link.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Params

| Param         | Type                          | Description                                                                                                                                                                       |
| ------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `entry`       | object                        | Navigation entry. Its `url` or `href` is the target, `pageNavLabel` or `key` is the label, `description` is the title, and `class` is a raw class string that replaces `classes`. |
| `url`         | string                        | Link target, used when `entry` has no URL.                                                                                                                                        |
| `href`        | string                        | Alias for `url`, used when neither `entry` nor `url` is set.                                                                                                                      |
| `title`       | string                        | Label, used when `entry` supplies no label.                                                                                                                                       |
| `classes`     | string, variant map, or array | Applied through `classes`. Ignored when `entry.class` is set.                                                                                                                     |
| `currentUrl`  | string                        | When it equals the link target, the link gets `aria-current="page"`.                                                                                                              |
| `description` | string                        | `title` attribute, used when `entry` has no description.                                                                                                                          |

## Relationships

- Imports:
  - [[icon.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
