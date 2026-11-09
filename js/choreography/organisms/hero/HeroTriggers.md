---
description: "Hero triggers module — supplies HERO_TRIGGER to AbstractSectionTriggers and overrides bind() to inject the intro timeline as the ScrollTrigger animation ONLY when scrubbed; pin and scrub are currently off, so the lifecycle (onEnter → playIntro) owns the reveal. bind() also creates a second, dedicated ScrollTrigger (hero-outro-pin) that pins the section root for HERO_OUTRO.pinRatio × viewport height and scrubs the four-beat outro timeline (line fade, gel expand, mission/aside travel) to completion, snapping to each beat's label and suspending the heading-gel sync trigger while active. bind() also creates one scrubbed hero-band-parallax-<index> trigger per band that holds an image (band-motion/parallax), and one hero-panel-pin-<index> trigger per statement section (not the header) that pins it at the viewport top for 300px of scroll, the first of which also tweens gel_hero's end opacity to 100% (reversing on scroll back); kill() tears them down."
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

## Panel pins (`hero-panel-pin-<index>`)

`_bindPanelPins()` runs in `bind()`, right after the base trigger and before the outro pin and band parallax. It makes one ScrollTrigger per statement section (`[data-hero-el="mission-statement"]`), in document order. The header is deliberately left out and scrolls normally. Each uses `HERO_PANEL_PIN_TRIGGER`: `start: "top top"`, `end: "+=300"`, `pin: true`, `pinSpacing: true`, `once: false`. So as each statement's top reaches the top of the viewport, it holds there for 300px of scroll, then scrolls on with the page.

- **Pin spacing:** each pin adds 300px below its statement, which moves every later trigger. `refreshPriority: 1` measures the pins ahead of `HERO_TRIGGER` (`end: "bottom bottom"`) and the band parallax.
- **Grid:** the pin-spacer takes the panel's place in the section's 12-column grid. ScrollTrigger copies the statement's `grid-column` onto it, so the statements keep `col-span-full`.
- **Gel goes solid:** the first statement's pin also carries `animation` (from `_buildGelSolid()`) with `toggleActions: "play none none reverse"`. As that statement reaches the top, `gel_hero`'s `--gel-alpha-end` tweens from its markup value (`gel-opacity-end-50`) to `HERO_GEL_SOLID.alphaEnd` (`100%`), using the `slow` duration token and `power2.out`. Scrolling back above the statement reverses it. The class computes to `calc(50 * 1%)`, which GSAP reads as 0, so `_buildGelSolid()` parses the number and passes it as an explicit `fromTo` start. With no gel manager or gel, the pin runs without it.
- **Lifecycle:** `_killPanelPins()` calls `kill(true)` on each pin, which removes its pin-spacer. It also kills the gel tween and clears the inline `--gel-alpha-end`, so the class's value applies again. It runs before every rebind and in `kill()`. Under reduced motion the profile turns hero's triggers off, so `bind()` never runs and nothing pins.
