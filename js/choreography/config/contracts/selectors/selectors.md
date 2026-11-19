---
description: "Configuration — defines canonical DOM element IDs and selectors that decouple choreography code from template structure."
status: stable
tags:
  - choreography
  - config
  - selectors
---

# selectors

- `SELECTORS` — element ids: layout (`header`), section ids (`organizations`, `hero` = `manifesto`, `process`, `awards`, `work`, `contact`), ScrollSmoother containers, `overlayView`, and `video` (`background`). Ids, not CSS selectors — consumed by `getElementById` and as ScrollTrigger `id`s.
- Per-section `data-*-el` attribute maps: `HERO_SELECTORS`, `AWARD_SELECTORS`, `PROCESS_SELECTORS`, `BUILD_INFO_SELECTORS`.
- `VIDEO_SELECTORS` (media resolved by tag inside `SELECTORS.video`) and `PROJECT_HEADER_SELECTORS` (attribute selectors).
