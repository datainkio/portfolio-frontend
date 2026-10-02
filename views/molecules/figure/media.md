---
description: "Macro that renders an image, pre-rendered picture, or video inside a <figure>, with an optional <figcaption> and optional click-to-zoom lightbox."
type: template
tags:
  - component
  - lightbox
links:
  - "[Lightbox spec](../../../specs/views/lightbox.views-spec.md)"
  - "[lightbox-dialog.njk](../lightbox/lightbox-dialog.md)"
---

# Media

Macro that renders one media source (a Sanity image, pre-rendered `<picture>` HTML, or a video) inside a `<figure>`, with an optional `<figcaption>`. With `zoom: true` it is the site's lightbox. Renders nothing when no source is given.

## Template

- Source: [[media.njk]]
- Path: `views/molecules/figure/media.njk`

## Purpose

Encapsulates the media figure pattern — `<figure>` + media + optional caption + optional lightbox — so consuming templates stay free of asset-shape awareness.

## Macro Signature

```njk
{% import "molecules/figure/media.njk" as Media %}
{#- Build inner maps as variables: a nested literal ending in `}}` closes the tag early. -#}
{%- set figureStyles = {"base": "overflow-hidden"} -%}
{%- set imgStyles = {"base": "w-full h-full object-cover"} -%}
{%- set captionStyles = {"base": "mt-2 text-sm text-gray-600"} -%}
{%- set imageStyles = {"figure": figureStyles, "image": imgStyles, "caption": captionStyles} -%}
{{ Media.render({ image: project.featuredImage, alt: project.title, styles: imageStyles }) }}
```

| Param     | Type                | Required | Description                                                                                                                                |
| --------- | ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `image`   | `SanityImageObject` | One source | Sanity image object with `asset.url`, `asset.metadata.dimensions`, `alt`, and `caption`. The only source that gets intrinsic `width`/`height`. |
| `picture` | `string`            | One source | Pre-rendered `<picture>`/`<img>` HTML (e.g. `image.file.html`). Wins over `image`. Carries its own alt and dimensions; style its inner `<img>` with `[&_img]:` utilities in `styles.image`. |
| `video`   | `object`            | One source | `{ src, poster, mimeType }`. Wins over `picture` and `image`. Without `zoom`: inline `<video controls>`. With `zoom`: inert poster in the trigger; the dialog plays it muted (not under reduced motion). |
| `alt`     | `string`            | No       | Fallback alt when `image.alt` is empty (typically the project title); the only alt for `video`, and the trigger name for `picture`. |
| `caption` | `string`            | No       | Fallback caption when `image.caption` is empty; the only caption for `picture` and `video`.                                         |
| `styles`  | `object`            | No       | `{ figure, image, caption }`. Each value is a `classes` variant map (`{"base": …, "md": …}`) or string, applied through the `classes` filter. The macro hard-codes no styles. |
| `loading` | `string`            | No       | `loading` attribute for the `image` source's `<img>`. Defaults to `"eager"`.                                                                                |
| `zoom`    | `boolean`           | No       | Click-to-zoom. Wraps the image in the lightbox contract (`data-lightbox-el` root/trigger) and renders the shared dialog from `lightbox-dialog.njk`, which loads `Lightbox.js` and shows the caption. Cursor (`zoom-in` on the trigger, `zoom-out` on the backdrop) is the only affordance. Defaults to off. |

## Role in the System

Classified as a **macro** at the atomic **molecule** level. Sits below `organisms/figure/` (which composes multiple elements and data sources) and above a bare `<img>` atom.

## Data and Context

- `params.image` — a Sanity image object; shape produced by the project transform in `frontend/data/sanity/transforms/project.js`.
- `params.image.asset.metadata.dimensions` — used to set intrinsic `width`/`height` for layout stability (CLS prevention).

## Relationships

- Used by:
  - [[project-header.njk|organisms/header/project/project-header.njk]] (project featured image)
  - [[design-decision.njk|molecules/card/design-decision.njk]] (decision artifact, `loading: "lazy"`, `zoom: true`, caption `sr-only`)
  - [[image.njk|molecules/card/image.njk]] (`picture` source, `zoom: true`; itself has no callers)

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- `zoom` dialog comes from [lightbox-dialog.njk](../lightbox/lightbox-dialog.md); only the root and trigger live here. Contract: [lightbox spec](../../../specs/views/lightbox.views-spec.md). `Lightbox.js` binds to `data-lightbox-el`, not classes. The dialog's own classes are fixed, not caller-styled.
- Styling belongs to callers via `styles`; don't reintroduce hard-coded classes.
- Preserve `width`/`height` intrinsic dimension attributes on the `image` source — they prevent cumulative layout shift.
- Replaced `molecules/lightbox/lightbox.njk` (2026-10-02): this is the only Nunjucks entry point to the lightbox.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.
