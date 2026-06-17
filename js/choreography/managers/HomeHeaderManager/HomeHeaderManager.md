---
id: frontend.js.choreography.managers.homeheadermanager
role: "Runtime manager — drives the home landing header's role state machine (loader -> hero -> menu) via the `data-header-role` attribute, playing the behavioural motion on each transition."
status: active
surface: internal
scope: frontend
runtime: browser
tags:
  - "#frontend"
  - "#design/motion/js"
  - "#design/motion/choreography"
  - "#design/motion/choreography/manager"
  - "#design/motion/choreography/HomeHeaderManager"
links:
  - "[[system/gsap|system/gsap]]"
  - "[[config/contracts/selectors/selectors|config/contracts/selectors]]"
  - "[[config/contracts/events/events|config/contracts/events]]"
  - "[[home-landing|organisms/header/home/home-landing]]"
backlinks:
  - "[[AnimationDirector|AnimationDirector]]"
---

# HomeHeaderManager

Owns the home landing header's **role state machine**, expressed as
`data-header-role` on the `<header>`. The header has three roles:

1. **`loader`** — initial state; the header is the preloader / loading view. The
   preloader runtime (pure CSS, via `data-preloader-state`) owns the visuals here.
2. **`hero`** — idle state; the header is a hero design element. Entered when the
   manager arms on `preloader:out`.
3. **`menu`** — the header acts as a navigation menu (hamburger-like). Entered
   when the header reaches the top of the viewport.

Each role's layout is declared in the template as Tailwind data-variants keyed on
`data-header-role`, so the manager flips **one attribute** per transition and
never couples to utility-class names (see "The CSS-owned role layouts"). On top of
each instant CSS swap it plays the behavioural motion.

## Ownership seam

The preloader runtime (`js/preloader/`, pure CSS) owns the header through its
intro → idle → outro **while in the `loader` role**, and ends by dispatching
`preloader:out`. That event is the handoff where motion/IX ownership moves from
**CSS to GSAP**. This manager arms only on `preloader:out`; before then the header
is `position: fixed` and CSS-owned (see `styles/components/hanko.css`), so touching
it early would fight the loader outro. `loader` and `hero` differ behaviourally
(loader runs the preloader animation; hero is the resting idle state), not
necessarily in layout — the visible difference is driven by the preloader CSS.

## loader → hero

When `_arm()` runs on `preloader:out`, `_enterHeroRole()` sets
`data-header-role="hero"` — the loader is finished and the header settles into its
idle hero role. The manager then creates the menu trigger (below).

## hero → menu (trigger)

Trigger: **the top of the header reaches the top of the viewport**, expressed as a
ScrollTrigger `start: "top top"`. Because the header is the topmost element, this
is already true at scroll 0 — so the manager both registers `onEnter` (forward
crossing) and checks `isActive` immediately after creating the trigger to cover
the at-top case. (Consequence: at scroll 0 the header passes loader → hero → menu
in one tick, so `hero` is currently transient. Making `hero` a stable resting
state would mean entering `menu` from an explicit toggle instead — see Notes.)

**The two paths are mutually exclusive at load — the trigger must not be
pinned.** A plain (unpinned) ScrollTrigger created while already past its `start`
does *not* fire `onEnter`, so at scroll 0 only the `isActive` check fires
(`onEnter` covers the inverse case: a load that starts scrolled below the header,
where the top later crosses going forward). An earlier experiment added
`pin: true`; that forced a refresh which re-crossed the start and fired `onEnter`
*as well* — producing a redundant `_enterMenuRole` call — and the pin's
fixed/spacer layout thrashed layout (a `min-height:100dvh` pin-spacer inserted
then removed), re-running the CSS context reveal. Pinning was removed.
`_enterMenuRole()` still guards on `_inMenuRole` as cheap insurance, and the
`isActive` check uses optional chaining (`this._trigger?.isActive`) in case
`onEnter` fires synchronously during `create()` and nulls the trigger.

## Response on entering the menu role (`_enterMenuRole`)

The trigger is one-shot — killed once handled (the header stays in the menu role).
Note that **header positioning is CSS-owned, not done here.** The template keeps
the header `fixed left-0 h-dvh` and `hanko.css` no longer returns it to flow on
`data-preloader-state="exit"`, so it persists as a fixed overlay with content
scrolling underneath. ScrollSmoother does not run on the home page (there is no
`#page-main-content`), so native `fixed` holds without a ScrollTrigger pin. This
manager therefore owns only the **behavioural** transition:

1. **Flip the role.** `_enterMenuRole` sets `data-header-role="menu"` on the
   header. The hero → menu layout swap is **CSS-owned** off that attribute via
   Tailwind v4 data-variants (see "The CSS-owned role layouts" below); JS sets only
   the one attribute, never the utility classes. This also renders the nav
   (`display: block`) before the reveal animation runs.
2. **Reveal the page nav** (`_showNav`). Display is already handled by step 1's
   attribute flip, so this method only adds motion: the nav's list items
   **fade-in-and-up in sequence** — `gsap.from` the items with `autoAlpha 0->1`,
   `y 24->0`, ease-out (reusing `--hanko-enter-duration`), `stagger: 0.08`.
   `immediateRender` pins each item's hidden start frame on creation, so there is
   no flash before they animate.

