---
id: frontend.cms.services.sanity
role: "Build orchestration: client init, iterate CMS_QUERIES, dispatch transforms, register collections."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "sanityService"
tags:
  - cms
  - services
links:
  - "[[README.services]]"
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

## Source

- Path: `data/sanity/services/sanityService.js`

Related: [[README.services]], [[fetchSanityData]], [[queries]]
