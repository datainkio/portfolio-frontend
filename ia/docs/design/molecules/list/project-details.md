---
title: Project details
description: A definition list pairing a project's organizations with its roles, each part labelled for screen readers only.
type: reference
component: molecules/list/project-details.njk
specimens:
  - title: Literal details
    params:
      orgs:
        - { title: Ford Motor Company }
      roles:
        - { title: Creative technologist }
        - { title: Design lead }
inContext:
  - { url: /work/, label: Work page }
---

Organizations and roles both read `title`, as in the two lists it composes, so records from the `organizations` and `roles` collections pass straight through.
