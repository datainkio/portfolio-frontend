---
description: "Preloader controller — bounded readiness gates (fonts, director:ready), the exit-state flip on the home landing header, hydration of deferred videos, and the single `preloader:out` dispatch that hands the page to the choreography system."
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
   timeout from `constants.js` — neither gate may hold the page indefinitely. ^d8447f
5. First visit: flips `data-preloader-state="exit"` and resolves on the hanko
   settle `transitionend` (or the settle fallback timeout under reduced
   motion). Return visit: the inline pre-paint script already set the state;
   nothing to wait for.
6. Wait for fontsReady() ^9c8d87
7. Wait for directorReady() ^e82137
8. Hydrate deferred videos^212fb1 ^d26777
9. Run outro animation ^1a429c
10. Dispatches `preloader:out` on `window` exactly once, then unlocks scroll and clears `main[aria-busy]` in `finally` — cleanup runs even if a gate throws. ^ca5d32

Logging goes through a scoped Lumberjack logger, so it is silent unless the
choreography system has enabled logging. The one `console.warn` is the
director-timeout trip, which is a genuine failure signal.
