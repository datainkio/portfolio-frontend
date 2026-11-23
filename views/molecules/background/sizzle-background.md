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

The video is never deferred (`defer: false`). The template also places the Pixelator, the `gel_hero` and `gel_tagline` gels, and three landing panes inside the container. The panes (`data-video-el="pane"`, `gel-pane` plus a colour utility) are plain `invisible` divs, deliberately not `.gel`, so GelAnimationManager does not discover them. They are transient and intro-only; BackgroundVideo stages them before the preloader hides and the intro timeline in BackgroundVideoAnimations contracts them. They are never part of idle. A fourth element, the sheet (`data-video-el="sheet"`, `bg-page-graphpaper fixed inset-0 -z-10 invisible`), is a sibling placed after the root's closing tag: the root is tilted and overscaled on wide tiers, and the sheet must stay flat so its graph paper lines up with the page's. Same z-index as the root and later in the DOM, so it paints above the root and below page content.

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
