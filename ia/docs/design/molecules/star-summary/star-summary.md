---
title: STAR summary
description: A framed Overview of a project's problem, design challenge, approach, and outcome. Empty fields are dropped, and with none the section is omitted.
type: reference
component: molecules/star-summary/star-summary.njk
specimens:
  - title: Literal project
    params:
      project:
        situation: The museum's visitors left without carrying anything home.
        task: Connect the exhibit to the web without a second interface.
        action: Built a single content model behind the gallery and the site.
        result: Visitors kept exploring after they left.
  - title: From a project
    bind:
      project: "collections.projectPages.slug=enquos"
inContext:
  - { url: /case-studies/enquos/, label: A project page }
---
