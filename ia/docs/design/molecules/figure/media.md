---
title: Media figure
description: One image, picture, or video in a figure with an optional caption and an optional lightbox zoom.
type: reference
component: molecules/figure/media.njk
specimens:
  - title: Image with caption
    params:
      loading: lazy
      styles:
        image: block w-full
        caption: mt-2 text-sm text-neutral-400
    bind:
      image: collections.projectPages.3.decisions.0.artifact
    frame: max-w-md
  - title: Zoomable image
    note: The zoom wraps the image in a button and adds a closed dialog. It opens only with the lightbox script.
    params:
      zoom: true
      loading: lazy
      styles:
        image: block w-full
    bind:
      image: collections.projectPages.3.decisions.1.artifact
    frame: max-w-md
  - title: Video
    note: Video wins over picture and image. Without zoom it shows controls.
    params:
      alt: Project screen capture
      styles:
        image: block w-full
    bind:
      video.src: collections.projects.3.featuredVideo.url
    frame: max-w-md
inContext:
  - { url: /, label: Homepage hero statements }
  - {
      url: /case-studies/connecting-a-world-famous-dj-with-his-fans/,
      label: A case study header,
    }
---

Only an `image` gets intrinsic width and height. The figure renders nothing when it has no media. No styles are hard-coded, so pass `styles.image` and `styles.caption`.
