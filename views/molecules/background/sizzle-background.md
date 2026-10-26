---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[video](../../atoms/video/video.md)"
  - "[gel](../../atoms/gel.md)"
---

# Sizzle Background

Defines Nunjucks macro: `render`.

## Template

- Source: [[sizzle-background.njk]]
- Path: `views/molecules/background/sizzle-background.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

- `Gel` — referenced in the template. Renders `gel_hero` (the hero's full-bleed band) and then `gel_title` (the band the hero intro wipes across the h1). `gel_title` comes later in the DOM, so it stacks above `gel_hero`.
- `videoAtom` — referenced in the template.

## Relationships

- Imports:
  - [[video.njk]]
  - [[gel.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
