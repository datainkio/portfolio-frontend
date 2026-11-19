---
title: Gel
description: An absolutely positioned decorative overlay whose corners are animated by the choreography on scroll.
type: reference
component: atoms/gel.njk
specimens:
  - title: Primary gel
    note: The choreography masks and animates it, which docs pages don't load, so this shows the unmasked box that fills its frame.
    params:
      id: spec-gel-0
      color: gel-primary
    frame: relative h-48
  - title: Second gel
    params:
      id: spec-gel-1
    frame: relative h-48
    surface: neutral
  - title: Direction and fade
    note: A gel that runs to the bottom and holds its light colour past a medium fade.
    params:
      id: spec-gel-2
      color: gel-accent
      direction: gel-bottom
      fade: gel-fade-md
    frame: relative h-48
  - title: Opacity
    note: The gradient colours mix with transparent. The element's own opacity stays with the choreography.
    params:
      id: spec-gel-3
      color: gel-primary
      opacity: gel-opacity-50
    frame: relative h-48
    surface: neutral
  - title: Blend mode
    note: Normal blending paints the gradient solid. The default, multiply, darkens what is behind it.
    params:
      id: spec-gel-4
      color: gel-accent
      blend: gel-blend-normal
    frame: relative h-48
    surface: neutral
inContext:
  - { url: /, label: Homepage background }
---

The id must match an arrangement key used by the gel choreography, such as `bg-gel-0`. The specimens use other ids so they don't collide with the page.
