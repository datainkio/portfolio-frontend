---
description: "Runtime manager — reveals the global site header (cued by bio:intro:complete on home, immediately elsewhere), then hides and shows it on scroll direction change."
status: stable
tags:
  - choreography
  - manager
links:
  - "[[system/gsap|system/gsap]]"
  - "[[config/ix/motion/motion|config/ix/motion]]"
  - "[[config/contracts/selectors/selectors|config/contracts/selectors]]"
  - "[[config/contracts/events/events|config/contracts/events]]"
---

# GlobalHeaderManager

Owns `#global-header`, which the markup ships with `hidden`.

## Reveal

- **With a bus** (home, via AnimationDirector): waits for `bio:intro:complete` — the last beat of the landing chain — then removes `hidden` and slides the header in (`yPercent: -100 → 0`, `motion` base/enter). Nothing waits on it; `header:intro:complete` is the chain's terminal event.
- **Without a bus** (standalone pages, via `js/layouts/global-header.js`): removes `hidden` immediately, no tween.
- **Reduced motion**: removes `hidden` and sets the final state, no tween.

Emits `header:intro:start` and `header:intro:complete` (bus only) in every mode.

## Scroll auto-hide

The ScrollTrigger is created only after the reveal completes, so hide/show can never fire before the intro. Past `SCROLL_THRESHOLD_PX` (80), scrolling down hides the header and scrolling up shows it. Reduced motion uses `gsap.set` instead of tweens.

The header is `position: fixed`, so neither the reveal nor auto-hide reflows the page (no CLS).
