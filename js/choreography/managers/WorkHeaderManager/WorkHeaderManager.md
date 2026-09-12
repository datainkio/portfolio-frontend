---
description: "Runtime manager — drives the work section index <header> as a non-modal bottom-sheet drawer below md and a resting vertical rail at md and up. The <header> is the fixed/positioned box (inset-x-0 bottom-0 below md, left-0 top-0 at md+); the data-projects-el=\"jumplinks\" <nav> inside it (handle bar + industry list + footer) slides as one unit. The handle bar is the <nav>'s first child, <header data-projects-el=\"drawer-handle\">, whose <h2> renders as the data-projects-el=\"drawer-toggle\" <button> (aria-expanded + aria-controls=\"work-jumplinks\"). Responsive via gsap.matchMedia(): below md the <nav> rests at { yPercent: 100, y: -handle.offsetHeight } so only the handle bar peeks above the viewport's bottom edge, its bottom flush with the viewport's; tapping the heading opens (yPercent: 0, y: 0 — nav bottom flush with viewport bottom), the handle's label mirrors WorkNavManager's scrollspy (subscribes to EVENTS.workNav.activeChange; ignores the seeded boot emit) — its data-projects-el=\"drawer-title\" span is empty at landing, reads the group heading once a group is in view, and empties again when the scrollspy reports id: null (reader outside every group — e.g. back at the top); the 'Industries' span is static; a click on any industry-link sets the label from the link text and closes the drawer (the anchor still navigates), Escape closes and returns focus to the handle, a click outside the header closes it, and a window resize re-seats the closed offset — no focus trap, no inert. At md and up the transform is cleared (clearProps) and the header rests open, flush to the viewport's left edge, with no listeners bound, the heading button inert (md:pointer-events-none), and the title span held empty (the rail's aria-current already shows position). Transform-only, mirrors BuildInfoManager's slide model. WorkNavManager's scrollspy (aria-current) is independent of this manager and untouched by it."
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

## Responsive drive (bottom sheet `<md` / rail `md+`)

`_bind()` registers two `gsap.matchMedia()` contexts keyed on `MEDIA` (`md` = `48rem`, sourced from `TAILWIND_BREAKPOINTS`). One layout — a vertical rail — rests open at `md` and up; below `md` the header rests fixed to the bottom edge with the whole `<nav>` sliding as a single unit:

