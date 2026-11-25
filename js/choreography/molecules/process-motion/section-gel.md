---
description: "Process molecule part — anchors the gel_process gel behind the entire process section as a full-bleed band (viewport width, section height, section y) and keeps it synced on scroll and resize. Scoped to the whole section root rather than a single element. The gel is never ScrollTrigger-pinned: it is a child of the fixed-positioned #sizzle-background container, so it is already held in the viewport."
status: stable
tags:
  - choreography
  - process-motion
  - process
  - gel
links:
  - "[[managers/GelAnimationManager/GelAnimationManager|GelAnimationManager]]"
---

`attachSectionGel(view, gelManager)` resolves `gel_process` from the manager,
then positions it against the process section root's own
`getBoundingClientRect()` — `left: 0 / width: 100vw / top: <section viewport
top> / height: <section height>` — and reveals it (`autoAlpha: 1` —
`GelAnimationManager` parks every gel at 0). There
is no inner-element selector: `view` itself is the sync target, so the band
covers the full process section rather than a single heading.

The gel is `absolute` inside `#sizzle-background`, which is `fixed inset-0`, so
its coordinates resolve against the viewport and no scroll offset is added to
`top`. A fixed container does not scroll with the section, so a ScrollTrigger
(`id: process-section-gel-sync`, `top bottom` → `bottom top`) re-syncs on
`onUpdate` / `onRefresh` / `onToggle`. The trigger is killed by id before being
recreated, so matchMedia/resize rebuilds do not stack duplicates.

## Never pinned

"Anchors" is positional language, not `ScrollTrigger`'s `pin`. This gel is a
child of `#sizzle-background` (`fixed inset-0`) — already viewport-positioned,
so it must never be a pin target. `process-section-gel-sync` sets no `pin`
(defaults `false`); it only rewrites `top`/`height`.

`gel.refresh()` (SVG mask re-measure) runs only when the section height
changes, not on every scroll tick.

Visibility caveat: `.gel` sets `mix-blend-mode: multiply`. Against a very
dark backdrop inside `#sizzle-background` the band can read as near-invisible;
force
`mixBlendMode: "normal"` on the gel element if that happens.

## Reduced motion

The `reduced` process variant never calls this, so the gel stays parked at `autoAlpha: 0` (`GelAnimationManager`'s default). No explicit disable step is needed. The band is a static positioned state, not an animation.
