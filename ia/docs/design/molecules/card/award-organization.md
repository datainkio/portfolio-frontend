---
title: Award organization card
description: One awarding organization with its inline logo and a comma-separated list of the awards it gave.
type: reference
component: molecules/card/award-organization.njk
specimens:
  - title: Organization with awards
    note: The organization is real CMS data. The awards are literal titles, because a group normally comes from the groupByOrg filter.
    params:
      group:
        items:
          - { title: "Winner, eLearning" }
          - { title: "Honoree, Best Practices" }
    bind:
      group.organization: collections.awards.0.organization
    frame: max-w-xs
inContext:
  - { url: /, label: Homepage awards }
---

The macro uses `group.organization.logo.inline` for the logo and falls back to a default SVG. Its styles are fixed, with no `styles` slots.
