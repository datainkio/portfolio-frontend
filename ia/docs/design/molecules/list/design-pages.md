---
title: Design pages nav
description: The sidebar navigation of these design-system docs, with up to three levels of links and the current page highlighted.
type: reference
component: molecules/list/design-pages.njk
specimens:
  - title: Three levels
    note: A small literal nav stands in for the eleventyNavigation entries the layout passes.
    params:
      currentUrl: /docs/design/molecules/
      nav:
        - title: Atoms
          url: /docs/design/atoms/
          children:
            - { title: Button, url: /docs/design/atoms/button/ }
        - title: Molecules
          url: /docs/design/molecules/
          children:
            - title: Stats
              url: /docs/design/molecules/stats/
              children:
                - {
                    title: Stats slots,
                    url: /docs/design/molecules/stats/slots/,
                  }
    frame: max-w-xs
inContext:
  - { url: /docs/design/, label: Design system docs }
---
