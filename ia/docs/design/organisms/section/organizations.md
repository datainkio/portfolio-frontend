---
title: Organizations section
description: The homepage list of organizations worked with, in a two-column list under a heading.
type: reference
component: organisms/section/organizations.njk
specimens:
  - title: Organizations
    note: Live organizations. The homepage passes no heading, so the component's default applies.
    params:
      id: specimen-organizations
    bind:
      organizations: collections.organizations
    frame: p-0
inContext:
  - { url: /, label: Homepage }
---
