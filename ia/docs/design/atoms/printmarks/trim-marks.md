---
title: Trim marks
description: Corner brackets that show where a printed sheet would be trimmed, inset within a positioned box.
type: reference
component: atoms/printmarks/trim-marks.njk
specimens:
  - title: On paper
    note: The default colour is black, so it suits a light surface.
    params: {}
    surface: paper
    frame: relative h-48
  - title: Coloured
    params:
      color: white
      inset: "6"
      weight: "2"
    frame: relative h-48
inContext:
  - { url: /, label: Homepage print marks }
---
