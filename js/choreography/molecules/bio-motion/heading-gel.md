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

## Suspend during the outro pin

`suspendHeadingGelSync(view)` / `resumeHeadingGelSync(view)` (module-level
`WeakSet`, keyed on `view`) gate `sync()` with an early return. `BioTriggers`'
outro pin (`bio-outro-pin`) drives `scaleY` on this gel band directly as one of
its beats (see `split.md`'s outro section) — without the suspend, `sync()`
would reset `scaleY: 1` on the very next scroll tick and the expand tween would
never visibly progress. `BioTriggers` suspends on pin activate, resumes on pin
deactivate (and in `kill()`, so a matchMedia teardown mid-pin can't leave the
gel stuck), then force-refreshes the sync trigger by id so a scroll-up exit
snaps the band back to heading-height immediately rather than waiting for the
next scroll tick.

`getHeadingGelEl(gelManager)` exports the resolved gel element so the outro
timeline doesn't duplicate the `gelManager.getGel(HEADING_GEL_ID)` lookup.

Reduced motion: handled upstream — the profile system swaps bio to the `reduced`
variant, which does not call this. The band itself is a static positioned state
outside the reduced path.

Visibility caveat: `.bg-gel` sets `mix-blend-mode: multiply`. Against a very dark
backdrop inside `#background` the band can read as near-invisible; force
`mixBlendMode: "normal"` on the gel element if that happens.
