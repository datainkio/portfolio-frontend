---
description: "Public surface of the CMS services layer — the single import point Eleventy uses to fetch Sanity content."
status: stable
tags:
  - cms
  - services
aliases:
  - Services public API
links:
  - "[[data/sanity/services/README|services]]"
  - "[[sanityService]]"
---

# Services public API

Public surface of the CMS services layer — the single import point for Eleventy.

```js
export { init } from "./sanityService.js";
```

## Source

- Path: `data/sanity/services/index.js`

Related: [[data/sanity/services/README|services]], [[sanityService]]
