---
title: Geometric patterns
description: Halftone, checkerboard, and stripe backgrounds sized from the spacing scale and coloured from the palette, each with its syntax and a live sample.
type: reference
templateEngineOverride: njk
---

{% import "molecules/sample/utility-sample.njk" as UtilitySample %}

{{ UtilitySample.render({
  id: "pattern",
  name: "Geometric patterns",
  file: "styles/backgrounds/Geometric.css",
  syntax: "bg-halftone-<step> · bg-halftone-<color> · bg-halftone-blur-<step> · bg-checkerboard-<step> · bg-checkerboard-<color> · bg-striped-<step> · bg-striped-<color>",
  note: "Pattern size reads the spacing scale and colour reads the palette. Combine a size and a colour.",
  examples: [
    "bg-halftone-2 bg-halftone-primary-400",
    "bg-checkerboard-4 bg-checkerboard-neutral-700",
    "bg-striped-2 bg-striped-secondary-600"
  ]
}) }}
