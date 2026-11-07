---
title: Design decisions
description: A section listing a project's design decisions as a grid of design-decision cards.
type: reference
component: molecules/design-decisions.njk
specimens:
  - title: Project decisions
    note: Six decisions from one case study.
    bind:
      decisions: collections.projectPages.3.decisions
inContext:
  - {
      url: /case-studies/connecting-a-world-famous-dj-with-his-fans/,
      label: A case study's evidence plates,
    }
---

Renders nothing when `decisions` is empty. The heading id `design-decisions-heading` comes from the section frame.
