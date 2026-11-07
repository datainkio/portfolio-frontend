---
title: Build info
description: The build date button and its drawer of git, Eleventy, Sanity, and Figma versions, shown from the global header.
type: reference
component: molecules/list/build-info.njk
specimens: []
specimenNote: The drawer is absolutely positioned behind the header, starts hidden until the choreography bundle opens it, and uses a fixed id the header already emits, so a live specimen would collide.
inContext:
  - { url: /, label: Homepage header }
---

Pass `buildDate` and `buildVersions` as the base layout does, from the `buildDate` and `buildVersions` data. Docs pages don't load the choreography bundle, so the drawer would stay closed.
