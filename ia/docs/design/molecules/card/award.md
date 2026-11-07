---
title: Award card
description: A card for a single award that maps an award record's card data onto the shared card component.
type: reference
component: molecules/card/award.njk
specimens:
  - title: Award as a card
    params:
      title: Webby Award
      description: Winner in the eLearning category.
      url: /work/
    bind:
      image: collections.projectPages.slug=live-hope-love.featuredImage
    frame: max-w-3xl
---

Award records in the CMS carry no `card` data yet, so callers pass the fields directly.
