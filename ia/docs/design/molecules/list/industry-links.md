---
title: Industry links
description: A numbered list of anchor links to the industry groups on the Work page. The scrollspy marks the current one.
type: reference
component: molecules/list/industry-links.njk
specimens:
  - title: Industry anchors
    note: The links target heading ids on the page, so here they jump nowhere. The scrollspy that sets the current state does not run on docs pages.
    params:
      industries:
        Automotive: []
        Government: []
        Healthcare: []
    frame: max-w-sm
inContext:
  - { url: /work/, label: Work page }
---
