---
title: Strategy
description: "How motion is organised on the site: the lifecycle every section follows, and the reduced-motion policy every animation honours."
type: index
---

Two ideas hold the system together. Sections never call each other: each one
announces what it's doing on a shared event bus, and a small sequence listens
and cues the next step. And motion is an enhancement: every animation has a
reduced-motion path, and the page reads correctly without any of it.

- **[Lifecycle](lifecycle/)**: the boot gate, the four timeline phases, and
  the events a section emits.
- **[Accessibility](accessibility/)**: the rules, the settings, and which
  modules document their reduced-motion behaviour.
