---
title: "Featured Image"
template: "[[featured-image.njk]]"
templatePath: "views/molecules/figure/featured-image.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "macro"
atomicLevel: "molecule"
status: "active"
tags:
  - "#eleventy"
  - "#nunjucks"
  - "#template"
  - "#obsidian"
  - "#component"
  - "#molecule"
  - "#atomic-design"
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
{{ FeaturedImage.render({ image: project.featuredImage, alt: project.title, class: "my-class" }) }}
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | `SanityImageObject` | No | Sanity image object with `asset.url`, `asset.metadata.dimensions`, `alt`, and `caption`. Renders nothing when `image.asset.url` is absent. |
| `alt` | `string` | No | Fallback alt text used when `image.alt` is empty (typically the project title). |
| `class` | `string` | No | CSS class string applied to the `<figure>`. |
| `loading` | `string` | No | `loading` attribute for the `<img>`. Defaults to `"eager"`. |

## Role in the System

Classified as a **macro** at the atomic **molecule** level. Sits below `organisms/figure/` (which composes multiple elements and data sources) and above a bare `<img>` atom.

## Data and Context

- `params.image` — a Sanity image object; shape produced by the project transform in `frontend/data/sanity/transforms/project.js`.
- `params.image.asset.metadata.dimensions` — used to set intrinsic `width`/`height` for layout stability (CLS prevention).

## Relationships

- Used by:
  - [[project.njk]] (project page, featured image slot)

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve `width`/`height` intrinsic dimension attributes — they prevent cumulative layout shift.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.
