---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[design-decision](card/design-decision.md)"
  - "[project-page pattern](../../../content-model/patterns/project-page.md)"
---

# Design Decisions

Defines Nunjucks macro: `render`.

## Template

- Source: [[design-decisions.njk]]
- Path: `views/molecules/design-decisions.njk`

## Purpose

Renders the project page's design-decisions region (pattern §8): an `h2` region holding a list, one design-decision card per item.

## Role in the System

Classified as a **component** at the atomic **molecule** level. Follows the [awards](awards.md) section pattern (section → heading → list → card macro).

## Data and Context

- `params.decisions` — `project.decisions[]` from `projectPageProjection.js`. Already filtered to `published == true` and in curation (array) order; the template does no filtering or sorting.
- Region omitted entirely when the array is empty or missing.

## Relationships

- Imports:
  - [[design-decision.njk|molecules/card/design-decision.njk]]
- Used by:
  - [[project.njk|pages/project/project.njk]] — after the body, before the live-project link.

## Notes for Future Maintenance

- Unstyled by intent; styles come in a later pass.
- `data-decisions-el` hooks are reserved for choreography; JS binds to them, never to classes.
- Heading id `design-decisions-heading` assumes one region per page.

## Open Questions

- Placement is provisional: after the body, or between the STAR summary and the body (pattern open question; needs wireframe update).
