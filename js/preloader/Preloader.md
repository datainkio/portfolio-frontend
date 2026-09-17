---
description: "Preloader controller — bounded gates (fonts, director:ready, background video playing, CSS intro finished), the exit-state flip that runs the CSS outro, hiding the root, hydration of deferred videos, and the single `preloader:out` dispatch that hands the page to the choreography system."
type: script
tags:
  - preloader
  - choreography
aliases:
  - "initPreloader"
links:
  - "[[constants|preloader/constants]]"
  - "[[deferred-videos|preloader/deferred-videos]]"
  - "[[home-landing|home-landing.njk]]"
  - "[[choreography-script|choreography-script.njk]]"
  - "[[SessionManager|SessionManager]]"
  - "[[LandingSequence|LandingSequence]]"
  - "[[HomeHeaderManager|HomeHeaderManager]]"
---
# preloader.js

See [README.preloader.md](README.preloader.md) for the strategy and contracts.

Runs on every page that includes `choreography-script.njk`. Without a
`[data-preloader]` element it hydrates deferred videos and returns; nothing
else here applies. On the home page it: ^fd773d

1. Page template calls initPreloader ^66dc4a
2. Reads/marks the session (`SessionManager.hasVisited` / `markVisited`). ^c737de
3. First visit only: locks `html`/`body` overflow and captures `scrollY`. ^b3f101
4. Awaits `document.fonts.ready` and `director:ready`, each raced against a
   timeout from `constants.js` — no gate may hold the page indefinitely. ^d8447f
5. Hydrates deferred videos, then calls `play()` on the background video and
   awaits it (bounded) so the splash never lifts onto a paused poster.
6. Awaits the CSS intro (the subtitle's animation `finished`, bounded) so the
   outro never cuts it short. Resolves at once under reduced motion or if the
   intro already landed.
7. Root visible: flips `data-preloader-state="exit"`, awaits the logo's
   animation `finished` (bounded), sets `hidden`. Root already `hidden`
   (return visit, pre-paint script): outro skipped.
8. Dispatches `preloader:out` on `window` exactly once, then unlocks scroll and clears `main[aria-busy]` in `finally` — cleanup runs even if a gate throws. ^ca5d32

Logging goes through a scoped Lumberjack logger, so it is silent unless the
choreography system has enabled logging. The one `console.warn` is the
director-timeout trip, which is a genuine failure signal.
