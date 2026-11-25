---
description: "Hero triggers module — supplies HERO_TRIGGER to AbstractSectionTriggers and overrides bind() to inject the intro timeline as the ScrollTrigger animation ONLY when scrubbed; pin and scrub are currently off, so the lifecycle (onEnter → playIntro) owns the reveal. bind() also creates a second, dedicated ScrollTrigger (hero-outro-pin) that pins the section root for HERO_OUTRO.pinRatio × viewport height and scrubs the outro timeline (line fade) to completion, snapping to each beat's label. bind() also creates one scrubbed hero-band-parallax-<index> trigger per band that holds an image (band-motion/parallax), and one unpinned hero-statement-<index> trigger per statement section (not the header) that plays the statement's SVG reveal when its top is 60% down the viewport. kill() tears them down."
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
creating the trigger. No pin, no scrub. The wiring below is
retained and re-activates the moment a `buildOutro` is restored.

Separate from `HERO_TRIGGER` on purpose: flipping `scrub` on the base trigger would hand it the **intro** timeline (see `bind()` above), and its `end: "bottom bottom"` would pin the full section height, not a short exit beat. `_bindOutroPin()` instead creates its own `ScrollTrigger`:

- `trigger: this.view`, `start: "top top"`, `end: +=viewportHeight * HERO_OUTRO.pinRatio` — pins the section root (`pin: true, pinSpacing: true`). **The pin target is the hero section root, never a gel.** Gels live in the fixed-positioned `#sizzle-background` container and are already viewport-positioned.
- `animation: outroTl`, `scrub: true` — scroll position drives the outro timeline (`split.js` `outro()`): H2 lines fade. Pin releases automatically when the scrub range ends.
- `snap: { snapTo: "labelsDirectional", duration: { min: 0.2, max: 0.6 }, delay: 0.05, ease: "power1.inOut" }` — settles scroll onto the nearest beat label (`outro`, `lines-out`) in the direction of travel, rather than resting mid-beat. First `snap` usage in the repo — `SCROLL_DEFAULTS.snap` is `false` everywhere else.
- `refreshPriority: 1` so it measures ahead of `HERO_TRIGGER`.
- Skips creating the pin entirely when the outro timeline has no children — that's the signal for "no split yet" or the `reduced` variant (`buildOutro` returns an empty timeline there).

Called at the end of `bind()`, re-entrant like the base trigger (`_outroPin?.kill()` first), and killed in `kill()`

The now-removed `hero-aside-reveal` ScrollTrigger (previously in `split.js`, fired once at `top 80%`) is gone: the aside's entrance is now owned entirely by this pin's fourth beat, since the old reveal's trigger point was inside the scroll range this pin now occupies.

## Band parallax (`hero-band-parallax-<index>`)

`_bindBandParallax()` runs at the end of `bind()`. It finds every `[data-hero-el="band"]` in the section and calls `createBandParallax` for each one, passing its `[data-hero-el="band-image"]`, `HERO_BAND_PARALLAX_TRIGGER` (`SCROLL_DEFAULTS` plus `top bottom` → `bottom top`, `scrub: true`, `once: false`), and `HERO_BAND_PARALLAX.yPercent`. A band without an image gets a no-op handle. The handles are killed before every rebind and in `kill()`.

## Statement triggers (`hero-statement-<index>`)

`_bindStatementTriggers()` runs in `bind()`, right after the base trigger and before the outro pin and band parallax. It makes one ScrollTrigger per statement section (`[data-hero-el="mission-statement"]`) that holds a prepared SVG (`[data-hero-el="statement-svg"]`), in document order. The trigger element is the SVG's `<figure>`, not the section. A statement with no SVG gets no trigger, and the header is deliberately left out. Each uses `HERO_STATEMENT_TRIGGER`: `start: "bottom bottom"` (the figure's bottom at the bottom of the viewport, so the whole figure is in view; a figure taller than the viewport fires once its bottom scrolls in), `end: "bottom top"`, `pin: false`, `pinSpacing: false`, `once: false`. Nothing is pinned: the statements scroll with the page.

- **Statement SVG:** each trigger's `onEnter` calls `playStatementSvg(panel)` on [HeroAnimations](HeroAnimations.md), which plays that statement's SVG reveal once. A load or fast scroll past the figure still fires `onEnter` (then `onLeave`), so passed art is never left hidden.
- **Lifecycle:** `_killStatementTriggers()` kills each trigger. It runs before every rebind and in `kill()`.
- **History:** until 2026-11-24 these were `hero-panel-pin-<index>` triggers (`HERO_PANEL_PIN_TRIGGER`) that pinned each statement at the viewport top for 300px of scroll, with pin spacing. The pin was removed; only the reveal cue remains. Also until 2026-11-24 the trigger element was the statement section, with `start: "top 60%"`.

## Reduced motion

- The profile system turns hero's triggers off under reduced motion, so `bind()` never runs. No outro pin, band parallax or statement trigger is created, and nothing pins or scrubs.
- The outro pin is skipped because the `reduced` variant's `buildOutro` returns an empty timeline.
- Band images rest centred, so nothing moves them.
- Statement SVGs are shown at rest by the Hero controller instead of by the statement triggers (see [Hero](Hero.md)).
