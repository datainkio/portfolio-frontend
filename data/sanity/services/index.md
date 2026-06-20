---
id: frontend.cms.services.index
role: "services"
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Services public API"
tags:
  - "#frontend/cms"
  - "#frontend/cms/services"
links:
  - "[[README.services]]"
  - "[[sanityService]]"
---

# Services public API

Public surface of the CMS services layer — the single import point for Eleventy.

```js
export { init } from "./sanityService.js";
```

## Source

- Path: `data/sanity/services/index.js`

Related: [[README.services]], [[sanityService]]
