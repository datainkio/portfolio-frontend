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

## Params

| Param         | Type                          | Description                                                                        |
| ------------- | ----------------------------- | ---------------------------------------------------------------------------------- |
| `id`          | string                        | Id of the fixed background container. Defaults to `sizzle-background`.             |
| `classes`     | string, variant map, or array | Applied to the container through `classes`, after a fixed, full-viewport baseline. |
| `style`       | string                        | Inline style on the container. Defaults to empty.                                  |
| `poster`      | Sanity image                  | Poster image, passed through `imageUrl` at 1020 px wide.                           |
| `videoSrc`    | string                        | Video URL.                                                                         |
| `autoPlay`    | boolean                       | Defaults to `true`.                                                                |
| `loop`        | boolean                       | Defaults to `true`.                                                                |
| `muted`       | boolean                       | Defaults to `true`.                                                                |
| `playsInline` | boolean                       | Defaults to `true`.                                                                |
| `preload`     | string                        | Defaults to `metadata`.                                                            |

The video is never deferred (`defer: false`). The template also places the Pixelator and the `gel_hero` gel inside the container.

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
