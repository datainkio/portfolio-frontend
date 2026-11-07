---
title: Project metadata
description: A stats list of a project's clients, roles, industry, deliverables, and recognition. Rows without a value are skipped.
type: reference
component: molecules/project-metadata/project-metadata.njk
specimens:
  - title: From a project
    bind:
      project: "collections.projectPages.2"
    params:
      aria: Project metadata
      classes: grid gap-6 md:grid-cols-2 text-neutral-400
      styles:
        term: text-slate-400
inContext:
  - { url: /case-studies/enquos/, label: A project page }
---
