---
title: "sticky.js"
description: "Card-motion variant that glues the figure to the viewport top via a scrubbed y-translate, releasing when the body bottom hits 75% of the viewport."
type: sidecar
status: active
tags:
  - "#choreography"
  - "#card"
  - "#scrolltrigger"
---

# sticky.js

Variant 01 of [`project-card-responsiveness`](../../../../specs/animation/project-card-responsiveness.md) — active below `lg`.

## Contract

- Exports `createCardSticky({ article, figure, index, triggerEl, reduceMotion })`, returning `{ kill() }` like every other card-motion factory.
- Registered in [`Card.js`](../../organisms/card/Card.js) under both `VARIANT_FACTORIES.sticky` and `VARIANT_RESET.sticky`.
- Selected by [`profiles.js`](../../config/ix/profiles.js) for the `base`, `sm`, and `md` tiers; `lg`/`xl` remain `CARD_STATIC`.

## Why a transform, not `pin` or CSS

- CSS `position: sticky` dies inside ScrollSmoother's transformed `#smooth-content`.
- ScrollTrigger `pin` with `pinSpacing: true` pushes the body down by the pin duration, so it never slides over the figure; `pinSpacing: false` drops the figure from flow, snapping the body up a full viewport at pin start.
- A scrubbed `y` leaves layout untouched, so the body keeps following native scroll — exactly the sticky behavior, and ScrollSmoother-safe.

## Geometry

`travel = article.offsetHeight - figure.offsetHeight`, recomputed per refresh (`invalidateOnRefresh`). The card's base `pb-[25dvh]` is load-bearing: it makes travel end with the body bottom at 75% of the viewport and the figure bottom at the fold, keeping the next card below the fold until the outgoing card clears the top.
