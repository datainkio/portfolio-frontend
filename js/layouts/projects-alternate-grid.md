---
description: "Legacy project-grid interaction script (category filter, modal nav, alternating column styling). Not currently loaded by any template."
type: script
status: dead-code
tags:
  - layouts
  - projects-grid
  - legacy
---

# projects-alternate-grid

Pre-choreography-system script for a project grid: category filtering,
featured-project intro animation, modal prev/next navigation, and
alternating-column styling on resize/orientation change.

## Source

- Path: `js/layouts/projects-alternate-grid.js`
- **Not referenced by any `.njk` template** — no `<script>` tag loads it
  anywhere in `views/`. Confirmed dead code as of this sidecar's writing.

## Known Issues (do not use as a reference implementation)

- References globals that are never defined in this file's scope:
  `controls`, `y_delta`, `dur`, `pos`, `categories`, `projects` (declared
  lowercase inside `init()` as `CONTROLS`, `Y_DELTA`, `DUR`, `POS`,
  `CATEGORIES`, `PROJECTS`, but used uppercase/lowercase inconsistently
  across functions).
- `PROJECTS`, `CATEGORIES` etc. are `const` inside `init()` but referenced
  by module-level functions (`onMouseOver`, `onMouseOut`, `updateNav`,
  `navigate_projects`, `showSelected`) outside that scope — would throw
  `ReferenceError` if executed.
- Predates the `js/choreography/` GSAP system — does not use `AnimationBus`
  or `AbstractSection`.

Kept as-is; flagging for whoever decides whether to delete or migrate it
into `js/choreography/`.