- **`(max-width: 47.999rem)` — drawer mode (base/sm).** Boot sets the `<nav>` instantly to its closed rest via `_closedVars()` — `{ yPercent: 100, y: -handle.offsetHeight }`: `yPercent` pushes the whole nav below the viewport, `y` pulls it back up by the handle bar's height so the bar's bottom edge sits on the viewport's bottom edge. The heading `<button data-projects-el="drawer-toggle">` toggles open (`{ yPercent: 0, y: 0 }` — nav bottom flush with viewport bottom) / closed. Its `<span data-projects-el="drawer-title">` is a "you are here" readout: empty until the scrollspy reports a real (non-seeded) `EVENTS.workNav.activeChange`, then the heading text resolved via `document.getElementById(id)` (the group heading id = the link hash), and empty again on `{ id: null }` — the scrollspy's signal that no group is in its active band (back at the top, or past the last group). The rail's `aria-current` does not clear on that signal; only this readout does. The leading `Industries` span is static text; the button is a Tailwind `group` so hovering it shifts that span to `text-secondary-400`, matching the industry links' hover; a click on any `industry-link` sets the label from the link text immediately (a short final group may never enter the active band) and closes the drawer (the anchor still navigates — the drawer just gets out of the way); `Escape` closes and returns focus to the handle; a click outside the `<header>` closes it; a `window` `resize` re-seats the closed offset when closed (handle height can change on reflow). Non-modal: no focus trap, no `inert`. Cleanup removes every listener added in this mode.
- **`(min-width: 48rem)` — rail mode (md+).** `gsap.set(nav, { clearProps: "transform" })` and the rail rests open, `fixed left-0 top-0` — flush to the viewport's left edge rather than inset within the section's grid column; `aria-expanded="true"` on the handle (the heading button is still rendered — it is the heading text — but inert via `md:pointer-events-none md:cursor-default`) and its title span emptied (the rail's `aria-current` already shows position); no listeners bound. The bus subscription lives outside `matchMedia` and keeps tracking `_activeTitle` in both modes, so crossing back below `md` renders the current position immediately.

`matchMedia` runs the matching context's setup on boot and swaps setup/cleanup on breakpoint cross, so the two drives never coexist. `kill()` calls `this._mm.kill()` to revert all contexts, kills any in-flight tween, and clears the transform. `AnimationDirector` invokes `kill()` on teardown (`this.workHeaderManager?.kill()`). `_open`/`_close` are idempotent (guard on `_isOpen`).

`_open`/`_close` animate the `<nav data-projects-el="jumplinks" id="work-jumplinks">` itself via `yPercent` + `y` — transform-only, compositor-safe, mirroring `BuildInfoManager`. The `<nav>` carries the handle bar (`<header data-projects-el="drawer-handle">`), the industry-links `<ol>`, and the footer, and moves as one unit; there is no separate wrapper inside it that gets targeted instead. The outer `<header data-projects-el="header">` (not the `<nav>` it contains) is the positioned box: it carries `fixed inset-x-0 bottom-0` below `md` (`fixed left-0 top-0` at `md`+). Below `md` it is `pointer-events-none` with the `<nav>` `pointer-events-auto`, so the invisible region the translated nav vacates doesn't swallow clicks meant for page content behind it. The only measurement is `handle.offsetHeight` (read at boot, on close, and on resize) — there is no `height: "auto"` `onComplete` cleanup; the industry-links `<ol>` is never animated directly — only its `<nav>` parent. The handle is the `<h2>` text rendered as a real `<button>` with native `aria-expanded`/`aria-controls` semantics — there is no `role="button"` hack on an anchor. The manager subscribes to `EVENTS.workNav.activeChange` only to drive the handle label; `WorkNavManager` still owns `aria-current` and this manager never touches it.

## Critical initialization constraint

**`CardManager` must be initialized before sections in `AnimationDirector`.**

At the `base` breakpoint, cards use the `throw` variant (`SECTION_OVERRIDES.card.base`). `throw.js` creates a ScrollTrigger with `pin: true, pinSpacing: true`. GSAP inserts pin spacers into the DOM immediately on `ScrollTrigger.create()` — each spacer ≈ `card.offsetHeight + 1500px`. With several cards, the work section gains thousands of pixels before the user has scrolled at all.

`_bindHeaderPin` captures `scrollDistance` at section construction time. If `CardManager` has not yet run, the spacers don't exist, the footer appears thousands of pixels higher than it will be at runtime, and `end` is wildly too small. The header pin releases in the first industry group regardless of how `end` is expressed.

The fix — moving `new CardManager()` to before the sections loop in `AnimationDirector` — ensures spacers are in the DOM before any section measures layout. This constraint must be preserved. Do not move `CardManager` back after sections.

---

## Removed: `--work-header-h` offset machinery

Earlier revisions published a `--work-header-h` CSS var (via `_syncOffset` / `_publishOffset`) and tweened the `<header>` height in lockstep, to keep `sticky` industry headings flush under a collapsing header. That model assumed the industry headings sat under a collapsing header. The industry headings no longer carry `top-[var(--work-header-h)]` — nothing consumes the var. The offset publishing and the header-height tween were dead weight (and animated the `<h2>`-only header to nonsensical heights), so both were removed. If sticky-under-header behavior is wanted again, reintroduce it against the current DOM, not this var.

---

## What does not fix this

Any approach that modifies how `end` is expressed or when it recalculates — `invalidateOnRefresh`, `ScrollTrigger.refresh()` timing, `endTrigger` vs fixed offset — is working on the wrong problem. The formula is correct. The layout it measures must include card spacers.
