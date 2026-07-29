---
id: frontend.js.choreography.molecules.bio-motion.heading-gel
role: "Bio molecule part — pins the gel_hero gel behind the bio <h2> as a full-bleed band (viewport width, heading height, heading y) and keeps it synced on scroll and resize."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - choreography
  - frontend
  - bio-motion
  - gel
  - js
  - molecule
links:
  - "[[config/contracts/selectors/selectors|config/contracts/selectors]]"
  - "[[managers/GelAnimationManager/GelAnimationManager|GelAnimationManager]]"
backlinks:
  - "[[molecules/bio-motion/split|molecules/bio-motion/split]]"
---

`attachHeadingGel(view, gelManager)` resolves `gel_hero` from the manager and
`[data-bio-el="heading"]` from the bio section root, then positions the gel to
`left: 0 / width: 100vw / top: <heading viewport top> / height: <heading height>`
and reveals it (`autoAlpha: 1` — `GelAnimationManager` parks every gel at 0).

The gel is `absolute` inside `#background`, which is `fixed inset-0`, so its
coordinates resolve against the viewport and no scroll offset is added to `top`.
A fixed container does not scroll with the heading, so a ScrollTrigger
(`id: bio-heading-gel-sync`, `top bottom` → `bottom top`) re-syncs on
`onUpdate` / `onRefresh` / `onToggle`. The trigger is killed by id before being
recreated, so matchMedia/resize rebuilds do not stack duplicates.

`gel.refresh()` (SVG mask re-measure) runs only when the heading height changes,
not on every scroll tick.

Reduced motion: handled upstream — the profile system swaps bio to the `reduced`
variant, which does not call this. The band itself is a static positioned state,
not an animation.

Visibility caveat: `.bg-gel` sets `mix-blend-mode: multiply`. Against a very dark
backdrop inside `#background` the band can read as near-invisible; force
`mixBlendMode: "normal"` on the gel element if that happens.
