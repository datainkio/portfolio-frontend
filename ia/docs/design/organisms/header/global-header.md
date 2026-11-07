---
title: Global header
description: The fixed site header with the home link, document number, section title, build info, and primary nav.
type: reference
component: organisms/header/global-header.njk
specimens: []
specimenNote: This page already renders the global header with the id "global-header", and the component starts hidden until scripting reveals it, so a second copy would collide and look blank.
inContext:
  - { url: /, label: Homepage }
  - { url: /work/, label: Work page }
---

The caller passes `logoSvg`, `docNo`, `sectionTitle`, `cms`, `pages`, `currentUrl`, `buildDate`, and `buildVersions`. It embeds the primary nav, so it carries that nav's duplicate id.
