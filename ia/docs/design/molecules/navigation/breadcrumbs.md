---
title: Breadcrumbs
description: The path from a root page down to the current one. The last item is the current page, as text.
type: reference
component: molecules/navigation/breadcrumbs.njk
specimens:
  - title: Three levels
    params:
      trail:
        - { url: /docs/, title: Docs }
        - { url: /docs/design/, title: Design }
        - { url: /docs/design/molecules/, title: Molecules }
  - title: Two levels
    params:
      label: Short trail
      trail:
        - { url: /docs/, title: Docs }
        - { url: /docs/design/, title: Design }
inContext:
  - { url: /docs/design/, label: Every design reference page }
---

Build the trail from the navigation tree (the design pages use the `navigationTrail` filter), then pass it in. Give each breadcrumb on a page a distinct `label`, since it names the navigation landmark.
