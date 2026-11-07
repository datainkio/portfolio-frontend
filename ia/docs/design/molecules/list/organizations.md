---
title: Organizations list
description: A comma-separated inline list of organization names. The caller resolves the records, and this list only presents them.
type: reference
component: molecules/list/organizations.njk
specimens:
  - title: Literal organizations
    params:
      orgs:
        - { name: Ford Motor Company }
        - { name: Smithsonian }
    surface: paper
inContext:
  - { url: /, label: Homepage }
---

The list reads each record's `name`, but organization records from the `organizations` collection carry `title`, so resolved records need mapping first.
