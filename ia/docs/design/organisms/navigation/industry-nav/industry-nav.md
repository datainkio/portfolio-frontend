---
title: Industry nav
description: A fixed jump-nav that links to each industry group on the work page, a bottom drawer on small screens and a side rail from md up.
type: reference
component: organisms/navigation/industry-nav/industry-nav.njk
specimens:
  - title: Industry jump links
    note: The industries are a map of title to projects. The page groups collections.projects, which a bound path can't do, so the titles here are the live ones with empty project lists. The nav is fixed and positions itself inside the frame.
    params:
      industries:
        Advertising: []
        Civic Tech: []
        "Documentary, Advocacy, & Identity": []
        Museums & Memorials: []
        Product & Platform: []
    frame: h-[32rem] p-0
inContext:
  - { url: /work/, label: Work page }
---

The ids `work-jumplinks` and the `data-projects-el` hooks belong to the work-nav choreography, so keep them. The drawer toggle does nothing on docs pages.
