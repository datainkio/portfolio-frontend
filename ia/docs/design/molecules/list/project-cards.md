---
title: Project cards list
description: A grid of project cards, one per list item, wired for the Work page's scroll choreography.
type: reference
component: molecules/list/project-cards.njk
specimens:
  - title: Projects
    params:
      projects:
        - title: Council for Diversity, Equity, and Inclusion
          url: /case-studies/council-for-diversity-equity-inclusion/
          abstract: A formal internal group that advances inclusion across the company.
          organization:
            - { title: Bixal }
          activityTitles: [Research, Facilitation]
        - title: Enquos
          url: /case-studies/enquos/
          abstract: A product built for a small team.
          organization:
            - { title: Enquos }
          activityTitles: [Design systems]
inContext:
  - { url: /work/, label: Work page }
---

The list sets its own card classes and ignores any `classes` param, although the Work page passes one.
