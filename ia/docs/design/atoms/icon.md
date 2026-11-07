---
title: Icon
description: A decorative icon from a small registry of SVG paths and arrows, sized by name and coloured with the current text colour.
type: reference
component: atoms/icon.njk
specimens:
  - title: Chevron
    params:
      name: chevron-right
      size: lg
      classes: text-primary-400
  - title: External link
    params:
      name: external-link
      size: xl
  - title: Arrow
    note: The arrows are Unicode glyphs rather than paths.
    params:
      name: arrow-right
      size: 2xl
      classes: text-neutral-100
  - title: Unknown name
    note: A name outside the registry renders a visible error box.
    params:
      name: not-an-icon
inContext:
  - { url: /work/, label: Work page controls }
---

Sizes are `xs`, `sm`, `md`, `lg`, `xl`, and `2xl`. Icons are `aria-hidden`, so pair them with visible text or an aria-label on the parent.
