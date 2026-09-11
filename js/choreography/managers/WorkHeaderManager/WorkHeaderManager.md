---
description: "Runtime manager — drives the work section index <header> as a non-modal drawer below md and a resting vertical rail at md and up. The <header> is the fixed/positioned box (left-0; top-8..bottom-0 below md, top-0 at md+); the <nav> inside it is unpositioned and just carries the id the toggle's aria-controls points at. Responsive via gsap.matchMedia(): below md the <header> rests translated fully off-canvas (xPercent: -100) behind a persistent data-projects-el=\"drawer-toggle\" <button> (aria-expanded + aria-controls=\"work-jumplinks\"); tapping it opens/closes, a click on any industry-link closes the drawer (the anchor still navigates), Escape closes and returns focus to the handle, and a click outside the header closes it — no focus trap, no inert. At md and up the transform is cleared (clearProps) and the header rests open, flush to the viewport's left edge, with no listeners bound. Transform-only, mirrors BuildInfoManager's slide model. WorkNavManager's scrollspy (aria-current) is independent of this manager and untouched by it."
status: stable
tags:
  - choreography
  - manager
links:
  - "[[managers.workheadermanager|WorkHeaderManager.njk]]"
  - "[[system/gsap|system/gsap]]"
  - "[[config/ix/motion/motion|config/ix/motion]]"
  - "[[config/contracts/selectors/selectors|config/contracts/selectors]]"
  - "[[organisms/section/work|work.njk]]"
---

The work section header pin is in [WorkTriggers.js](../../organisms/Work/WorkTriggers.js) (`_bindHeaderPin`). It uses a fixed scroll-distance offset captured once at bind time:

```js
const scrollDistance =
  footer.getBoundingClientRect().bottom - this.view.getBoundingClientRect().top;

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

## Responsive drive (drawer `<md` / rail `md+`)

`_bind()` registers two `gsap.matchMedia()` contexts keyed on `MEDIA` (`md` = `48rem`, sourced from `TAILWIND_BREAKPOINTS`). One layout — a vertical rail — rests off-canvas below `md` and extended at `md` and up:

- **`(max-width: 47.999rem)` — drawer mode (base/sm).** Boot sets the header instantly off-canvas (`gsap.set(header, { xPercent: -100 })`) behind the handle `<button data-projects-el="drawer-toggle">`. The handle toggles open/closed; a click on any `industry-link` closes the drawer (the anchor still navigates — the drawer just gets out of the way); `Escape` closes and returns focus to the handle; a click outside the `<header>` closes it. Non-modal: no focus trap, no `inert`. Cleanup removes every listener added in this mode.
- **`(min-width: 48rem)` — rail mode (md+).** `gsap.set(header, { clearProps: "transform" })` and the rail rests open, `fixed left-0 top-0` — flush to the viewport's left edge rather than inset within the section's grid column; `aria-expanded="true"` on the handle (hidden via `md:hidden`, so moot visually but correct); no listeners bound.

`matchMedia` runs the matching context's setup on boot and swaps setup/cleanup on breakpoint cross, so the two drives never coexist. `kill()` calls `this._mm.kill()` to revert all contexts, kills any in-flight tween, and clears the transform. `AnimationDirector` invokes `kill()` on teardown (`this.workHeaderManager?.kill()`). `_open`/`_close` are idempotent (guard on `_isOpen`).

`_open`/`_close` animate the `<header data-projects-el="header">` itself via `xPercent` (`-100` ↔ `0`) — transform-only, compositor-safe, mirroring `BuildInfoManager`. `<header>` (not the `<nav>` it contains) is the positioned/moving box: it carries `fixed left-0`, the background, and the shadow; the `<nav data-projects-el="jumplinks" id="work-jumplinks">` inside it is unpositioned and exists only so the toggle's `aria-controls` has a stable id to point at. There is no height measurement, no `scrollHeight`/`offsetHeight` read, and no `height: "auto"` `onComplete` cleanup; the industry-links `<ul>` is never animated. The handle button is a real `<button>` with native `aria-expanded`/`aria-controls` semantics — there is no `role="button"` hack on an anchor, and no subscription to `EVENTS.workNav.activeChange` (that event still fires for `WorkNavManager`'s own `aria-current` scrollspy, which this manager no longer reads).

## Critical initialization constraint

**`CardManager` must be initialized before sections in `AnimationDirector`.**

At the `base` breakpoint, cards use the `throw` variant (`SECTION_OVERRIDES.card.base`). `throw.js` creates a ScrollTrigger with `pin: true, pinSpacing: true`. GSAP inserts pin spacers into the DOM immediately on `ScrollTrigger.create()` — each spacer ≈ `card.offsetHeight + 1500px`. With several cards, the work section gains thousands of pixels before the user has scrolled at all.

`_bindHeaderPin` captures `scrollDistance` at section construction time. If `CardManager` has not yet run, the spacers don't exist, the footer appears thousands of pixels higher than it will be at runtime, and `end` is wildly too small. The header pin releases in the first industry group regardless of how `end` is expressed.

The fix — moving `new CardManager()` to before the sections loop in `AnimationDirector` — ensures spacers are in the DOM before any section measures layout. This constraint must be preserved. Do not move `CardManager` back after sections.

---

## Removed: `--work-header-h` offset machinery

Earlier revisions published a `--work-header-h` CSS var (via `_syncOffset` / `_publishOffset`) and tweened the `<header>` height in lockstep, to keep `sticky` industry headings flush under a collapsing header. That model assumed the nav lived **inside** the header. The template was since refactored so the `<nav>` is a **sibling** of the header, and the industry headings no longer carry `top-[var(--work-header-h)]` — nothing consumes the var. The offset publishing and the header-height tween were dead weight (and animated the `<h2>`-only header to nonsensical heights), so both were removed. If sticky-under-header behavior is wanted again, reintroduce it against the current DOM, not this var.

---

## What does not fix this

Any approach that modifies how `end` is expressed or when it recalculates — `invalidateOnRefresh`, `ScrollTrigger.refresh()` timing, `endTrigger` vs fixed offset — is working on the wrong problem. The formula is correct. The layout it measures must include card spacers.
