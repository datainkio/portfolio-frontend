---
description: "Runtime manager — reveals the global site header (cued by hero:intro:complete on home, immediately elsewhere), then hides and shows it on scroll direction change."
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

- **With a bus and a hero section** (home, via AnimationDirector): waits for `hero:intro:complete` — the last beat of the landing chain — then removes `hidden` and slides the header in (`yPercent: -100 → 0`, `motion` base/enter). Nothing waits on it; `header:intro:complete` is the chain's terminal event.
- **Otherwise**: removes `hidden` immediately, no tween. Covers standalone pages (`js/layouts/global-header.js`, no bus) and landing pages without a hero (work, contact). Those load both the Director and `global-header.js`, and whichever module runs first claims the header via `data-global-header-init`. Before the hero check, a Director-first load left the header waiting on `hero:intro:complete`, which never fires there.
- **Reduced motion**: removes `hidden` and sets the final state, no tween.

Emits `header:intro:start` and `header:intro:complete` (bus only) in every mode.

## Scroll auto-hide

The ScrollTrigger is created only after the reveal completes, so hide/show can never fire before the intro. Past `SCROLL_THRESHOLD_PX` (80), scrolling down hides the header and scrolling up shows it. Reduced motion uses `gsap.set` instead of tweens.

The header is `position: fixed`, so neither the reveal nor auto-hide reflows the page (no CLS).
