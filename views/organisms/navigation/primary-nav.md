---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[site-title](../../atoms/link/site-title.md)"
  - "[main-pages](../../molecules/list/main-pages.md)"
---

# Primary Nav

Defines Nunjucks macro: `render`.

## Template

- Source: [[primary-nav.njk]]
- Path: `views/organisms/navigation/primary-nav.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Params

| Param        | Type                          | Description                                                                   |
| ------------ | ----------------------------- | ----------------------------------------------------------------------------- |
| `items`      | array                         | Navigation entries. Takes precedence over `cms` and `pages`.                  |
| `cms`        | object                        | `navigation[0].headerItems` feed the menu when `items` is not set.            |
| `pages`      | collection                    | eleventyNavigation source, used when neither `items` nor the CMS items exist. |
| `classes`    | string, variant map, or array | Applied to the `<nav>` through `classes`.                                     |
| `currentUrl` | string                        | Forwarded to the menu for `aria-current`.                                     |

## Relationships

- Imports:
  - [[site-title.njk]]
  - [[main-pages.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
