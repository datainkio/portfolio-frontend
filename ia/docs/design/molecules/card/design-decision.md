---
title: Design decision card
description: One design decision laid out as artifact, decision, result, and the activities involved.
type: reference
component: molecules/card/design-decision.njk
specimens:
  - title: Decision with artifact
    params:
      index: 1
    bind:
      item: collections.projectPages.3.decisions.0
    frame: max-w-sm
inContext:
  - {
      url: /case-studies/connecting-a-world-famous-dj-with-his-fans/,
      label: A case study's evidence plates,
    }
---

The card is unstyled by intent beyond its layout. The artifact image opens in a lightbox when scripting is loaded.
