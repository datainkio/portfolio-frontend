---
title: Award
description: The title of a single award, rendered as plain text for a list item that the caller wraps and styles.
type: reference
component: atoms/award.njk
specimens:
  - title: Award record
    note: A real award record from the build data, as the awards section passes it.
    params: {}
    bind:
      title: collections.awards.0.title
  - title: Fallback
    note: With no title it falls back to a placeholder.
    params: {}
inContext:
  - { url: /, label: Homepage awards section }
---