The hgroup itself is **not** animated on this transition — it persists into the
menu rail (held visible by its CSS intro's `both` fill); only its CSS layout/sizing
changes by role. The previous `_hideHGroup` reverse-intro fade was removed when the
design changed from "header becomes nav (brand disappears)" to "header collapses to
a brand+nav rail".

### The CSS-owned role layouts

Each role's layout lives entirely in the template as Tailwind classes gated by
`data-header-role` on the header — JS flips one attribute, CSS owns the styling.
The header config (`home-landing.njk`) keys a class set per role; the `classes`
filter prefixes each with its `data-[header-role=…]:` variant:

- **Header:** `loader` and `hero` declare `w-full grid grid-cols-6 items-center
  gap-2 justify-center` (centered full-width lockup); `menu` declares
  `w-48 grid-cols-1 content-start text-center border-r-2 border-slate-700` (a narrow
  single-column left rail). Each role states its full layout — no base+override, so
  no orphaned utilities and no reliance on source order. `loader` and `hero` share a
  layout today but are kept separate so they can diverge.
- **Nav:** `hidden group-data-[header-role=menu]:block` — the header carries the
  `group` class, so the nav reacts to its ancestor's role, flipping
  `display: none → block` only in the `menu` role.
- **Children in the rail:** the hanko, hgroup, heading and subtitle each take a
  `group-data-[header-role=menu]:` set for the rail (e.g. hanko `justify-self-center`,
  hgroup `col-span-full text-center`, heading `block text-2xl`, subtitle
  `block text-sm`). The hanko centers via `justify-self` rather than `mx-auto`
  because `hanko.css` zeroes its margin in the preloader exit state.

This keeps all styling in markup (single source of truth, Tailwind-idiomatic) and
keeps the manager off class names entirely — it satisfies the choreography
decoupling rule (`data-*`, never CSS classes) instead of fighting it. `_showNav`
therefore does **not** touch `display`; it assumes the role flip already rendered
the nav.

### Why the hgroup stays visible in `menu`

The hgroup's CSS intro (the shared `hanko-enter` keyframe under
`[data-preloader-state="exit"]`) uses `both` fill, so it **holds its end frame**
(`opacity: 1; translateY(0)`) indefinitely. Nothing in this manager hides the
hgroup, so it simply remains visible through hero → menu while CSS swaps its text.
(This `both`-fill hold is also why the earlier, now-removed `_hideHGroup` reversal
had to release the animation before it could fade the hgroup out.)

### Reduced motion (nav)

Under reduced motion the CSS attribute flip **is** the entire reveal — the list
items are already visible at their resting position, so `_showNav` returns early and
animates nothing.

## DOM contract

- Hook: `[data-home-header]` on the home landing `<header>`
  (`views/organisms/header/home/home-landing.njk`), resolved via
  `SELECTORS.homeHeader`. The choreography decouples from the element's `id`
  (`#overview`) and from `data-preloader`, which belongs to the preloader domain.
- State attribute: `data-header-role` on the same `<header>`, values
  `loader` (initial, set in the template) → `hero` → `menu`. JS owns the value; the
  template owns the styling that responds to it (`data-[header-role=…]:` on the
  header, plus `group`/`group-data-[header-role=menu]:` for the nav). Distinct from
  `data-preloader-state`, which the preloader runtime owns for the loader's
  internal phases. Nav element resolved via `SELECTORS.homeNav`
  (`[data-home-header] nav`).
- Stagger targets: the nav's list items, hooked with `data-page-nav-el="item"`
  (`SELECTORS.pageNavItem`) in `page-nav.njk` and queried within the nav at
  construction. These are what `_showNav` fades up in sequence.

## Lifecycle

- Instantiated by [[AnimationDirector|AnimationDirector]] alongside the other
  header managers; no-ops off the home page (hook absent).
- `kill()` removes the `preloader:out` listener, kills the trigger, resets
  `data-header-role="hero"` (handing the header + nav layout and the nav's hidden
  state back to CSS — no class bookkeeping; `loader` is a one-time boot phase that
  can't be re-entered, so `hero` is the idle fallback), and tears down the nav-item
  tweens (clear `opacity,visibility,transform`, left by the staggered fade-up). The
  header's position and the hgroup are CSS-owned, so teardown does not touch them.

## Notes for future maintenance

- The header is a fixed full-viewport overlay (`h-dvh`, opaque `bg-slate-950`);
  until it is sized/styled for the `menu` role it visually covers the content
  scrolling beneath it. Sizing is a later step.
- **`hero` is currently transient.** At scroll 0 the trigger enters `menu`
  immediately, so the idle hero role is skipped. To make `hero` a stable resting
  state, drop the auto-enter and trigger `menu` from an explicit toggle (the
  hamburger-like interaction) — then `_enterMenuRole`/`_inMenuRole` become a
  reversible open/close rather than a one-shot.
- The nav reveal staggers the list items (`data-page-nav-el="item"`); if items
  become dynamic, the manager queries them once at construction — re-query if the
  list can change after boot.
