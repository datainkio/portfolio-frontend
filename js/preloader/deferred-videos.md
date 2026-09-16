---
description: "Single owner of the data-defer-video contract — assigns src to every video[data-defer-video][data-src], sets preload=metadata, strips the data attributes, and leaves data-motion-optional videos posterized under prefers-reduced-motion."
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
Called from `Preloader.js` on every page: at readiness on the home page, immediately elsewhere. `BackgroundVideo._ensureVideoReady()` relies on this having run before `preloader:out` and no longer assigns `src` itself. ^e4a5f6
