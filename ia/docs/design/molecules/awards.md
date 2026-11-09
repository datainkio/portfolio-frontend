---
title: Awards
description: A recognition section that groups award records by organization and renders each group as an award-organization card.
type: reference
component: molecules/awards.njk
specimens:
  - title: Project recognition
    note: Nine awards from one case study, grouped by the organization that gave them.
    bind:
      awards: collections.projectPages.slug=live-hope-love.awards
inContext:
  - { url: /case-studies/live-hope-love/, label: Live Hope Love case study }
---

Renders nothing when `awards` is empty. The section heading and the `awards-heading` id come from the section frame, so use one instance per page.
