---
title: Work section
description: The homepage work section, a heading over the project cards for the featured projects.
type: reference
component: organisms/section/work.njk
specimens:
  - title: Featured projects
    note: The home singleton's featured projects, as the homepage passes them. Cards start in their pre-motion state on docs pages.
    params:
      id: specimen-work
    bind:
      "copy.heading": cms.home.0.workHeading
      "copy.body": cms.home.0.workBodyHtml
      projects: collections.home.0.featuredProjects
    frame: p-0 max-h-[40rem] overflow-y-auto
inContext:
  - { url: /, label: Homepage }
  - { url: /work/, label: Work page }
---

The section styles the heading and hands the cards to `molecules/list/project-cards`. `groupProjects` and `body` are read but not rendered.
