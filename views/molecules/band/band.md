---
description: "Macro that renders a solid, full-bleed, inset-shadowed plate behind sibling content (it reads as a cut through the background video), with an optional bleeding image for scroll parallax."
type: template
tags:
  - component
links:
  - "[Component API spec](../../../specs/views/component-api.views-spec.md)"
  - "[hero](../../organisms/section/hero.md)"
---

# Band

A decorative plate (`aria-hidden`) that sits behind its siblings. It is solid `bg-slate-900`, `w-screen` wide, and as tall as its parent. Inset shadows on its top and bottom edges make it read as a layer below the background video, seen through a cut. The shadow sits on `::after`, so it paints above the image.

## Template

- Source: [[band.njk]]
- Path: `views/molecules/band/band.njk`

## Macro Signature

```njk
{% import "molecules/band/band.njk" as Band %}
{{ Band.render({ image, classes, attrs, imageAttrs }) }}
```

| Param | Type | Notes |
| --- | --- | --- |
| `image` | Sanity image object | Optional. Rendered from `asset.url` through `imageUrl({w: 1920, q: 75})`, with empty `alt` and `loading="lazy"`. |
| `classes` | string, variant map or array | Appended to the band root. Callers pass the negative left offset here. |
| `attrs` | string | Extra attributes on the root, such as the `data-hero-el="band"` hook. |
| `imageAttrs` | string | Extra attributes on the `<img>`, such as `data-hero-el="band-image"`. |

## Caller contract

- The parent must be `relative isolate`. The band is `absolute inset-y-0 -z-1`.
- The band starts at the parent's left edge. To make it full-bleed, pass the negative offset that cancels the padding between the parent and the viewport.

## Image bleed and parallax

The image is `h-[150%]` and starts at `-top-1/4`, so a quarter of the band's height is spare above and below it. [band-motion/parallax](../../../js/choreography/molecules/band-motion/parallax.md) moves the image by `±HERO_BAND_PARALLAX.yPercent` of its own height, which has to stay inside that bleed. Without motion (no JS, reduced), the image rests centred.

## Used by

- [hero.njk](../../organisms/section/hero.md): behind the header's label + h1, with statement 0's image, and behind the subheading + body of each later statement, with that statement's image.
