---
title: Lightbox dialog
description: The shared native dialog for the lightbox, with a close button, the enlarged media, and an optional caption.
type: reference
component: molecules/lightbox/lightbox-dialog.njk
specimens:
  - title: Image dialog
    note: The dialog is closed, so the frame looks empty. It opens only when a media figure with zoom triggers it through the lightbox script.
    params:
      alt: A sample enlarged image
      caption: The caption sits beside the image at large widths.
    bind:
      src: collections.projectPages.slug=connecting-a-world-famous-dj-with-his-fans.decisions.0.artifact.asset.url
    frame: min-h-8
inContext:
  - {
      url: /case-studies/connecting-a-world-famous-dj-with-his-fans/,
      label: Zoomable artifacts,
    }
---

Callers own the trigger button and the root `data-lightbox-el="root"`. Each instance adds a module script tag, which the browser dedupes.
