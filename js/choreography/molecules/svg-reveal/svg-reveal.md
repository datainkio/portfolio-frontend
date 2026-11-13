---
description: "Composed pattern — reveals an inline SVG one top-level group at a time, in DOM order, returning a paused timeline the caller plays and a showAll() reduced-motion path."
status: stable
tags:
  - choreography
links:
  - "[[system/gsap|system/gsap]]"
  - "[[atoms/fade/fade|atoms/fade]]"
  - "[[config/ix/motion/motion|config/ix/motion]]"
  - "[[organisms/hero/HeroAnimations|HeroAnimations]]"
---

# svg-reveal

`buildSvgReveal(svg, opts) → { timeline, showAll() } | null`

- **Groups:** every `:scope > g` child of the `<svg>`, in DOM order. Nested groups are not revealed separately.
- **Build state:** all groups are hidden (`autoAlpha: 0`) as soon as the molecule builds.
- **Timeline:** a paused `gsap.timeline`. Each group is added with `fadeIn` at `index * stagger`. The molecule never plays it; the caller plays it from its own trigger.
- **Defaults:** `duration` from `motion.duration("base")` (ms, converted to seconds), `ease` from `motion.ease("enter")`, `stagger` from `motion.stagger("base")` (seconds). Each can be overridden through `opts`.
- **`showAll()`:** sets every group to `autoAlpha: 1` at once. This is the reduced-motion path; the caller decides when to use it.
- **No media query:** the molecule does not read `prefers-reduced-motion`. The caller chooses between `timeline.play()` and `showAll()`.
- **Returns `null`** when there is no SVG or it has no top-level groups.

Used by [HeroAnimations](../../organisms/hero/HeroAnimations.md) (`_buildStatementSvgReveals()`), one reveal per statement panel.
