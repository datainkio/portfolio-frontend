---
description: "Defines Nunjucks macro: render."
type: template
---

# Video

Defines Nunjucks macro: `render`.

## Template

- Source: [[video.njk]]
- Path: `views/atoms/video/video.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Params

| Param         | Type    | Description                                                                                                                                          |
| ------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`         | string  | Video URL. Defaults to a sizzle video hosted on imgur.                                                                                               |
| `poster`      | string  | Poster image URL. Empty by default.                                                                                                                  |
| `preload`     | string  | `preload` attribute. Defaults to `none`.                                                                                                             |
| `autoplay`    | boolean | Adds `autoplay`. Defaults to `false`.                                                                                                                |
| `loop`        | boolean | Adds `loop`. Defaults to `false`.                                                                                                                    |
| `muted`       | boolean | Adds `muted`. Defaults to `false`.                                                                                                                   |
| `playsInline` | boolean | Adds `playsinline`. Defaults to `false`.                                                                                                             |
| `defer`       | boolean | Defaults to `true`. When true, the source goes in `data-src` with `data-defer-video` (loaded by `js/preloader/deferred-videos.js`) instead of `src`. |
| `classes`     | string  | Appended as-is to the `<video>`. No `classes` filter.                                                                                                |
| `style`       | string  | Inline style on the `<video>`.                                                                                                                       |

## Relationships

- Imports:
  - [[video.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
