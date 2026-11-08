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
      color: bg-gel-primary
    frame: relative h-48
  - title: Second gel
    params:
      id: spec-gel-1
    frame: relative h-48
    surface: neutral
inContext:
  - { url: /, label: Homepage background }
---

The id must match an arrangement key used by the gel choreography, such as `bg-gel-0`. The specimens use other ids so they don't collide with the page.
