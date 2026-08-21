---
title: "sticky.js"
description: "Card-motion variant that glues the figure to the viewport top via a scrubbed y-translate, easing out of the hold once the body bottom passes 25% from the top of the viewport."
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

`holdDistance = body.offsetTop + body.offsetHeight - 25vh`, recomputed per refresh (`invalidateOnRefresh`), so the figure begins releasing when the body's bottom border passes 25% down from the top of the viewport. `BODY_BOTTOM_RELEASE` (0.25) is the single knob for that point. Measuring from the body's own box means the card's base `pb-[25dvh]` is no longer load-bearing for the release — it only sets the gap below the body. Without a `body` element the factory falls back to `article.offsetHeight - figure.offsetHeight` (release with the figure bottom at the fold).

## Eased release

A hard cut at the release point snaps the figure from screen-stationary to full scroll speed in one frame. Instead the scroll range is extended past the release point by `RELEASE_EASE_RATIO` (0.15 of the total), and the timeline runs in two scrubbed segments:

| Segment | Scroll share | `y` delta | Ease | Apparent motion |
| --- | --- | --- | --- | --- |
| Hold | `1 - RELEASE_EASE_RATIO` | `holdDistance` | `none` | Stationary (tracks scroll 1:1) |
| Release | `RELEASE_EASE_RATIO` | `easeDistance / 2` | `power2.out` | Accelerates from 0 to scroll speed |

`power2.out` is not a taste call — it is the curve that makes this continuous. Its slope runs 2 → 0, so covering *half* the tail distance across the full tail starts the segment tracking scroll exactly (relative velocity 0, no jolt out of the hold) and ends it at zero relative slip (no jolt into native scroll).

Consequences to keep in mind:

- The figure ends `easeDistance / 2` further down the document than the un-eased version — during the tail it deliberately falls behind scroll. That offset is inherent to easing the release, not drift.
- The tail is a **ratio**, not a pixel distance, because scrubbed timeline durations are fixed at build time while function-based values (`holdDistance`, `easeTravel`, `end`) are re-evaluated on refresh. A pixel tail would drift out of proportion on resize.
