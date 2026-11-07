---
title: Band
description: A decorative full-bleed plate with inset shadows that sits behind sibling content, optionally filled with a parallax image.
type: reference
component: molecules/band/band.njk
specimens:
  - title: Solid plate
    note: The parent must be relative and isolated, and the band spans its height.
    params:
      classes: left-0
    frame: relative isolate h-32 overflow-hidden
  - title: With an image
    note: The image is taller than the band, which leaves room for scroll parallax.
    params:
      classes: left-0
    bind:
      image: cms.home.0.statements.0.image
    frame: relative isolate h-48 overflow-hidden
inContext:
  - { url: /, label: Homepage hero statements }
---

On the homepage the caller passes a negative `left` offset through `classes` so the full-width band reaches the viewport edge. Here the offset is zero.
