---
title: Sizzle background
description: A fixed, full-viewport background video with a pixelator and gel layer, kept behind page content and hidden from assistive technology.
type: reference
component: molecules/background/sizzle-background.njk
specimens:
  - title: Home video
    note: The frame is sized and isolated so the fixed layer stays inside it. Media starts in its initial state because the choreography bundle isn't loaded.
    params:
      id: specimen-sizzle-background
    bind:
      videoSrc: cms.home.0.videoSrc
      poster: cms.home.0.videoPoster
    surface: slate
    frame: isolate h-96 overflow-hidden
inContext:
  - { url: /, label: Homepage }
---

The root is `fixed inset-0 -z-10`, `aria-hidden`, and `inert`. On a real page it sits behind everything, so the frame here only simulates a viewport.
