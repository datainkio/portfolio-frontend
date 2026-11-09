---
title: Project card
description: A card for a project record that supplies title, image, video, client byline, and a deliverables line to the base card.
type: reference
component: molecules/card/project.njk
specimens:
  - title: Project with video
    bind:
      project: collections.projects.slug=connecting-a-world-famous-dj-with-his-fans
    frame: max-w-3xl
  - title: Project with an image only
    params:
      headingLevel: 4
    bind:
      project: collections.projects.slug=improving-access-to-government-benefits-and-services
    frame: max-w-3xl
inContext:
  - { url: /work/, label: Work page }
---

Pass the `project` record and the macro derives everything else. Params such as `title`, `image`, and `meta` override the record.
