---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[award](../../atoms/award.md)"
  - "[inline](../../atoms/svg/inline.md)"
---

# Awards

Defines Nunjucks macro: `render`.

## Template

- Source: [[awards.njk]]
- Path: `views/organisms/section/awards.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Data and Context

- `Award` — referenced in the template.
- `InlineSvg` — referenced in the template.
- `group` — referenced in the template.

## Relationships

- Imports:
  - [[award.njk]]
  - [[inline.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
