---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[award-organization](card/award-organization.md)"
---

# Awards

Defines Nunjucks macro: `render`.

## Template

- Source: [[awards.njk]]
- Path: `views/molecules/awards.njk`

## Purpose

Groups awards by organization and renders each group as an award-organization card.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

- `params.awards` — array of award records, grouped via the `groupByOrg` filter.
- `params.classes` — appended to the `<section>` root. See the [Component API spec](../../specs/views/component-api.views-spec.md).

## Relationships

- Imports:
  - [[award-organization.njk|molecules/card/award-organization.njk]]
  - [[section-frame.njk|molecules/section/section-frame.njk]] (`tone: "accent-600"`, `id: "awards-heading"`)
- Used by:
  - [[project.njk|pages/project/project.njk]]

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
