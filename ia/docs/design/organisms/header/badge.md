---
title: Badge
description: The fixed top-left button that opens the full-bleed site map, with the build info and a close button.
type: reference
component: organisms/header/badge.njk
specimens: []
specimenNote: This page already renders the badge, whose dialog has the id "badge-dialog", and the badge starts hidden until scripting reveals it, so a second copy would collide and look blank. Use the badge at the top left of this page.
inContext:
  - { url: /, label: Homepage }
  - { url: /work/, label: Work page }
---

The caller passes `logoSvg`, `pages`, `currentUrl`, `buildDate`, and `buildVersions`. It replaced the global header on 2026-11-17.
