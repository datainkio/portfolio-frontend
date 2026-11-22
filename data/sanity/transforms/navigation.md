---
description: Resolve hrefs/labels and normalize navigation records.
status: stable
tags:
  - cms
  - transforms
aliases:
  - Navigation transforms
links:
  - "[[data/sanity/transforms/README|transforms]]"
---

# Navigation transforms

Pure, stateless normalization between raw Sanity results and Eleventy collections — the semantic
work GROQ can't do (URL resolution from slug trees, Portable Text → HTML, inline SVG, safe defaults).

| Export                                | Purpose                                        |
| ------------------------------------- | ---------------------------------------------- |
| `resolveNavigationHref(item)`         | compute an item's href                         |
| `resolveNavigationLabel(item)`        | compute an item's label                        |
| `normalizeNavigationItems(items)`     | shape nav items; warns on each item it drops   |
| `normalizeNavigationRecords(records)` | shape nav records; warns when a group is empty |

## Warnings

Warnings go through the lumberjack logger with a `[navigation]` prefix. An item whose `_type` has no
URL (unhandled type, or a slug-less `project`) is still dropped, but one warning names its `_type`,
`_id` and label. A record whose normalized `headerItems` or `footerItems` is empty gets one warning
naming that group.

## Source

- Path: `data/sanity/transforms/navigation.js`

Related: [[data/sanity/transforms/README|transforms]]
