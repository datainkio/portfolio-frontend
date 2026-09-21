---
description: "Single owner of the data-defer-video contract — assigns src to video[data-defer-video][data-src] (all of them, or a narrower selector), keeps the template's preload attribute, strips the data attributes, and leaves data-motion-optional videos posterized under prefers-reduced-motion."
type: script
tags:
  - preloader
  - video
aliases:
  - "hydrateDeferredVideos"
links:
  - "[[Preloader|preloader/Preloader]]"
  - "[[video|video.njk]]"
  - "[[card|card.njk]]"
  - "[[BackgroundVideo|BackgroundVideo]]"
---

# deferred-videos.js

Called from `Preloader.js`. Takes an optional selector (default: every `video[data-defer-video][data-src]`). On the home page it runs twice — `PRELOADER_SELECTORS.deferredBackgroundVideo` at readiness, then the default in `finally` after `preloader:out` — so card videos never compete with the hero while the playback gate is waiting on it. Pages without a splash hydrate everything in one pass. `BackgroundVideo._ensureVideoReady()` relies on the hero pass having run before `preloader:out` and no longer assigns `src` itself. ^e4a5f6

The `preload` attribute is the template's call, not this module's: the hero renders `preload="metadata"`, card videos `preload="none"`, so a hydrated card holds its `src` without fetching until something plays it. `load()` is still called after the `src` assignment — WebKit doesn't reliably pick up a bare reassignment — and with `preload="none"` that is a no-op on the network.
