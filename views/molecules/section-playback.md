---
description: "Defines Nunjucks macro: render."
type: template
---

# Section Playback

Defines Nunjucks macro: `render`.

## Template

- Source: [[section-playback.njk]]
- Path: `views/molecules/section-playback.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Params

| Param       | Type    | Description                                                             |
| ----------- | ------- | ----------------------------------------------------------------------- |
| `sectionId` | string  | Shown in the panel and set as `data-section-id`. Defaults to `hero`.    |
| `label`     | string  | Panel title. Defaults to "Playback controls".                           |
| `note`      | string  | Note text. Defaults to a short choreography hint.                       |
| `fixed`     | boolean | Adds the `section-playback--fixed` modifier class. Defaults to `false`. |

Fixed design: takes no styling params.

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
