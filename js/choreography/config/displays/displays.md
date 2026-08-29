---
description: "Displays barrel — re-exports the ruler and printer-marks display configs so `config/index/index.js` can surface them through one import."
status: stable
tags:
  - barrel
  - choreography
  - config
  - displays
links:
  - "[[config/displays/ruler/ruler|config/displays/ruler/ruler]]"
  - "[[config/displays/printermarks/printermarks|config/displays/printermarks/printermarks]]"
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
