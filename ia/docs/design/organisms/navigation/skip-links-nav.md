---
title: Skip links nav
description: The skip-to-content link, the first focusable element on every page, plus an optional list of in-page section links.
type: reference
component: organisms/navigation/skip-links-nav.njk
specimens: []
specimenNote: The link is visually hidden until focused and targets the page's real main landmark, so a second copy would duplicate the page's own skip link.
inContext:
  - { url: /, label: Homepage }
  - { url: /contact/, label: Contact page }
---

Press Tab on any page to reveal it. It targets `#page-main-content`, so keep that id on every page's main element.
