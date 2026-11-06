---
description: Fixed jump-nav to the industry groups in the work section.
type: template
---

# Industry Nav

Fixed-position drawer that links to each industry group in the work section. Renders nothing when `industries` is empty.

The jump-nav `<nav>` is `position: fixed`. It renders in `sidebarBefore`, inside `#page-main` but outside `#page-main-content`, ahead of `<main>` in source order. ScrollSmoother transforms `<main>`, and a fixed element inside a transformed ancestor is positioned against that ancestor, not the viewport. Keep it outside `<main>`.

Used by `views/pages/projects/projects.njk`.

## Params

| Param        | Type  | Description                                                                                                      |
| ------------ | ----- | ---------------------------------------------------------------------------------------------------------------- |
| `industries` | array | Industry groups, passed to `molecules/list/industry-links.njk`. The nav renders nothing when the array is empty. |

Fixed design: takes no styling params.
