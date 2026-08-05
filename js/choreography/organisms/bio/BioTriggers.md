---
id: frontend.js.choreography.organisms.bio.biotriggers
role: "Bio triggers module — supplies BIO_TRIGGER to AbstractSectionTriggers and overrides bind() to inject the intro timeline as the ScrollTrigger animation ONLY when scrubbed; pin and scrub are currently off, so the lifecycle (onEnter → playIntro) owns the reveal. bind() also creates a second, dedicated ScrollTrigger (bio-outro-pin) that pins the section root and scrubs the outro (H2 line fade) timeline to completion."
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

- `trigger: this.view`, `start: "top top"`, `end: +=viewportHeight * BIO_OUTRO.pinRatio` — pins the section root (`pin: true, pinSpacing: true`).
- `animation: outroTl`, `scrub: true` — scroll position drives the H2 line fade (`split.js` `outro()`), last line first. Pin releases automatically when the scrub range ends.
- `refreshPriority: 1` so it measures ahead of `BIO_TRIGGER`.
- Skips creating the pin entirely when the outro timeline has no children — that's the signal for "no split yet" or the `reduced` variant (`buildOutro` returns an empty timeline there), so reduced motion gets no pin.

Called at the end of `bind()`, re-entrant like the base trigger (`_outroPin?.kill()` first), and killed in `kill()`.
