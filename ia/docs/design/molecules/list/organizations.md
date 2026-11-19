---
title: Organizations list
description: A comma-separated inline list of organization names. The caller resolves the records, and this list only presents them.
type: reference
component: molecules/list/organizations.njk
specimens:
  - title: Literal organizations
    params:
      orgs:
        - { title: Ford Motor Company }
        - { title: Smithsonian }
    surface: paper
inContext:
  - { url: /, label: Homepage }
---

The list reads each record's `title`, so records from the `organizations` collection pass straight through.
