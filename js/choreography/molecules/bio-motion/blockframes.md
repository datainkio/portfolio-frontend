---
id: frontend.js.choreography.molecules.bio-motion.blockframes
role: "Blockframes reveal for bio-motion — a once-fire ScrollTrigger that assembles the inlined `.Basic` Blockframes SVG (the visible `blockframes-visible` cell of the 6x6 grid) when the wrapper's top reaches viewport center. Stages chrome/background, then toolbar, then staggered content (sidebar, banner, title, subtitle, text lines) via `.from()` tweens that settle back to each element's native attribute opacity; then zooms out — scales the `blockframes-grid` element 1 -> 1/6 about origin 40%/40% (landing the 6x6 grid exactly in the wrapper box) while the 35 hidden cells fade in (autoAlpha). No scrub/pin; reduced motion handled upstream by the `reduced` variant swap. Invoked from split.js `intro()`."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - "#[bio-motion]"
  - "#[biography]"
  - "#[blockframes]"
  - "#[choreography]"
  - "#[frontend]"
  - "#[introduction]"
  - "#[js]"
  - "#[scrolltrigger]"
  - "#[svg]"
links:
  - "[[bio-motion]]"
  - "[[blockframe-basic]]"
backlinks:
  - "[[bio-motion]]"
  - "[[split]]"
---
