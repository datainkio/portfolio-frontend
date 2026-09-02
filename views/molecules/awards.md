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
- `params.class` — optional wrapper CSS classes.
- `params.size` — optional logo size passed through to `award-organization`, defaults to `size-10`.

## Relationships

- Imports:
  - [[award-organization.njk|molecules/card/award-organization.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
- `views/molecules/list/awards.njk` appears to be a separate, similarly-named component — confirm both are intentionally distinct and not duplicative.
