---
title: "sticky.js"
description: "Card-motion variant that glues the figure to the viewport top via a scrubbed y-translate, releasing when the body bottom passes 25% from the top of the viewport."
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

- Exports `createCardSticky({ article, figure, body, index, triggerEl, reduceMotion })`, returning `{ kill() }` like every other card-motion factory.
- Registered in [`Card.js`](../../organisms/card/Card.js) under both `VARIANT_FACTORIES.sticky` and `VARIANT_RESET.sticky`.
- Selected by [`profiles.js`](../../config/ix/profiles.js) for the `base`, `sm`, and `md` tiers; `lg`/`xl` remain `CARD_STATIC`.

## Why a transform, not `pin` or CSS

- CSS `position: sticky` dies inside ScrollSmoother's transformed `#smooth-content`.
- ScrollTrigger `pin` with `pinSpacing: true` pushes the body down by the pin duration, so it never slides over the figure; `pinSpacing: false` drops the figure from flow, snapping the body up a full viewport at pin start.
- A scrubbed `y` leaves layout untouched, so the body keeps following native scroll — exactly the sticky behavior, and ScrollSmoother-safe.

## Geometry

`travel = body.offsetTop + body.offsetHeight - 25vh`, recomputed per refresh (`invalidateOnRefresh`), so the hold releases when the body's bottom border passes 25% down from the top of the viewport. `BODY_BOTTOM_RELEASE` (0.25) is the single knob. Measuring from the body's own box means the card's base `pb-[25dvh]` is no longer load-bearing for the release point — it only sets the gap below the body. Without a `body` element the factory falls back to `article.offsetHeight - figure.offsetHeight` (release with the figure bottom at the fold).
