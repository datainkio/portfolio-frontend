---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[card](card.md)"
---

# Organization

Defines Nunjucks macro: `render`.

## Template

- Source: [[organization.njk]]
- Path: `views/molecules/card/organization.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Params

| Param          | Type                          | Description                                                                              |
| -------------- | ----------------------------- | ---------------------------------------------------------------------------------------- |
| `organization` | object                        | Organization record. Its `card` object supplies fallback values.                         |
| `card`         | object                        | Fallback record, used when `organization.card` is absent.                                |
| `title`        | string                        | Defaults to `card.title`, then "Untitled organization".                                  |
| `image`        | Sanity image or string        | Defaults to `card.image`.                                                                |
| `url`          | string                        | Defaults to `card.url`.                                                                  |
| `eyebrow`      | string                        | Defaults to `card.eyebrow`. Passed to the card, which does not render it.                |
| `description`  | string                        | Defaults to `card.description`.                                                          |
| `meta`         | array                         | Defaults to `card.meta`.                                                                 |
| `featured`     | boolean                       | Defaults to `card.featured`, then `false`. Passed to the card, which does not render it. |
| `showTitle`    | boolean                       | Passed to the card, which does not read it.                                              |
| `classes`      | string, variant map, or array | Passed to the card.                                                                      |
| `styles`       | object                        | Passed to the card. See the slot table.                                                  |

| Slot    | Element                                          |
| ------- | ------------------------------------------------ |
| `image` | The card's media element (`<img>` or `<video>`). |

## Relationships

- Imports:
  - [[card.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
