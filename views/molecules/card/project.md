---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[card](card.md)"
---

# Project

Defines Nunjucks macro: `render`.

## Template

- Source: [[project.njk]]
- Path: `views/molecules/card/project.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Params

| Param         | Type         | Description                                                                                                                                                        |
| ------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `project`     | object       | Project record: `title`, `featuredImage`, `featuredVideo`, `url`, `abstract`, `organization` (titles joined into the byline), `rolesTitles`, and `activityTitles`. |
| `title`       | string       | Defaults to `project.title`, then "Untitled project".                                                                                                              |
| `image`       | Sanity image | Defaults to `project.featuredImage`.                                                                                                                               |
| `video`       | object       | Defaults to `project.featuredVideo`.                                                                                                                               |
| `url`         | string       | Defaults to `project.url`.                                                                                                                                         |
| `description` | string       | Defaults to `project.abstract`.                                                                                                                                    |
| `eyebrow`     | string       | Read to build an industries string that is never passed to the card. No effect.                                                                                    |
| `roles`       | string       | Read to build a roles string that is never passed to the card. No effect.                                                                                          |
| `activities`  | string       | Defaults to the joined `project.activityTitles`. Feeds the "Deliverables" meta row.                                                                                |
| `meta`        | array        | Defaults to one row: `{ key: "Deliverables", value: activities }`.                                                                                                 |
| `featured`    | boolean      | Passed to the card, which does not render it. Defaults to `false`.                                                                                                 |
| `showTitle`   | boolean      | Passed to the card, which does not read it.                                                                                                                        |
| `eager`       | boolean      | Passed to the card.                                                                                                                                                |
| `styles`      | object       | Passed to the card. See the slot table.                                                                                                                            |

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
