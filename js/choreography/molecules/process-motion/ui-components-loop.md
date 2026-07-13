---
id: frontend.js.choreography.molecules.process-motion.ui-components-loop
role: "Looping horizontal index-and-dwell scene for the Process section's UI-components SVG. Self-driving like blockframes: owns one repeating (`repeat: -1`) paused GSAP timeline plus one ScrollTrigger keyed by the stable id `process-uicomponents-loop`, so the loop plays only while the section is in view (start `top bottom` / end `bottom top`) and resets to the first item on leave in both scroll directions. Resolves hooks via `data-process-el` (`uicomponents` root, `uicomponents-viewport` clip, `uicomponents-track`, `uicomponents-item`). Equal-width slots: slot pitch read from the track's `data-slot-width`, falling back to the bbox delta of the first two items. Seamless wrap: duplicates the item set (clones marked `data-uicomponents-clone`, ids stripped) so translating the track by count*slotWidth lands the first clone where item 0 began — the repeat reset to x:0 is visually identical, no jump. Transform-only (`x`); index duration from `duration.base`, dwell from `duration.slow`, ease `ease.standard` (via the `motion.*` helpers). Reduced motion handled upstream by the `reduced` variant swap, so no reduced branch here. Idempotent across rebuilds: kills the prior trigger by id and drops prior clones before re-measuring. `intro()` builds the scene and returns an empty intro timeline (scroll-owned). Invoked via the `ui-components-loop` variant in process-motion.js."
status: draft
surface: internal
scope: frontend
runtime: browser
tags:
  - "#[process-motion]"
  - "#[process]"
  - "#[ui-components]"
  - "#[choreography]"
  - "#[frontend]"
  - "#[js]"
  - "#[scrolltrigger]"
  - "#[svg]"
links:
  - "[[process-motion]]"
  - "[[ui-components-loop.njk|ui-components-loop]]"
  - "[[system/gsap|system/gsap]]"
  - "[[timelines|timelines]]"
  - "[[selectors|selectors]]"
  - "[[motion|ix/motion]]"
backlinks:
  - "[[process-motion]]"
---

# ui-components-loop

Looping horizontal **index-and-dwell** scene for the Process section's
UI-components SVG. Implements
[../../../specs/animation/ui-components.animation-spec.md](../../../specs/animation/ui-components.animation-spec.md).

## Model — real artwork (not uniform slots)

The scene binds to the real Pixelmator UI-components mockup. The `HERO` group is
the moving **track**; its item children sit at fixed, **non-uniform** x across a
4898-wide canvas. An invisible `hero-start` child marks the dwell **destination
x**. Each item is aligned under hero-start by translating the track to
`heroStartX - itemX` — there is no uniform slot pitch, so the old
`data-slot-width` / `translate(i * slotWidth)` model is gone.

**Ordering.** Items are sorted by ascending x (canvas left→right). That makes the
per-item track target `heroStartX - itemX` strictly **decreasing**, so the track
only ever moves left and every item enters from the right — satisfying the spec's
"items move right→left, no direction change". (This artwork's DOM order is
spatially non-monotonic; animating in DOM order would reverse direction between
items. See the spec §SVG Hook Contract note.)

## Behavior

- **Index** — advance to the next item (translate track to `heroStartX - itemX`).
- **Dwell** — hold the current item under hero-start (`duration.slow`).
- **Loop** — `repeat: -1`; a single clone of the first item, appended one CYCLE
  to the right, makes the final-to-first wrap pixel-identical (no jump, gap,
  overlap, or direction change).

Transform-only (`x` on `uicomponents-track`). No opacity/scale/rotation.

## Lifecycle

Self-driving via its own ScrollTrigger (`process-uicomponents-loop`):

- **Initial** — paused at time 0, first item (smallest x) under hero-start.
- **Enter / EnterBack** — `tl.play()`.
- **Leave / LeaveBack** — pause + reset to the first item's target x.
- **Rebuild** — kills the prior trigger by id and removes the prior bridge clone
  before re-measuring (idempotent under matchMedia/resize).

Geometry is measured once via `getBBox()` in SVG user units (resize-invariant as
the `viewBox` scales) — no per-cycle measurement.

## Crop

The outer `<svg>` `viewBox` is set to the `CHROME` group's bbox
(`2471 548 590 606`), so the SVG's own default overflow clip is the browser
window — no separate `uicomponents-viewport` clipPath is needed.

## Hooks (`data-process-el`)

| Role | Attribute |
| --- | --- |
| SVG root (viewBox = CHROME bbox) | `uicomponents` |
| Fixed window frame (CHROME) | `uicomponents-chrome` |
| Moving track (HERO) | `uicomponents-track` |
| Item (7 HERO children) | `uicomponents-item` |
| Invisible dwell/destination marker | `uicomponents-hero-start` |

## Reduced motion

Handled upstream by the profile system swapping `process` to the `reduced`
variant. This scene owns its own reduced/static builder rather than relying on
the shared empty `reduced` factory or SVG default markup: `buildUiComponentsReduced`
`gsap.set()`s the track so the first item (smallest x) aligns under hero-start,
builds no loop and no ScrollTrigger, and drops any stale loop trigger/clone a
prior non-reduced build may have left. No inline `prefers-reduced-motion` check —
the choreography contracts reject that; the profile system is the sole authority.

## Exports

- `buildUiComponentsLoop(view)` — builds the scene, returns the paused timeline
  or `null` when hooks are absent.
- `intro(view)` — variant `buildIntro`: builds the scene, returns an empty intro
  timeline (scroll-owned).
- `buildUiComponentsReduced(view)` — pins the static resting state (first item
  highlighted, no loop); safe no-op when hooks are absent.
- `introReduced(view)` — reduced variant `buildIntro`: pins the resting state and
  returns an empty intro timeline.
