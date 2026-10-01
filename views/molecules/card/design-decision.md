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

## Data and Context

- `item.artifact` — optional resolved `imageAsset` (`alt`, `caption`, `asset.url`, `asset.metadata.dimensions`). Absent → no figure, no placeholder.
- `item.decision` — string, rendered as `h3`.
- `item.result` — plain text, rendered as `p`.
- `item.activities[]` — resolved Activity concepts; `title` rendered.
- `basis`, `confidence`, `published` are never projected or rendered.

## Relationships

- Used by:
  - [[design-decisions.njk|molecules/design-decisions.njk]]

## Notes for Future Maintenance

- Unstyled by intent; styles come in a later pass.
- Image is `loading="lazy"`: the region sits below the fold.
- Artifact markup is inline rather than reusing `figure/featured-image.njk`, which carries hard-coded styles and eager loading.
