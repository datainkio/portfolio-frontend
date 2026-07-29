---
id: frontend.js.choreography.molecules.bio-motion.overview-gel
role: "Bio molecule part — pins the gel_subheading gel behind the bio overview <h3> as a full-bleed band (viewport width, heading height, heading y) and keeps it synced on scroll and resize. Mirrors heading-gel.js for the <h2>."
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
  - "[[molecules/bio-motion/heading-gel|molecules/bio-motion/heading-gel]]"
backlinks:
  - "[[molecules/bio-motion/split|molecules/bio-motion/split]]"
---

`attachOverviewGel(view, gelManager)` resolves `gel_subheading` from the
manager (the gel element's DOM id predates this rename — left as-is since the
template/background layer wasn't asked to change) and `[data-bio-el="overview"]`
from the bio section root, then positions the gel to `left: 0 / width: 100vw /
top: <overview heading viewport top> / height: <overview heading height>` and
reveals it (`autoAlpha: 1` — `GelAnimationManager` parks every gel at 0).

The gel is `absolute` inside `#background`, which is `fixed inset-0`, so its
coordinates resolve against the viewport and no scroll offset is added to `top`.
A fixed container does not scroll with the heading, so a ScrollTrigger
(`id: bio-overview-gel-sync`, `top bottom` → `bottom top`) re-syncs on
`onUpdate` / `onRefresh` / `onToggle`. The trigger is killed by id before being
recreated, so matchMedia/resize rebuilds do not stack duplicates.

`gel.refresh()` (SVG mask re-measure) runs only when the heading height
changes, not on every scroll tick.

Reduced motion: handled upstream — the profile system swaps bio to the
`reduced` variant, which does not call this. The band itself is a static
positioned state, not an animation.

Visibility caveat: `.bg-gel` sets `mix-blend-mode: multiply`. Against a very
dark backdrop inside `#background` the band can read as near-invisible; force
`mixBlendMode: "normal"` on the gel element if that happens.
