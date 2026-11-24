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

The video is never deferred (`defer: false`). The template also places the Pixelator and the `gel_video` and `gel_tagline` gels inside the container. `gel_video` is owned by the background video section (the hero's full-bleed gel was removed on 2026-11-24).

`[data-video-grid]` is the last child of the container and wraps the `<video>`, the Pixelator and both gels. Its box is the video's thumbnail grid (8 columns by 6 rows of 3:2 cells, measured from the 1920x1068 source, wider than the frame so the outer columns are cropped), placed inside a cover box that repeats the video's `object-cover` rectangle. Inside it, a child undoes the grid's offsets (back to the cover box) and a centred `w-[100cqw] h-[100cqh]` child restores the viewport-sized area, so the video, pixelator and gels lay out as they would directly in the container. There are no cell elements: the background intro clips the grid element with `clip-path: polygon(...)` to the union of the revealed cells (`BACKGROUND_GRID_REVEAL`), so where the video is not revealed nothing of the section is drawn and the `<body>`'s `bg-page-graphpaper` shows through (neither the container nor the video carries it). Without JavaScript there is no clip and the video shows. Gated paths remove the clip.

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
