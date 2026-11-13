---
description: "Build orchestration: client init, iterate CMS_QUERIES, dispatch transforms, register collections."
status: stable
tags:
  - cms
  - services
aliases:
  - sanityService
links:
  - "[[data/sanity/services/README|services]]"
  - "[[fetchSanityData]]"
  - "[[queries]]"
---

# sanityService

Build orchestration for CMS data. Initializes the client, runs every query in `CMS_QUERIES`,
dispatches the matching transform, and registers the result as an Eleventy collection.

```js
export async function init(eleventyConfig, site) { … }
```

> [!important] Pipeline
> client init → for each query in [[queries]]: [[fetchSanityData]] → transform → `addCollection`.

The `home` query is the one transform that awaits a network step: its records go
through `normalizeLandingRecords`, then `hydrateStatementInlineSvgs` (in
[home transforms](../transforms/home.md)), which fetches SVG statement images at
build time. A fetch failure leaves that statement on its `<img>` fallback.

## Source

- Path: `data/sanity/services/sanityService.js`

Related: [[data/sanity/services/README|services]], [[fetchSanityData]], [[queries]]
