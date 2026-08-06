---
id: frontend.js.choreography.organisms.bio.biotriggers
role: "Bio triggers module — supplies BIO_TRIGGER to AbstractSectionTriggers and overrides bind() to inject the intro timeline as the ScrollTrigger animation ONLY when scrubbed; pin and scrub are currently off, so the lifecycle (onEnter → playIntro) owns the reveal. bind() also creates a second, dedicated ScrollTrigger (bio-outro-pin) that pins the section root for BIO_OUTRO.pinRatio × viewport height and scrubs the four-beat outro timeline (line fade, gel expand, mission/aside travel) to completion, snapping to each beat's label and suspending the heading-gel sync trigger while active."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - choreography
  - frontend
  - js
  - organism
links:
  - "[[AbstractSectionTriggers|AbstractSectionTriggers]]"
  - "[[config/index|config/index]]"
---

# BioTriggers

`BIO_TRIGGER` extends `SCROLL_DEFAULTS`; `start: "top top"`, `end: "bottom bottom"`. **pin/scrub currently `false`** (ScrollTrigger complexity evaluation — kept).

`bind()` hands the intro timeline to the ScrollTrigger as `animation` **only when `scrub` is truthy**. Unscrubbed (current state), it omits `animation` so the lifecycle drives the reveal via `onEnter → playIntro`. Passing both while unscrubbed would double-drive the same timeline (jitter) — see `AbstractSection.playIntro` early-return on scrub.

To re-enable scrub: flip `scrub: true` in `BIO_TRIGGER` — the `animation` handoff then re-activates automatically.

Bio degrades cleanly without scrub: discrete intro fires once on enter.

## Outro pin (`bio-outro-pin`)

Separate from `BIO_TRIGGER` on purpose: flipping `scrub` on the base trigger would hand it the **intro** timeline (see `bind()` above), and its `end: "bottom bottom"` would pin the full section height, not a short exit beat. `_bindOutroPin()` instead creates its own `ScrollTrigger`:

- `trigger: this.view`, `start: "top top"`, `end: +=viewportHeight * BIO_OUTRO.pinRatio` (now `2.5`, up from `0.75` — the outro grew from one beat to four) — pins the section root (`pin: true, pinSpacing: true`). **The pin target is the bio section root, never the gel.** The gel is only *animated* (`scaleY`) by beat 2; it lives in the fixed-positioned `#sizzle-background` container and is already viewport-positioned, so it is never pinned — see [heading-gel.md](../../molecules/bio-motion/heading-gel.md#never-pinned).
- `animation: outroTl`, `scrub: true` — scroll position drives the four-beat outro timeline (`split.js` `outro()`): H2 lines fade, the heading gel expands to full viewport height, then the mission statement and aside travel up to rest vertically centered. Pin releases automatically when the scrub range ends.
- `snap: { snapTo: "labelsDirectional", duration: { min: 0.2, max: 0.6 }, delay: 0.05, ease: "power1.inOut" }` — settles scroll onto the nearest beat label (`outro`, `lines-out`, `gel-open`) in the direction of travel, rather than resting mid-beat. First `snap` usage in the repo — `SCROLL_DEFAULTS.snap` is `false` everywhere else.
- `onToggle` suspends `bio-heading-gel-sync` (via `suspendHeadingGelSync`/`resumeHeadingGelSync` in `heading-gel.js`) while the pin is active, since the outro's gel-expand beat owns `scaleY` on the same element the sync trigger writes to every scroll tick. On deactivate it resumes the sync and force-`refresh()`s it by id so a scroll-up exit snaps the band back to heading-height immediately.
- `refreshPriority: 1` so it measures ahead of `BIO_TRIGGER`.
- Skips creating the pin entirely when the outro timeline has no children — that's the signal for "no split yet" or the `reduced` variant (`buildOutro` returns an empty timeline there), so reduced motion gets no pin.

Called at the end of `bind()`, re-entrant like the base trigger (`_outroPin?.kill()` first), and killed in `kill()` — `kill()` also force-resumes the gel sync, guarding against a matchMedia teardown mid-pin leaving it permanently suspended.

The now-removed `bio-aside-reveal` ScrollTrigger (previously in `split.js`, fired once at `top 80%`) is gone: the aside's entrance is now owned entirely by this pin's fourth beat, since the old reveal's trigger point was inside the scroll range this pin now occupies.
