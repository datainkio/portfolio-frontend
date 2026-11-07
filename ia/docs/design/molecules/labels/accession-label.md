---
title: Accession label
description: A small document-style label with an index, title, description, and scope, used as an archive caption.
type: reference
component: molecules/labels/accession-label.njk
specimens:
  - title: Full label
    params:
      index: "03"
      title: Work with Purpose
      description: Russ Lebo / Selected Works Archive
      scope: 2008-2026
    frame: max-w-md
  - title: Without a title
    note: The home hero passes an empty title, which drops the first row.
    params:
      description: Russell Lebo / Selected Works Archive
      scope: 2008-2026
    frame: max-w-md
inContext:
  - { url: /, label: Homepage hero }
  - { url: /work/, label: Work page header }
---

The label is a description list, so keep `index` and `title` short.
