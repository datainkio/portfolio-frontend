---
description: "Single owner of the data-defer-video contract — hydrateDeferredVideos assigns src in bulk (excluding play-in-view videos); observeInViewVideos assigns src and plays data-play-in-view (card) videos only as they near the viewport, pausing them off it. Keeps the template's preload attribute and leaves data-motion-optional videos posterized under prefers-reduced-motion."
type: script
tags:
  - preloader
  - video
aliases:
  - "hydrateDeferredVideos"
  - "observeInViewVideos"
links:
  - "[[Preloader|preloader/Preloader]]"
  - "[[video|video.njk]]"
  - "[[card|card.njk]]"
  - "[[BackgroundVideo|BackgroundVideo]]"
---

# deferred-videos.js

Called from `Preloader.js`. Two exports:

- **`hydrateDeferredVideos(logger, selector?)`** assigns `src` to `video[data-defer-video][data-src]`, excluding `[data-play-in-view]`. On the home page it runs twice: `PRELOADER_SELECTORS.deferredBackgroundVideo` at readiness, then the default in `finally` after `preloader:out`. Pages without a splash run it once, immediately. `BackgroundVideo._ensureVideoReady()` relies on the hero pass having run before `preloader:out` and does not assign `src` itself. ^e4a5f6
- **`observeInViewVideos(logger, selector?)`** handles `[data-play-in-view]` videos (card videos). One `IntersectionObserver` with `PRELOADER_IN_VIEW.rootMargin` (`50% 0px`). Entering that margin assigns the `src` and calls `play()`; leaving it calls `pause()`. It runs right after the bulk pass, in the same two places.

Card videos carry `data-play-in-view` instead of `autoplay` on purpose: `autoplay` overrides `preload="none"`, so every card video downloaded the moment it had a `src`, on screen or not (17 MB in the 2026-09-23 Lighthouse run). Nothing else in the codebase calls `play()` on a card video, so this module is the only thing that starts them.

The `preload` attribute is the template's call, not this module's: the hero renders `preload="metadata"`, card videos `preload="none"`. `load()` is still called after the `src` assignment, because WebKit doesn't reliably pick up a bare reassignment.

Reduced motion: `[data-motion-optional]` videos never get a `src`, so their poster stands in and the observer stops watching them.
