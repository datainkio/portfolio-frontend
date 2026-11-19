---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[design-decisions](../design-decisions.md)"
  - "[designDecision contract](../../../../content-model/objects/content/design-decision.md)"
---

# Design Decision

Defines Nunjucks macro: `render`.

## Template

- Source: [[design-decision.njk]]
- Path: `views/molecules/card/design-decision.njk`

## Purpose

Renders one design decision as an `article`: optional artifact `figure`, the decision as `h3`, the result as `p`, and its activities as a `ul`. Order follows pattern §8.

## Role in the System

Classified as a **component** at the atomic **molecule** level.

## Params

| Param     | Type                          | Description                                                                                                                           |
| --------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `item`    | object                        | `activities` (array with `title`), `artifact` (optional Sanity image, rendered through the media molecule), `decision`, and `result`. |
| `index`   | number or string              | Number shown in the "Fig 0N" label. Defaults to `0`.                                                                                  |
| `classes` | string, variant map, or array | Applied to the `<article>` through `classes`, after the baseline.                                                                     |

## Relationships

- Used by:
  - [[design-decisions.njk|molecules/design-decisions.njk]]
- Imports:
  - [[media.njk|molecules/figure/media.njk]]

## Notes for Future Maintenance

- Image is `loading="lazy"`: the region sits below the fold.
- Artifact renders through [`figure/media.njk`](../figure/media.md) with `loading: "lazy"`, `zoom: true`, `classes: artifactFigureStyles` and `styles: artifactStyles` (caption `sr-only`).
