---
description: "Hero molecule part — fades the gel_tagline gel in (autoAlpha 0 to 1) as the first beat of the split intro, ahead of the header's band wipe and text. The gel is full-bleed by default, so it takes no geometry."
status: stable
tags:
  - choreography
  - hero-motion
  - gel
links:
  - "[[molecules/hero-motion/split|molecules/hero-motion/split]]"
  - "[[managers/GelAnimationManager/GelAnimationManager|GelAnimationManager]]"
---

`gel_tagline` is rendered in `#sizzle-background` by `sizzle-background.njk` (`gel-secondary`, `gel-top`, `gel-fade-sm`, `gel-opacity-100`, `gel-blend-multiply`). It is `absolute inset-0` in the fixed background, so it is already full-bleed and needs no `attachHeadingGel`-style sync.

`addTaglineGelFade(tl, gelManager, position = 0)` appends a `fromTo` of `autoAlpha` 0 to 1 over `HERO_INTRO.taglineDuration`. `autoAlpha`, not `opacity`: `GelAnimationManager` parks every gel at `autoAlpha: 0` (opacity and `visibility: hidden`), so the tween has to clear both. `fromTo` renders its start at build time, so the gel is hidden before the intro plays. It no-ops when the gel is absent.

## Order in the intro

`split.js` calls it at 0 and then adds a `header` label. The band wipe starts at `header`, and the text beats follow the band. So the gel fades in fully before the header's band and text appear.

## Reduced motion

The `reduced` variant has no tagline beat. `gel_tagline` stays at the manager's parked `autoAlpha: 0`, matching `gel_hero`, which `reduced.js` also parks hidden.
