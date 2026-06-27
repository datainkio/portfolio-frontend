---
id: frontend.js.choreography.managers.workheadermanager
role: "Runtime manager — collapses and expands the work section jumplinks nav. Drive mechanism is responsive via gsap.matchMedia(): below lg the nav rests closed and an icon button (data-projects-el='nav-toggle', aria-expanded/aria-controls) toggles it on click; at lg and up the nav rests open as a horizontal jumplink bar (button hidden, scroll-direction collapse staged but disabled). The section header (h2) stays visible; only the industry-links <ul> animates (autoAlpha/y/height), with the toggle button held visible as its sibling so a collapsed list can be reopened. Also subscribes to the AnimationBus work:nav:active event (WorkNavManager scrollspy) and reflects the in-view industry title onto the toggle label (data-projects-el='nav-toggle-label'), falling back to the default label when no group is active."
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

## Responsive drive (click `<lg` / scroll `lg+`)

`_bind()` registers two `gsap.matchMedia()` contexts keyed on `MEDIA` (`lg` = `64rem`, sourced from `TAILWIND_BREAKPOINTS`). The boundary is `lg` so base/sm/md share one collapsible behavior, matching the `industry-links` `<ul>` (vertical until `lg:`) and the `home-landing` drawer (collapsible `max-lg:`, static rail `lg+`):

- **`(max-width: 63.999rem)` — click mode (base/sm/md).** Collapses instantly to a closed resting state (`_collapse(true)`), sets the toggle button to `aria-expanded="false"`, and binds a `click` listener that flips `_collapse`/`_expand`. The work section is below the fold at boot, so the initial collapse is not perceived. Cleanup removes the listener and `_expand(true)` so scroll mode inherits an open nav.
- **`(min-width: 64rem)` — scroll mode (lg+).** Rests open as a horizontal jumplink bar; the toggle button is hidden in the template (`lg:hidden`). Scroll-direction collapse/expand is staged but disabled — the `ScrollTrigger` block is commented out and cleanup is a no-op. Re-enable that block to restore scroll-driven collapse.

`matchMedia` runs the matching context's setup on boot and swaps setup/cleanup on breakpoint cross, so the two drives never coexist. `kill()` calls `this._mm.kill()` to revert all contexts. `AnimationDirector` invokes `kill()` on teardown (`this.workHeaderManager?.kill()`). `_collapse`/`_expand` are idempotent (guard on `_isCollapsed`), so forcing a resting state on context entry is safe.

`_collapse`/`_expand` animate only the industry-links `<ul>` (`data-projects-el="industry-links"`) — `autoAlpha`/`y`/`height`. The collapsing region is the list alone; the toggle button is its sibling in the `<nav>` and must stay visible to reopen a collapsed list. The header (`<h2>`) is untouched.

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
