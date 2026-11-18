---
title: Build view
description: The build date button and its drawer of build versions, shown in the site-map bar of the badge.
type: reference
component: organisms/status/build-view/build-view.njk
specimens: []
specimenNote: It emits the fixed id "build-info-list", which the badge on this page already emits, and the drawer stays hidden without the choreography bundle, which docs pages don't load.
inContext:
  - { url: /, label: Homepage site-map badge }
---

The drawer slides out of the badge's site-map bar. Its parameters are `buildDate`, `buildVersions`, and `classes`.
