---
title: Card
description: The base card, with a media figure, a body of heading, byline, and link, and optional metadata and video.
type: reference
component: molecules/card/card.njk
specimens:
  - title: Image card
    params:
      title: Connecting a World-Famous DJ with His Fans
      byline: James Zabiela
      description: Winner of Best Music Site at SXSW.
      url: /work/
      meta:
        - { key: Deliverables, value: "Development, Interaction Design" }
    bind:
      image: collections.projects.3.featuredImage
    frame: max-w-3xl
  - title: Video card
    note: The video loads only when deferred-video scripting runs, so the poster still stands in here.
    params:
      title: Connecting a World-Famous DJ with His Fans
      url: /work/
      headingLevel: 4
    bind:
      image: collections.projects.3.featuredImage
      video: collections.projects.3.featuredVideo
    frame: max-w-3xl
inContext:
  - { url: /work/, label: Work page project cards }
---

The sidecar records that `featured`, `eyebrow`, and `showTitle` are accepted by the wrappers but ignored here. The description and metadata are visually hidden (`sr-only`).
