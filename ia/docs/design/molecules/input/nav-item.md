---
title: Nav item
description: One entry in a navigation list, either a plain link or a native details disclosure when it has children.
type: reference
component: molecules/input/nav-item.njk
specimens:
  - title: Plain link
    params:
      item: { key: Work, url: /work/, children: [] }
    frame: max-w-xs
  - title: With children
    note: A native details and summary pair, open by default and keyboard operable without scripting.
    params:
      accordionName: specimen-nav
      item:
        key: Docs
        url: /docs/
        children:
          - { key: Design Docs, url: /docs/design/ }
          - { key: IA Docs Hub, url: /docs/ia/ }
    frame: max-w-xs
---

The macro renders only an `li`. The caller supplies the surrounding list, and a shared `accordionName` makes sibling disclosures behave as an accordion.
