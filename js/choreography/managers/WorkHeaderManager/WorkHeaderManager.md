---
id: frontend.js.choreography.managers.workheadermanager
role: "Runtime manager — collapses and expands the work section jumplinks nav on scroll direction change. The section header (h2) stays visible; only the industry jumplinks animate. ScrollTrigger is scoped to the work section so the behavior is inactive outside it. Notifies IndustryHeaderManager via callback to keep industry heading sticky-top values in sync on collapse and expand."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - "#frontend"
  - "#design/motion/js"
  - "#design/motion/choreography"
  - "#design/motion/choreography/manager"
  - "#design/motion/choreography/WorkHeaderManager"
links:
  - "[[managers.workheadermanager|WorkHeaderManager.njk]]"
  - "[[system/gsap|system/gsap]]"
  - "[[config/ix/motion/motion|config/ix/motion]]"
  - "[[config/contracts/selectors/selectors|config/contracts/selectors]]"
  - "[[organisms/section/work|work.njk]]"
  - "[[managers/IndustryHeaderManager/IndustryHeaderManager|IndustryHeaderManager]]"
backlinks:
  - "[[layouts/work-landing-header|work-landing-header.js]]"
---

The work section header pin is in [WorkTriggers.js](../../organisms/Work/WorkTriggers.js) (`_bindHeaderPin`). It uses a fixed scroll-distance offset captured once at bind time:

```js
const { top, bottom } = this.view.getBoundingClientRect();
const scrollDistance = bottom - top;

ScrollTrigger.create({
  id: "work-header-pin",
  trigger: this.view,
  start: "top top",
  end: `+=${scrollDistance}`,
  pin: header,
  pinSpacing: false,
  invalidateOnRefresh: false,
});
```

---

## Critical initialization constraint

**`CardManager` must be initialized before sections in `AnimationDirector`.**

At the `base` breakpoint, cards use the `throw` variant (`SECTION_OVERRIDES.card.base`). `throw.js` creates a ScrollTrigger with `pin: true, pinSpacing: true`. GSAP inserts pin spacers into the DOM immediately on `ScrollTrigger.create()` — each spacer ≈ `card.offsetHeight + 1500px`. With several cards, the work section gains thousands of pixels before the user has scrolled at all.

`_bindHeaderPin` captures `scrollDistance` at section construction time. If `CardManager` has not yet run, the spacers don't exist, the footer appears thousands of pixels higher than it will be at runtime, and `end` is wildly too small. The header pin releases in the first industry group regardless of how `end` is expressed.

The fix — moving `new CardManager()` to before the sections loop in `AnimationDirector` — ensures spacers are in the DOM before any section measures layout. This constraint must be preserved. Do not move `CardManager` back after sections.

---

## IndustryHeaderManager integration

`WorkHeaderManager` accepts an optional `industryHeaderManager` instance and calls two callbacks:

- `onWorkHeaderCollapse({ collapsedHeight, reduced })` — called at the start of `_collapse`, before the GSAP tweens. Receives the computed collapsed header height so `IndustryHeaderManager` can slide industry headings up to match.
- `onWorkHeaderExpand({ naturalHeight, reduced })` — called at the start of `_expand`, before the GSAP tweens. Passes the natural header height so headings return to their resting position.

Both calls are optional-chained. If `industryHeaderManager` is not provided, collapse and expand animate normally with no heading sync.

---

## What does not fix this

Any approach that modifies how `end` is expressed or when it recalculates — `invalidateOnRefresh`, `ScrollTrigger.refresh()` timing, `endTrigger` vs fixed offset — is working on the wrong problem. The formula is correct. The layout it measures must include card spacers.
