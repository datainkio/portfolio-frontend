---
title: Awards section
description: The homepage recognition section, a heading over awards grouped by awarding organization.
type: reference
component: organisms/section/awards.njk
specimens:
  - title: Recognition
    note: Live awards, grouped by organization through the groupByOrg filter. The inner subheading carries the fixed id "subheading".
    params:
      id: specimen-awards
    bind:
      "copy.heading": cms.home.0.recognitionHeading
      awards: collections.awards
    frame: p-0
inContext:
  - { url: /, label: Homepage }
---
