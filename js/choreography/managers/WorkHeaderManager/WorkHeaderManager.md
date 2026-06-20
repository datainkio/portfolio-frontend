---
id: frontend.js.choreography.managers.workheadermanager
role: "Runtime manager — collapses and expands the work section jumplinks nav. Drive mechanism is responsive via gsap.matchMedia(): below md the nav rests closed and an icon button (data-projects-el='nav-toggle', aria-expanded/aria-controls) toggles it on click; at md and up the nav rests open and collapses/expands on scroll direction within the work section (button hidden). The section header (h2) stays visible; only the industry jumplinks animate. Publishes the --work-header-h CSS var on the work section, tweened in lockstep with the header height, so industry headings (sticky top-[var(--work-header-h)]) stay flush under the header."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - choreography
  - frontend
  - js
  - manager
links:
  - "[[managers.workheadermanager|WorkHeaderManager.njk]]"
  - "[[system/gsap|system/gsap]]"
  - "[[config/ix/motion/motion|config/ix/motion]]"
  - "[[config/contracts/selectors/selectors|config/contracts/selectors]]"
  - "[[organisms/section/work|work.njk]]"
backlinks:
  - "[[layouts/work-landing-header|work-landing-header.js]]"
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

## Responsive drive (click `<md` / scroll `md+`)

`_bind()` registers two `gsap.matchMedia()` contexts keyed on `MEDIA` (`md` = `48rem`, sourced from `TAILWIND_BREAKPOINTS`):

- **`(max-width: 47.999rem)` — click mode.** Collapses instantly to a closed resting state (`_collapse(true)`), sets the toggle button to `aria-expanded="false"`, and binds a `click` listener that flips `_collapse`/`_expand`. The work section is below the fold at boot, so the initial collapse is not perceived. Cleanup removes the listener and `_expand(true)` so scroll mode inherits an open nav.
- **`(min-width: 48rem)` — scroll mode.** Expands to an open resting state, then a `ScrollTrigger` scoped to the work section collapses on scroll-down / expands on scroll-up. The toggle button is hidden in the template (`md:hidden`). Cleanup kills the trigger.

`matchMedia` runs the matching context's setup on boot and swaps setup/cleanup on breakpoint cross, so the two drives never coexist. `kill()` calls `this._mm.kill()` to revert all contexts and removes the `--work-header-h` var from the work section. `AnimationDirector` invokes `kill()` on teardown (`this.workHeaderManager?.kill()`). `_collapse`/`_expand` are idempotent (guard on `_isCollapsed`), so forcing a resting state on context entry is safe.

## Critical initialization constraint

**`CardManager` must be initialized before sections in `AnimationDirector`.**

At the `base` breakpoint, cards use the `throw` variant (`SECTION_OVERRIDES.card.base`). `throw.js` creates a ScrollTrigger with `pin: true, pinSpacing: true`. GSAP inserts pin spacers into the DOM immediately on `ScrollTrigger.create()` — each spacer ≈ `card.offsetHeight + 1500px`. With several cards, the work section gains thousands of pixels before the user has scrolled at all.

`_bindHeaderPin` captures `scrollDistance` at section construction time. If `CardManager` has not yet run, the spacers don't exist, the footer appears thousands of pixels higher than it will be at runtime, and `end` is wildly too small. The header pin releases in the first industry group regardless of how `end` is expressed.

The fix — moving `new CardManager()` to before the sections loop in `AnimationDirector` — ensures spacers are in the DOM before any section measures layout. This constraint must be preserved. Do not move `CardManager` back after sections.

---

## Industry heading offset (`--work-header-h`)

The industry headings (`data-projects-el="industry-heading"`) are `sticky top-[var(--work-header-h,0px)]`. `WorkHeaderManager` owns that var on the work `<section>`:

- `_syncOffset()` — instant `gsap.set` of the var to the current `header.offsetHeight`. Called once in `_bind()` to seed a resting value, since scroll mode boots expanded and `_expand` short-circuits before it would publish.
- `_publishOffset(px, reduced)` — called at the start of `_collapse` (collapsed header height) and `_expand` (natural header height). Tweens the var with the same `duration`/`ease` as the header-height tween, so headings track the header edge frame for frame. Reduced motion sets it instantly.

`kill()` removes the var via `style.removeProperty`. This replaces the deprecated `IndustryHeaderManager`, which animated each heading's `top` (plus a `rotate` flourish) per node.

---

## What does not fix this

Any approach that modifies how `end` is expressed or when it recalculates — `invalidateOnRefresh`, `ScrollTrigger.refresh()` timing, `endTrigger` vs fixed offset — is working on the wrong problem. The formula is correct. The layout it measures must include card spacers.
