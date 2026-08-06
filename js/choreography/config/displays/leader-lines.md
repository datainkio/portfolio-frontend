---
id: frontend.js.choreography.config.displays.leader-lines
role: "Leader-line socket + style config consumed by LineManager. Currently DEAD — no live importer, and its own `SELECTORS` import points at a path that no longer exists."
status: deprecated
surface: internal
scope: frontend
runtime: browser
tags:
  - choreography
  - config
  - dead-code
  - displays
  - frontend
  - js
  - leader-lines
links:
  - "[[managers/LineManager|managers/LineManager]]"
  - "[[config/ix/motion|config/ix/motion]]"
backlinks:
  - "[[managers/LineManager|managers/LineManager]]"
---

## What it defines

- `SOCKETS` — per-section origin/terminus anchor pairs. Each socket carries
  `element` (selector), `x`/`y` (anchor percentages for `LeaderLine.pointAnchor`),
  and an optional `scope` query root.
- `LINE_STYLES` — visual tokens for the connector lines.
- `BIO_SUB_SECTION_LINE_DEFAULTS` — bio-specific overrides.

## Status: dead

Two independent signals:

1. **No live importer.** The only file that imports it is
   [[managers/LineManager|LineManager.js]], which is itself unimported.
   `displays.js` re-exports `ruler` and `printermarks` only — never this file.
2. **Broken import.** Line 14 imports `../contracts/selectors.js`. The real path
   is `../contracts/selectors/selectors.js`. Loading this module today throws.

Resolve by deleting both this file and `LineManager.js`, or by fixing the
selectors path and wiring `LineManager` into `AnimationDirector`. Do not treat
the current contents as an accurate description of live behavior.
