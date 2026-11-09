---
title: Preloader
description: The full-screen loading overlay with the hanko mark and name, shown on the homepage until the landing sequence removes it.
type: reference
component: organisms/status/preloader.njk
specimens: []
specimenNote: It is a fixed full-viewport overlay with the id "preloader", and only Preloader.js removes it, so a specimen would cover this page.
inContext:
  - { url: /, label: Homepage }
---

Don't rename the `data-preloader` hooks. The boot sequence waits on them.
