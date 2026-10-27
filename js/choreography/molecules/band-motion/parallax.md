---
description: "Band-Motion factory — scroll-scrubbed parallax for the image inside a clipping band, so the image drifts slower than the band. Returns { kill() }."
status: stable
tags:
  - band-motion
  - choreography
  - parallax
links:
  - "[[system/gsap|system/gsap]]"
  - "[[organisms/hero/HeroTriggers|HeroTriggers]]"
---

`createBandParallax({ band, image, trigger, yPercent, index, reduceMotion })` scrubs the image from `yPercent: -yPercent` to `+yPercent` with `ease: "none"`. Each band gets its own ScrollTrigger, built from `trigger` with id `${trigger.id}-${index}` and the band as its trigger.

- **Caller:** `HeroTriggers._bindBandParallax()` makes one per `[data-hero-el="band"]` that holds a `[data-hero-el="band-image"]`. It passes `HERO_BAND_PARALLAX_TRIGGER` (`top bottom` → `bottom top`, `scrub: true`, `once: false`) and `HERO_BAND_PARALLAX.yPercent`.
- **Bleed:** the image has to extend past the band by more than the travel. [band.njk](../../../../views/molecules/band/band.md) gives it a quarter of the band's height above and below.
- **Lifecycle:** `kill()` kills the trigger and the tween, then resets `yPercent` and `willChange`. HeroTriggers calls it on rebind and in its own `kill()`.
- **Reduced motion:** the profile system disables hero's triggers, so this isn't called. The `isReducedMotion` guard is a second line of defence that resets the image and returns a no-op handle.
- **No image:** returns a no-op handle.

The structure mirrors `card-motion/parallax.js`. The trigger config comes in as a parameter, so this module doesn't import the organism (HeroTriggers already imports it).
