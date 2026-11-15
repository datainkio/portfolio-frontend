---
description: Organizations animations module — the idle timeline is the logo marquee; the header intro/outro and item reveal group are still commented out.
status: stable
tags:
  - choreography
links:
  - "[[AbstractSectionAnimations|AbstractSectionAnimations]]"
  - "[[system/gsap|system/gsap]]"
  - "[[section-header-intro|section-header-intro]]"
  - "[[scroll-reveal-group|scroll-reveal-group]]"
  - "[[dataink.io/frontend/ia/docs/design/tokens/motion|motion]]"
  - "[[timelines|timelines]]"
  - "[[organizations.njk|organizations.njk]]"
---

# OrganizationsAnimations

## Idle phase: logo marquee

- `enableMarquee()` measures each `track` as a single line. A row that fits stays
  a wrapped grid. A row that overflows gets `data-marquee`, one cloned copy of
  its items (`aria-hidden`, `data-organizations-clone`), and an infinite
  `xPercent` 0 → -50 tween in the idle timeline. Direction alternates by row
  position.
  Duration is `setWidth / pixelsPerSecond`, so every row drifts at the same pace.
- `disableMarquee()` removes clones, `data-marquee` and transforms, and hides the
  toggle. `enableMarquee()` calls it first, so it is safe to call repeatedly.
- `setMarqueeVisible(isVisible)`, `resumeMarquee()` and `pauseMarquee()` are
  driven by the controller. The marquee runs only when it is enabled, visible
  and not paused by the visitor.
- Pause button: toggles `aria-pressed` and pauses or resumes the idle timeline.
  It is the only pause control; hover does nothing.
- Values come from `ORGANIZATIONS_ANIMATION_DEFAULTS.marquee`.

## Not yet wired

The header intro/outro (`createSectionHeaderIntro`) and the item reveal group
(`createScrollRevealGroup`) remain commented out. `_buildIntro`/`_buildOutro`
fall back to empty timelines.
