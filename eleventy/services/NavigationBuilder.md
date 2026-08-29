---
description: "Service that transforms directory + Sanity data into hierarchical navigation structures, testable outside 11ty."
status: stable
tags:
  - services
aliases:
  - NavigationBuilder
links:
  - "[[README.services]]"
  - "[[navigation]]"
---

# NavigationBuilder

All navigation processing, deliberately decoupled from 11ty collection registration so it
can be unit-tested outside the build. Consumed by [[navigation]].

## Responsibilities

- Build directory navigation from `ia/` route files + frontmatter titles.
- Transform Sanity projects data into nav items.
- Assemble the hierarchical `nav_primary` tree for the registration layer.

> [!warning] Known constraints
>
> - Defensive null checks guard against `toLowerCase()` crashes; entries missing a
>   frontmatter title are filtered out to avoid null keys.
> - Hierarchy building is **O(n²)** — revisit if navigation exceeds ~100 items.
> - Logging via `@datainkio/lumberjack`, gated by the `DEBUG` env var.

## Source

- Path: `eleventy/services/NavigationBuilder.js`
