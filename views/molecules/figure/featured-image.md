---
description: "Macro that renders a Sanity-sourced image inside a <figure>, with intrinsic dimensions and an optional <figcaption>."
type: template
tags:
  - component
---

# Featured Image

Macro that renders a Sanity-sourced image inside a `<figure>`, with intrinsic dimensions and an optional `<figcaption>`. Renders nothing when the asset URL is absent.

## Template

- Source: [[featured-image.njk]]
- Path: `views/molecules/figure/featured-image.njk`

## Purpose

Encapsulates the featured image pattern — `<figure>` + `<img>` with intrinsic dimensions + optional caption — so consuming templates stay free of asset-shape awareness.

## Macro Signature

```njk
{% import "molecules/figure/featured-image.njk" as FeaturedImage %}
{#- Build inner maps as variables: a nested literal ending in `}}` closes the tag early. -#}
{%- set figureStyles = {"base": "overflow-hidden"} -%}
{%- set imgStyles = {"base": "w-full h-full object-cover"} -%}
{%- set captionStyles = {"base": "mt-2 text-sm text-gray-600"} -%}
{%- set imageStyles = {"figure": figureStyles, "image": imgStyles, "caption": captionStyles} -%}
{{ FeaturedImage.render({ image: project.featuredImage, alt: project.title, styles: imageStyles }) }}
```

| Param     | Type                | Required | Description                                                                                                                                |
| --------- | ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `image`   | `SanityImageObject` | No       | Sanity image object with `asset.url`, `asset.metadata.dimensions`, `alt`, and `caption`. Renders nothing when `image.asset.url` is absent. |
| `alt`     | `string`            | No       | Fallback alt text used when `image.alt` is empty (typically the project title).                                                            |
| `styles`  | `object`            | No       | `{ figure, image, caption }`. Each value is a `classes` variant map (`{"base": …, "md": …}`) or string, applied through the `classes` filter. The macro hard-codes no styles. |
| `loading` | `string`            | No       | `loading` attribute for the `<img>`. Defaults to `"eager"`.                                                                                |
| `zoom`    | `boolean`           | No       | Click-to-zoom. Wraps the image in the lightbox contract (`data-lightbox-el` root/trigger/dialog/close) and loads `Lightbox.js`. Cursor (`zoom-in` on the trigger, `zoom-out` on the backdrop) is the only affordance. Defaults to off. |

## Role in the System

Classified as a **macro** at the atomic **molecule** level. Sits below `organisms/figure/` (which composes multiple elements and data sources) and above a bare `<img>` atom.

## Data and Context

- `params.image` — a Sanity image object; shape produced by the project transform in `frontend/data/sanity/transforms/project.js`.
- `params.image.asset.metadata.dimensions` — used to set intrinsic `width`/`height` for layout stability (CLS prevention).

## Relationships

- Used by:
  - [[project-header.njk|organisms/header/project/project-header.njk]] (project featured image)
  - [[design-decision.njk|molecules/card/design-decision.njk]] (decision artifact, `loading: "lazy"`, caption `sr-only`)

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- `zoom` markup must match the contract in [lightbox.njk](../lightbox/lightbox.md) and the PortableText image serializer; `Lightbox.js` binds to `data-lightbox-el`, not classes. The dialog's own classes are fixed, not caller-styled.
- Styling belongs to callers via `styles`; don't reintroduce hard-coded classes.
- Preserve `width`/`height` intrinsic dimension attributes — they prevent cumulative layout shift.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.
