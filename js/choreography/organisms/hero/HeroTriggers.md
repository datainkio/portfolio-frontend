---
description: "Hero triggers module — supplies HERO_TRIGGER to AbstractSectionTriggers and overrides bind() to inject the intro timeline as the ScrollTrigger animation ONLY when scrubbed; pin and scrub are currently off, so the lifecycle (onEnter → playIntro) owns the reveal. bind() also creates a second, dedicated ScrollTrigger (hero-outro-pin) that pins the section root for HERO_OUTRO.pinRatio × viewport height and scrubs the four-beat outro timeline (line fade, gel expand, mission/aside travel) to completion, snapping to each beat's label and suspending the heading-gel sync trigger while active. bind() also creates one scrubbed hero-band-parallax-<index> trigger per band that holds an image (band-motion/parallax), and a hero-snap trigger that settles the next panel (header, then each statement section) in the direction of travel to the viewport top; kill() tears them down."
status: stable
tags:
  - choreography
links:
  - "[[AbstractSectionTriggers|AbstractSectionTriggers]]"
  - "[[config/index|config/index]]"
  - "[[molecules/band-motion/parallax|band-motion/parallax]]"
---

# HeroTriggers

`HERO_TRIGGER` extends `SCROLL_DEFAULTS`; `start: "top top"`, `end: "bottom bottom"`. **pin/scrub currently `false`** (ScrollTrigger complexity evaluation — kept).

`bind()` hands the intro timeline to the ScrollTrigger as `animation` **only when `scrub` is truthy**. Unscrubbed (current state), it omits `animation` so the lifecycle drives the reveal via `onEnter → playIntro`. Passing both while unscrubbed would double-drive the same timeline (jitter) — see `AbstractSection.playIntro` early-return on scrub.

To re-enable scrub: flip `scrub: true` in `HERO_TRIGGER` — the `animation` handoff then re-activates automatically.

Hero degrades cleanly without scrub: discrete intro fires once on enter.

## Outro pin (`hero-outro-pin`)

**Currently inert.** The active `split` variant no longer supplies a `buildOutro`
(see [hero-motion.js](../../molecules/hero-motion/hero-motion.js)), so the outro
timeline is the base class's empty one and `_bindOutroPin()` returns before
creating the trigger. No pin, no scrub, no gel-sync suspend. The wiring below is
retained and re-activates the moment a `buildOutro` is restored.

Separate from `HERO_TRIGGER` on purpose: flipping `scrub` on the base trigger would hand it the **intro** timeline (see `bind()` above), and its `end: "bottom bottom"` would pin the full section height, not a short exit beat. `_bindOutroPin()` instead creates its own `ScrollTrigger`:

- `trigger: this.view`, `start: "top top"`, `end: +=viewportHeight * HERO_OUTRO.pinRatio` (now `2.5`, up from `0.75` — the outro grew from one beat to four) — pins the section root (`pin: true, pinSpacing: true`). **The pin target is the hero section root, never the gel.** The gel is only _animated_ (`scaleY`) by beat 2; it lives in the fixed-positioned `#sizzle-background` container and is already viewport-positioned, so it is never pinned — see [heading-gel.md](../../molecules/hero-motion/heading-gel.md#never-pinned).
- `animation: outroTl`, `scrub: true` — scroll position drives the four-beat outro timeline (`split.js` `outro()`): H2 lines fade, the heading gel expands to full viewport height, then the mission statement and aside travel up to rest vertically centered. Pin releases automatically when the scrub range ends.
- `snap: { snapTo: "labelsDirectional", duration: { min: 0.2, max: 0.6 }, delay: 0.05, ease: "power1.inOut" }` — settles scroll onto the nearest beat label (`outro`, `lines-out`, `gel-open`) in the direction of travel, rather than resting mid-beat. First `snap` usage in the repo — `SCROLL_DEFAULTS.snap` is `false` everywhere else.
- `onToggle` suspends `hero-heading-gel-sync` (via `suspendHeadingGelSync`/`resumeHeadingGelSync` in `heading-gel.js`) while the pin is active, since the outro's gel-expand beat owns `scaleY` on the same element the sync trigger writes to every scroll tick. On deactivate it resumes the sync and force-`refresh()`s it by id so a scroll-up exit snaps the band back to heading-height immediately.
- `refreshPriority: 1` so it measures ahead of `HERO_TRIGGER`.
- Skips creating the pin entirely when the outro timeline has no children — that's the signal for "no split yet" or the `reduced` variant (`buildOutro` returns an empty timeline there), so reduced motion gets no pin.

Called at the end of `bind()`, re-entrant like the base trigger (`_outroPin?.kill()` first), and killed in `kill()` — `kill()` also force-resumes the gel sync, guarding against a matchMedia teardown mid-pin leaving it permanently suspended.

The now-removed `hero-aside-reveal` ScrollTrigger (previously in `split.js`, fired once at `top 80%`) is gone: the aside's entrance is now owned entirely by this pin's fourth beat, since the old reveal's trigger point was inside the scroll range this pin now occupies.

## Band parallax (`hero-band-parallax-<index>`)

`_bindBandParallax()` runs at the end of `bind()`. It finds every `[data-hero-el="band"]` in the section and calls `createBandParallax` for each one, passing its `[data-hero-el="band-image"]`, `HERO_BAND_PARALLAX_TRIGGER` (`SCROLL_DEFAULTS` plus `top bottom` → `bottom top`, `scrub: true`, `once: false`), and `HERO_BAND_PARALLAX.yPercent`. A band without an image gets a no-op handle. The handles are killed before every rebind and in `kill()`. Under reduced motion the profile disables hero's triggers, so `bind()` never runs and the images rest centred.

## Panel snap (`hero-snap`)

`_bindSnap()` runs at the end of `bind()`. The panels are the header (`[data-hero-el="header"]`) and every statement section (`[data-hero-el="mission-statement"]`), in document order. The trigger runs from the header's top to the last panel's top, both at `top top`, so it is only active while one of them could reach the viewport top.

Snapping is **directional**: any scroll that comes to rest inside the range moves on to the next stop in the direction of travel (`self.direction`), measured from ScrollTrigger's inertia-projected rest point. Each panel's top is a stop. A panel taller than the viewport adds a second stop where its bottom meets the viewport's bottom edge, and a rest strictly between those two stops returns the current progress, so a tall statement (likely on mobile) is read natively and never skipped. Trackpad momentum that carries past a stop lands on the stop after it; this is a snap, not input-intercepting paging. Past the last panel's top the trigger is inactive, so scroll releases into `#work`. Stops are measured each time it snaps, not cached on refresh, so lazy-loaded images can't leave stale points behind.

Duration, delay and ease come from `HERO_SNAP` in [presets/hero.js](../../config/ix/presets/hero.js) and are built from the motion duration tokens. Killed before every rebind and in `kill()`. Under reduced motion the profile turns hero's triggers off, so `bind()` never runs and the page doesn't snap.
