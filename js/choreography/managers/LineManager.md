---
id: frontend.js.choreography.managers.linemanager
role: "Leader-line connector manager — draws, positions, and tears down LeaderLine SVG connectors between section anchors. Currently DEAD: no importer anywhere in the choreography package."
status: deprecated
surface: internal
scope: frontend
runtime: browser
tags:
  - choreography
  - dead-code
  - frontend
  - js
  - leader-lines
  - manager
links:
  - "[[config/displays/leader-lines|config/displays/leader-lines]]"
  - "[[AnimationDirector|AnimationDirector]]"
backlinks:
  - "[[config/displays/leader-lines|config/displays/leader-lines]]"
---

## Public surface

| Method | Role |
| --- | --- |
| `initialize()` | Resolve sockets, create the LeaderLine instances |
| `connect(originSocketKey, terminusSocketKey, options)` | Draw one connector between two configured sockets |
| `showLine(lineRef, options)` | Reveal a single line |
| `hideAllLines(effect)` | Hide every line, optionally with a transition |
| `positionLines()` | Re-measure and reposition all connectors |
| `reset()` / `destroy()` | Teardown; `destroy()` also unbinds scroll/resize listeners |

Internals (`_resolveAnchor`, `_normalizeSocketKey`, `_resolveSocketElement`,
`_applyLineClasses`, `_bindPositionListeners`, …) handle selector resolution and
the third-party LeaderLine instance lifecycle.

## Status: dead

`AnimationDirector` does not construct it and nothing else imports it — it is not
part of the boot sequence. Its config dependency
[[config/displays/leader-lines|leader-lines.js]] is likewise unreferenced and
carries a broken `SELECTORS` import path, so this module would throw on load in
its current state.

Treat as an unwired experiment. Either delete both files, or fix the selectors
path and register the manager in `AnimationDirector` alongside the other managers
before relying on anything documented above.
