---
title: Organization card
description: A card for an organization that maps an organization record's card data onto the shared card component.
type: reference
component: molecules/card/organization.njk
specimens:
  - title: Organization as a card
    params:
      title: Ford Motor Company
      description: Automotive client.
      url: /work/
    bind:
      image: collections.projectPages.4.featuredImage
    frame: max-w-3xl
---

Organization records carry no `card` data yet, so callers pass the fields directly. The card ignores `featured` and `showTitle`.
