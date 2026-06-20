---
id: frontend.js.choreography.organisms.awards.awardstriggers
role: "Awards triggers module — supplies AWARDS_TRIGGER to AbstractSectionTriggers and overrides bind() to inject the intro timeline as the ScrollTrigger animation ONLY when scrubbed; pin and scrub are currently off, so the lifecycle (onEnter → playIntro) owns the reveal."
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

# AwardsTriggers

`AWARDS_TRIGGER` extends `SCROLL_DEFAULTS`; `id = SELECTORS.awards`, `start: "top top"`, `end: "+=1500px"`, `once: false`. **pin/scrub currently `false`** (ScrollTrigger complexity evaluation — kept). With pin and scrub off, `end: "+=1500px"` is **inert** (no scroll range consumed) — left in place for easy scrub re-enable.

`bind()` mirrors BioTriggers: hands the intro timeline to the ScrollTrigger as `animation` **only when `scrub` is truthy**, else the lifecycle drives the reveal via `onEnter → playIntro` (avoids double-drive). See `AbstractSection.playIntro`.

Awards degrades cleanly without scrub: slide-in fires once on enter.
