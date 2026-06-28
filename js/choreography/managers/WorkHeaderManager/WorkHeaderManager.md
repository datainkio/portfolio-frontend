---
id: frontend.js.choreography.managers.workheadermanager
role: "Runtime manager — collapses and expands the work section industry-links list. Responsive via gsap.matchMedia(): below lg the list rests collapsed to its current (first) item, which doubles as the disclosure control — tapping the in-view link expands the rest, other links navigate; at lg and up the list rests open as a horizontal jumplink bar with no toggle. There is no separate toggle button (the directional-toggle atom was removed). The current link is whichever industry-link carries aria-current=true (set by WorkNavManager scrollspy), floated first via order-first below lg; WorkHeaderManager subscribes to the AnimationBus work:nav:active event to move the disclosure attributes (role=button, aria-controls, aria-expanded) onto the active link as it changes. Animates the <ul> height (auto ↔ single-item) so the current item stays visible; the section header (h2) is untouched."
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

## Responsive drive (collapse `<lg` / open `lg+`)

`_bind()` registers two `gsap.matchMedia()` contexts keyed on `MEDIA` (`lg` = `64rem`, sourced from `TAILWIND_BREAKPOINTS`). The boundary is `lg` so base/sm/md share one collapsible behavior, matching the `industry-links` `<ul>` (vertical flex until `lg:` grid):

- **`(max-width: 63.999rem)` — click mode (base/sm/md).** Collapses instantly (`_collapse(true)`) to **single-item height** — the current item (`order-first` below lg) stays visible as the disclosure header. `_applyControl()` stamps `role="button"` + `aria-controls` + `aria-expanded` onto the active link. A delegated `click` listener on the `<ul>`: when collapsed, any tap expands; when expanded, a tap on the `aria-current` link collapses, any other link navigates (default). The work section is below the fold at boot, so the initial collapse is not perceived. Cleanup removes the listener, clears the control attributes, and `_expand(true)` so scroll mode inherits an open list.
- **`(min-width: 64rem)` — scroll mode (lg+).** Rests open as a horizontal jumplink bar; no toggle (cleanup is a no-op).

The disclosure control identity is dynamic: it follows the scrollspy. `WorkHeaderManager` subscribes to `EVENTS.workNav.activeChange` and, while in click mode, calls `_applyControl()` to move `role`/`aria-controls`/`aria-expanded` off the previous link and onto the new in-view link.

`matchMedia` runs the matching context's setup on boot and swaps setup/cleanup on breakpoint cross, so the two drives never coexist. `kill()` calls `this._mm.kill()` to revert all contexts and `_clearControl()` to strip the disclosure attributes. `AnimationDirector` invokes `kill()` on teardown (`this.workHeaderManager?.kill()`). `_collapse`/`_expand` are idempotent (guard on `_isCollapsed`).

`_collapse`/`_expand` animate the industry-links `<ul>` (`data-projects-el="industry-links"`) **height** only (single-item ↔ `auto`); the `<ul>` is `overflow-hidden` so non-current items clip away when collapsed. There is no separate toggle button — the current list item is the control, kept visible by collapsing to one item's height rather than to zero. The header (`<h2>`) is untouched.

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
