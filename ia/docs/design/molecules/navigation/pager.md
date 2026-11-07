---
title: Pager
description: Previous, all, and next navigation between sibling pages. A missing neighbour becomes a greyed placeholder that keeps the layout.
type: reference
component: molecules/navigation/pager.njk
specimens:
  - title: Both neighbours
    params:
      label: Case studies
      previous: { href: /work/, title: Previous project, meta: Client name }
      next: { href: /about/, title: Next project, meta: Client name }
      all: { href: /work/, label: All }
  - title: First page
    note: Without a previous link, a placeholder holds the column.
    params:
      label: Chapters
      next: { href: /about/, title: Chapter two }
      all: { href: /work/, label: Contents }
inContext:
  - { url: /case-studies/enquos/, label: A project page }
---

Give each pager on a page a distinct `label`, since it names the navigation landmark.
