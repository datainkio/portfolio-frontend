---
id: frontend.js.choreography.molecules.process-motion.ui-components-loop
role: "Looping horizontal index-and-dwell (coverflow) scene for the Process section's UI-components SVG. Self-driving like blockframes: owns one repeating (`repeat: -1`) paused GSAP timeline plus one ScrollTrigger keyed by the stable id `process-uicomponents-loop`, so the loop plays only while the section is in view (start `top bottom` / end `bottom top`) and resets to the first item on leave in both scroll directions. Resolves hooks via `data-process-el` (`uicomponents` root, `uicomponents-chrome`, `uicomponents-track`, `uicomponents-item`, `uicomponents-hero-start`). The authored items sit at scattered, non-uniform x, so `measure()` re-packs them to a UNIFORM pitch `P` (const `ITEM_PITCH`, 560) with a one-time per-item `translate` (item k → bbox x `heroStartX + k*P`), making neighbors spatially adjacent so the preceding/following items peek in beyond the chrome edges. Track target for item k is `-k*P` (monotonically decreasing → every item enters from the right, no direction change); `firstTarget = 0`, `cycle = N*P`. Seamless wrap: one clone of item 0 placed at slot N (`translate(heroStartX - authoredX0 + cycle, 0)`, marked `data-uicomponents-clone`, ids stripped); track advancing to `bridgeTarget = -N*P` lands it under hero-start, pixel-identical to item 0, so the repeat reset to `firstTarget` shows no jump. Transform (`x` on track) plus position-driven per-item opacity — each item and the bridge clone fade with distance from focus (`fadeOpacity`, tent 1→0 over `FADE_RANGE`, default = `ITEM_PITCH`), applied every tick from the timeline `onUpdate` via one `quickSetter` per element, so items fade in approaching from the right, hold full opacity at the dwell, and fade out exiting left; index duration from `duration.base`, dwell from `duration.slow`, ease `ease.standard` (via the `motion.*` helpers). Reduced motion handled upstream by the `reduced` variant swap (which also runs `measure()`, so the repack applies statically). Idempotent across rebuilds: kills the prior trigger by id, drops prior clones, and strips each item's prior repack transform before re-measuring. `intro()` builds the scene and returns an empty intro timeline (scroll-owned). Invoked via the `ui-components-loop` variant in process-motion.js."
status: draft
surface: internal
scope: frontend
runtime: browser
tags:
  - process-motion
  - process
  - ui-components
  - choreography
  - frontend
  - js
  - scrolltrigger
  - svg
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

## Model — uniform-pitch repack + widened viewport (coverflow peek)

The scene binds to the real Pixelmator UI-components mockup. The `HERO` group is
the moving **track**; its item children are authored at fixed, **non-uniform**,
scattered x across a wide canvas (e.g. image-card ≈ 666, team ≈ 4376), so a
neighbor sits thousands of units off-crop — only one item would ever show. An
invisible `hero-start` child marks the **focus/destination x** (chrome center,
read once).

**Re-pack to a uniform pitch.** `measure()` translates each item (one-time
transform) to a uniform slot pitch `P` (`ITEM_PITCH`, 560): item k (sorted by
authored x) is moved so its bbox x becomes `heroStartX + k*P`. Neighbors then sit
exactly `P` apart, so the preceding and following items peek in **beyond the
chrome edges** once the viewBox is widened — the coverflow look. This is
transform-only; authored path coords are untouched.

**Ordering / direction.** Items are sorted by ascending authored x. Post-repack
the per-item track target is `-k*P`, strictly **decreasing**, so the track only
ever moves left and every item enters from the right — the spec's "items move
right→left, no direction change".

**Idempotency.** Before `getBBox()`, `measure()` strips each item's prior repack
`transform` (item groups carry no authored transform, so this is safe) and removes
any prior bridge clone — so matchMedia/resize rebuilds always re-measure authored
coords.

### Tuning knobs

| Knob | Where | Effect |
| --- | --- | --- |
| Peek amount | `.njk` `viewBox` width + x0 (keep center = 2766) | How much of each neighbor is revealed beyond chrome. Current `viewBox="2171 548 1190 606"` reveals ~300 units each side. |
| Neighbor gap from chrome | `ITEM_PITCH` const (`P`) | Distance of neighbors from the chrome frame. Keep `P ≥ ~555`: HERO renders ON TOP of CHROME (last group), so a smaller `P` would let a neighbor overlap the chrome frame. |
| Fade width | `FADE_RANGE` const (default `ITEM_PITCH`) | Distance from focus over which an item fades 1→0. Larger = neighbors stay visible longer / fade more gently; smaller = tighter spotlight on the focused item. |

## Behavior

- **Index** — advance to the next item (translate track to `-k*P`).
- **Dwell** — hold the current item under hero-start (`duration.slow`).
- **Loop** — `repeat: -1`; a single clone of the first item, placed at slot N
  (one CYCLE = `N*P` right), makes the final-to-first wrap pixel-identical (no
  jump, gap, overlap, or direction change).
- **Fade** — each item + the bridge clone fades 0→1→0 by distance from focus
  (`fadeOpacity`, tent over `FADE_RANGE`): fade in approaching from the right,
  full opacity at the dwell, fade out exiting left. Applied every tick from the
  timeline `onUpdate` (one `quickSetter` per element); seeded once for the paused
  resting frame.

Animates `x` on `uicomponents-track` + per-item `opacity` (both
compositor-friendly). Opacity is set on the item **group** — inner authored path
opacities are untouched and multiply under it.

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

The outer `<svg>` `viewBox` is the `CHROME` bbox **widened symmetrically** about
its center (2766): `viewBox="2171 548 1190 606"` (was `2471 548 590 606`). The
extra ~300 units on each side reveal the peeking neighbors while the chrome window
stays the fixed center focus frame. Center is preserved, so `preserveAspectRatio="xMidYMid meet"`
still lands the chrome dead-center. The stage is height-driven (`h-48`, svg
`w-auto`), so the wider viewBox renders as a genuinely wider box at the same
height — items keep their size. No separate `uicomponents-viewport` clipPath.

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
applies the same position-driven opacity **once** statically (item 0 at focus =
opacity 1, neighbors dimmed in the peek margins), builds no loop and no
ScrollTrigger, and drops any stale loop trigger/clone a prior non-reduced build
may have left. No inline `prefers-reduced-motion` check —
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
