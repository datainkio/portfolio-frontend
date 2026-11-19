---
title: Video
description: A video element with deferred loading, so a hidden background video doesn't fetch until the page chooses to start it.
type: reference
component: atoms/video/video.njk
specimens:
  - title: Controls off, deferred
    note: With defer on, the source sits in data-src and the preloader script sets it, so nothing plays here.
    params:
      classes: w-full
      muted: true
      loop: true
      playsInline: true
    frame: max-w-md
  - title: Immediate source
    note: With defer off, src is set directly and preload stays none, so nothing downloads until play.
    params:
      defer: false
      classes: w-full
    frame: max-w-md
inContext:
  - { url: /, label: Homepage background video }
---
