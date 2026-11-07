---
title: Project organizations
description: A span of organization titles separated by commas, used as the clients and partners value in project metadata. It renders nothing when the list is empty.
type: reference
component: molecules/list/project-orgs.njk
specimens:
  - title: Literal organizations
    params:
      classes: text-neutral-100
      orgs:
        - { title: Ford Motor Company }
        - { title: Smithsonian }
  - title: From a project
    bind:
      orgs: "collections.projectPages.2.organization"
inContext:
  - { url: /work/, label: Work page }
---

Unlike the organizations list, which reads `name`, this one reads each record's `title`.
