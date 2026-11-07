---
title: Article nav links
description: An "On this page" list of jump links to an article's headings, collapsible on small screens.
type: reference
component: molecules/navigation/article-nav-links.njk
specimens:
  - title: Headings
    note: Docs pages don't load the toggle script, so the small-screen button does nothing here.
    params:
      headings:
        - { id: context, text: Context }
        - { id: approach, text: Approach }
        - { id: outcome, text: Outcome }
    frame: max-w-xs
inContext:
  - { url: /docs/design/, label: Article layout }
---

Get `headings` from the `extractHeadings` filter on the article body. The component renders nothing when the list is empty.
