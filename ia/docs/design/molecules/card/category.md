---
title: Category card
description: A card for one category, listing its projects and the awards those projects earned.
type: reference
component: molecules/card/category.njk
specimens:
  - title: Category with no projects
    note: Category cards need project ids that resolve in the projects collection. This one shows the frame and the Outcomes heading alone.
    params:
      category:
        slug: specimen-category
        title: Healthcare
        projects: []
    bind:
      collections: collections
    frame: max-w-md
---

Nothing renders this on a live page at present. Its `id` comes from the category slug.
