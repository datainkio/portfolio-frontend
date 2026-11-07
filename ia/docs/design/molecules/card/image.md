---
title: Image card
description: A card for an image asset, with a zoomable picture and a list of its file details.
type: reference
component: molecules/card/image.njk
specimens:
  - title: Image details
    note: The picture is literal markup, because the card expects pre-rendered file HTML that the image collection doesn't carry.
    params:
      image:
        title: Sample plate
        id: image-001
        type: PNG
        width: 640
        height: 360
        file:
          originalFilename: sample-plate.png
          html: <img alt="A grey placeholder plate" width="640" height="360" src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Crect width='640' height='360' fill='%23888'/%3E%3C/svg%3E">
    surface: paper
    frame: max-w-sm
---

Nothing renders this on a live page, and the image collection has no `file.html`, so real records would show placeholders for the picture.
