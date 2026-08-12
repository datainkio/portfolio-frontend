---
id: frontend.js.choreography.molecules.bio-motion.overview-gel
role: "Bio molecule part — anchors the gel_subheading gel behind the bio overview <h3> as a full-bleed band (viewport width, heading height, heading y) and keeps it synced on scroll and resize. Mirrors heading-gel.js for the <h2>. The gel is never ScrollTrigger-pinned: it is a child of the fixed-positioned #sizzle-background container, so it is already held in the viewport."
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

The gel is `absolute` inside `#sizzle-background`, which is `fixed inset-0`, so
its coordinates resolve against the viewport and no scroll offset is added to
`top`. A fixed container does not scroll with the heading, so a ScrollTrigger
(`id: bio-overview-gel-sync`, `top bottom` → `bottom top`) re-syncs on
`onUpdate` / `onRefresh` / `onToggle`. The trigger is killed by id before being
recreated, so matchMedia/resize rebuilds do not stack duplicates.

Unlike [heading-gel](heading-gel.md), this band **still tracks scroll**, and that
is deliberate rather than an oversight: the heading band became a full-viewport
plane with nothing left to follow, while this one is a text-height band whose
whole job is to stay behind a `<h3>` that travels through the viewport. The
per-tick `getBoundingClientRect()` is the cost of that.

## Suspend contract

`suspendOverviewGelSync(view)` / `resumeOverviewGelSync(view)` (module-level
`WeakSet`, keyed on `view`) gate `sync()` with an early return, mirroring
`heading-gel.js`. [mission-statement.js](mission-statement.md) uses them: its
reveal wipes the band in (`scaleX 0 → 1`) and `sync()` would reset both `scaleX`
and `autoAlpha` on the next scroll tick. It suspends before building, and the
wipe's own `onComplete` resumes and force-refreshes by `OVERVIEW_SYNC_ST_ID`.

`getOverviewGelEl(gelManager)` exports the resolved element so callers don't
duplicate the `getGel(OVERVIEW_GEL_ID)` lookup.

**`attachOverviewGel` is no longer called from `split.js` directly** — the
mission-statement reveal owns the call, since the band's arrival is that
reveal's first beat.

## Never pinned

"Anchors" is positional language, not `ScrollTrigger`'s `pin`. This gel is a
child of `#sizzle-background` (`fixed inset-0`) — already viewport-positioned,
so it must never be a pin target. `bio-overview-gel-sync` sets no `pin`
(defaults `false`); it only rewrites `top`/`height`. See
[heading-gel.md](heading-gel.md#never-pinned) for the full rationale.

`gel.refresh()` (SVG mask re-measure) runs only when the heading height
changes, not on every scroll tick.

Reduced motion: handled upstream — the profile system swaps bio to the
`reduced` variant, which does not call this. The band itself is a static
positioned state, not an animation.

Visibility caveat: `.bg-gel` sets `mix-blend-mode: multiply`. Against a very
dark backdrop inside `#sizzle-background` the band can read as near-invisible;
force
`mixBlendMode: "normal"` on the gel element if that happens.
