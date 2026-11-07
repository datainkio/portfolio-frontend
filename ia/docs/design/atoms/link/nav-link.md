---
title: Nav link
description: A navigation anchor built from a page entry, marking itself as the current page when its URL matches.
type: reference
component: atoms/link/nav-link.njk
specimens:
  - title: Other page
    params:
      entry: { url: /work/, key: Work, description: Selected projects }
      currentUrl: /
  - title: Current page
    note: A matching currentUrl sets aria-current.
    params:
      entry: { url: /work/, key: Work }
      currentUrl: /work/
inContext:
  - { url: /, label: Global header navigation }
---
