---
title: Roles list
description: A comma-separated inline list of a project's role titles. Use it next to organizations in a project's byline.
type: reference
component: molecules/list/roles.njk
specimens:
  - title: Literal roles
    params:
      roles:
        - { title: Creative technologist }
        - { title: Design lead }
    surface: paper
  - title: From a project
    bind:
      roles: "collections.projectPages.0.roles"
inContext:
  - { url: /work/, label: Work page }
---
