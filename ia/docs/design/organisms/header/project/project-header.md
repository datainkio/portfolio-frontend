---
title: Project header
description: The case-study header, with industry label, title, abstract, and featured image, shown at the top of every project page.
type: reference
component: organisms/header/project/project-header.njk
specimens:
  - title: Live project
    note: The first published project. The page passes the same project object.
    bind:
      project: collections.projectPages.0
    frame: p-0
inContext:
  - { url: /case-studies/enquos/, label: Enquos case study }
---

`data-project-header`, `data-project-industry`, `data-landing-header-title`, and `data-project-abstract` are choreography hooks.
