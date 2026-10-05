---
description: "Contracts barrel — re-exports events, selectors, and timelines (EVENTS, makeSectionEvents, SELECTORS and the *_SELECTORS maps, TIMELINE_IDS) so config/index/index.js can surface them through one import."
status: stable
tags:
  - barrel
  - choreography
  - config
links:
  - "[[events|events]]"
  - "[[selectors|selectors]]"
  - "[[timelines|timelines]]"
  - "[[README.contracts|README.contracts]]"
---

# contracts

Three-line re-export barrel for `contracts/`:

```js
export * from "./events/events.js";
export * from "./selectors/selectors.js";
export * from "./timelines/timelines.js";
```
