---
id: frontend.js.choreography.managers.industryheadermanager
role: "Runtime manager — makes each industry section h3 behave like `position: sticky; top: <workHeaderHeight>` via a transform-only follow (no pin), so the heading rides in with its group, sticks under the live work header, then rides out with the group."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - "#frontend"
  - "#design/motion/js"
  - "#design/motion/choreography"
  - "#design/motion/choreography/manager"
  - "#design/motion/choreography/IndustryHeaderManager"
links:
  - "[[system/gsap|system/gsap]]"
  - "[[config/contracts/selectors/selectors|config/contracts/selectors]]"
  - "[[managers/WorkHeaderManager/WorkHeaderManager|WorkHeaderManager]]"
  - "[[organisms/section/work|work.njk]]"
  - "[[molecules/section/industry-section|industry-section.njk]]"
backlinks:
  - "[[AnimationDirector|AnimationDirector.js]]"
---

## Transform-follow — replacing CSS sticky

CSS `position: sticky; top: …` was removed from the industry `<h3>` elements because sticky keys off the real scroll container, which GSAP **ScrollSmoother** replaces with a transform on the content wrapper — so native sticky never engages.

It is **not** replaced with a ScrollTrigger pin. The work section nests pinned children: the `work-header-pin` (`pinSpacing:false`) and every card's `clip` pin (`pinSpacing:false`, see [[molecules/card-motion/clip|clip.js]]). A heading pinned around `pinSpacing:false` card pins has its pin duration collapsed — the cards steal scroll length from the group, so the heading released on the first card. (It also fought a second writer: the old `WorkHeaderManager` → `onWorkHeaderCollapse/Expand` animated `top` on the same `position:fixed` heading, producing the entry jump.)

Instead, a single non-pinning driver translates each heading every frame:

```js
// per heading, each onUpdate frame:
const offset     = workHeader.offsetHeight;             // live, collapses with the header
const rect       = group.getBoundingClientRect();
const naturalTop = rect.top + headingTop;               // heading top if untransformed
const maxShift   = rect.height - headingHeight - headingTop;
setY(clamp(0, maxShift, offset - naturalTop));          // translateY
```

- **`offset = workHeader.offsetHeight` (live):** the follow target tracks the collapsing work header every frame, so the heading stays flush beneath it. Nothing else writes the heading's position → no fight, no jump (fixes Symptom 1).
- **`clamp(0, maxShift, …)`:** `0` keeps it in flow before the sticky line; `maxShift` (group height − heading height − heading offset) makes it ride out with the group bottom instead of escaping. Between the two it appears fixed at `offset` (fixes Symptom 2 — geometry is read live, so the card pins can do anything to the group and the follow still tracks the real bottom).
- **No pin:** zero interference with the card `pinSpacing:false` pins and no `.pin-spacer` inserted, so the group keeps its natural in-flow height (matches sticky, which adds no space either).

## The driver

One `ScrollTrigger` on the work section, no pin, no scrub:

```js
ScrollTrigger.create({
  trigger: workSection,
  start: "top bottom",
  end:   "bottom top",
  onUpdate:  () => apply(),               // follow every smoothed scroll frame
  onRefresh: () => { measure(); apply(); }, // re-capture geometry on layout change
});
```

`measure()` resets each heading's transform to `0`, then records `headingTop` (natural distance from group top → heading top) and `headingHeight`. Reads and writes are split into separate passes to avoid layout thrash; `apply()` reads all group rects before writing any `translateY`.

## Reduced motion

The follow is positional (instant `quickSetter`, never a tween), so it is left active for all users — it reproduces a layout affordance (sticky), not decorative motion. There is no animated branch to gate.

## Notes

- Rotation/drop-shadow on the heading is owned by template/CSS, not this manager. The "header arrives rotated" and "stagger work/industry intros" behaviors are separate tasks and intentionally not wired here.
- No instantiation-order dependency on `WorkHeaderManager` anymore — the live `offset` read removes the previous coupling. `onRefresh` re-measures after card spacers/breakpoint swaps settle.
