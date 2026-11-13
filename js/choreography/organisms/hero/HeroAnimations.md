---
description: Hero animations module — builds the intro timeline for the hero section using HERO_INTRO motion defaults.
status: stable
tags:
  - choreography
links:
  - "[[AbstractSectionAnimations|AbstractSectionAnimations]]"
  - "[[system/gsap|system/gsap]]"
  - "[[dataink.io/frontend/ia/docs/design/tokens/motion|motion]]"
  - "[[selectors|selectors]]"
  - "[[timelines|timelines]]"
  - "[[molecules/svg-reveal/svg-reveal|svg-reveal]]"
---

# HeroAnimations

## Statement SVG reveals

- `_buildTimeline()` calls the base build, then `_buildStatementSvgReveals()`. That builds one paused reveal per `[data-hero-el="mission-statement"]` panel whose figure holds a `[data-hero-el="statement-svg"]` element, via [svg-reveal](../../molecules/svg-reveal/svg-reveal.md). Groups are hidden here, behind the preloader overlay. Without JS they stay visible.
- Reveals are stored in a `Map` keyed by panel. `kill()` and every rebuild kill them first.
- `playStatementSvg(panel)` plays a panel's reveal once. It is called by [HeroTriggers](HeroTriggers.md) from each `hero-panel-pin-<i>` `onEnter`. A module-level `WeakSet` records revealed SVGs, so a breakpoint rebuild does not hide art that has already been shown. A panel with no SVG, or an SVG already revealed, is a no-op.
- `showStatementSvgs()` marks every pending SVG as revealed, kills its timeline, and shows its groups at rest. [Hero](Hero.md) calls it when lifecycle motion is disabled.
