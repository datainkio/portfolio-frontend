---
title: Margin and bleed marks
description: Two nested outlines, one dashed for bleed and one solid for margin, inset from the edges of a positioned box.
type: reference
component: atoms/printmarks/margin-bleed-marks.njk
specimens:
  - title: Default
    params: {}
    frame: relative h-48
  - title: Sized and coloured
    note: The values are Tailwind scale keys that build the class names.
    params:
      color: primary-400
      bleedInset: "4"
      marginInset: "8"
    frame: relative h-48
inContext:
  - { url: /, label: Homepage print marks }
---
