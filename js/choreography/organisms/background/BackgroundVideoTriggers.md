---
description: "Background video triggers module — defines and exports BACKGROUND_TRIGGER (SCROLL_DEFAULTS + id SELECTORS.video) and supplies it to AbstractSectionTriggers."
status: stable
tags:
  - choreography
links:
  - "[[AbstractSectionTriggers|AbstractSectionTriggers]]"
  - "[[scrolltriggers|scrolltriggers]]"
  - "[[selectors|selectors]]"
---

# BackgroundVideoTriggers

`BACKGROUND_TRIGGER` extends `SCROLL_DEFAULTS`; `id = SELECTORS.video` (`"background"`). It lives here with its organism, like `HERO_TRIGGER` and `AWARDS_TRIGGER` — `config/ix/scrolltriggers.js` holds only `SCROLL_DEFAULTS`. The id previously read the nonexistent `SELECTORS.background` and resolved to `undefined`.
