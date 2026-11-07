---
title: Heading
description: A semantic h1 to h6 chosen by level, so a caller keeps the document outline correct while styling the text.
type: reference
component: atoms/heading.njk
specimens:
  - title: Section heading
    params:
      level: 2
      text: Selected work
      classes: font-display text-4xl text-neutral-100
  - title: Subheading
    note: A level outside 1 to 6 falls back to 2.
    params:
      level: 3
      text: Recent projects
      id: spec-heading-3
      classes: font-display text-xl text-neutral-300
inContext:
  - { url: /work/, label: Work page headings }
---
