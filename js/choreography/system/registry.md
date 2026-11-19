---
description: "Runtime infrastructure — section registry mapping section IDs to their controller classes, plus helper utilities for section lookup."
status: stable
tags:
  - choreography
  - registry
  - system
links:
  - "[[Hero|Hero]]"
  - "[[BackgroundVideo|BackgroundVideo]]"
  - "[[Awards|Awards]]"
  - "[[Organizations|Organizations]]"
  - "[[Work|Work]]"
---

# registry

`SECTION_REGISTRY` maps a section key to its controller class.
`AnimationDirector` builds one controller per entry, so adding a section to
the page's motion means adding one line here, plus its entries in `EVENTS`
and `SELECTORS`.

The key is the name used in events (`hero:intro:complete`) and profiles. It
isn't always the DOM id: `hero` renders as `#manifesto` and `video` as
`#background`. `SELECTORS` ([[selectors]]) holds that mapping.

`process` is registered but its section isn't rendered on any page, so its
controller disables itself.
