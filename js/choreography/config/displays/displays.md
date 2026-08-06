---
id: frontend.js.choreography.config.displays
role: "Displays barrel — re-exports the ruler and printer-marks display configs so `config/index/index.js` can surface them through one import."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - barrel
  - choreography
  - config
  - displays
  - frontend
  - js
links:
  - "[[config/displays/ruler/ruler|config/displays/ruler/ruler]]"
  - "[[config/displays/printermarks/printermarks|config/displays/printermarks/printermarks]]"
  - "[[config/index/index|config/index/index]]"
backlinks:
  - "[[config/index/index|config/index/index]]"
---

## Purpose

Two-line re-export barrel. Everything under `config/displays/` that is part of
the public config surface is funnelled through here, and `config/index/index.js`
re-exports this file in turn.

## Contents

```js
export * from "./ruler/ruler.js";
export * from "./printermarks/printermarks.js";
```

## Note

`leader-lines.js` sits in this folder but is deliberately **not** re-exported —
it is unreferenced dead config. See [[config/displays/leader-lines|leader-lines]].
