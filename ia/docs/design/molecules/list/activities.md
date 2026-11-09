---
title: Activities list
description: A comma-separated inline list of a project's activity titles. Use it where deliverables read as a single line of text.
type: reference
component: molecules/list/activities.njk
specimens:
  - title: Literal activities
    params:
      activities:
        - { title: Design systems }
        - { title: Prototyping }
        - { title: Front-end development }
    surface: paper
  - title: From a project
    note: Bound to a real project's activities.
    bind:
      activities: "collections.projectPages.slug=council-for-diversity-equity-inclusion.activities"
inContext:
  - { url: /work/, label: Work page }
---

The list renders nothing when `activities` is missing, so callers can pass it unguarded.
