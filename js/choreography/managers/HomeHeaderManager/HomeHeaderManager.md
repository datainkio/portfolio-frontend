---
id: frontend.js.choreography.managers.homeheadermanager
role: "Runtime manager — drives the home landing header's role state machine (loader -> hero -> menu) via the `data-header-role` attribute, playing the behavioural motion on each transition; in the menu role on small breakpoints it toggles a tap-driven side drawer via `data-drawer`."
status: active
surface: internal
scope: frontend
runtime: browser
tags:
  - choreography
  - frontend
  - HomeHeaderManager
  - js
  - manager
links:
  - "[[system/gsap|system/gsap]]"
  - "[[AnimationBus|AnimationBus]]"
  - "[[config/contracts/selectors/selectors|config/contracts/selectors]]"
  - "[[config/contracts/events/events|config/contracts/events]]"
  - "[[motion|config/ix/motion]]"
  - "[[home-landing|organisms/header/home/home-landing]]"
  - "[[hanko|styles/components/hanko]]"
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
3. **`menu`** — the header acts as a navigation menu. Entered automatically a
   tunable hold after `hero`, driven by a timer — never by scroll or tap.

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

Trigger: **a tunable time hold**, not scroll position. On `_arm()` the header
enters `hero` and a `gsap.delayedCall` runs for `HOME_HERO_HOLD.delay` seconds;
when it fires, `_runTransition` plays the deconstruct → build transition to
`menu`. **Scroll and tap are inert by design** — the previous scroll-gated swap
(`ScrollTrigger start: "top top"` + an immediate `isActive` check) flipped the
whole view away on the first scroll, hiding page content behind an interaction
gate with no forward cue. That ScrollTrigger is removed. See the
[hero → menu transition spec](../../../../specs/animation/home-header-hero-to-menu-transition.animation-spec.md).

- **Tunability (DX):** the hold lives in the `HOME_HERO_HOLD` motion token
  (`config/ix/motion.js`). `?heroHold=<seconds>` overrides it at runtime for
  rebuild-free tuning (`_resolveHold` / `_readHoldOverride`); the token stays the
  source of truth. Reduced motion zeroes the hold.
- **Timer primitive:** `gsap.delayedCall` (not `setTimeout`) so the hold is
  ticker-synced, pausable and killable; the handle is stored as `this._holdCall`.
- **`hero` is now a real resting state** (it was transient under the scroll-gate),
  resolving the prior open question.

### The transition (`_runTransition`)

A single master timeline (`this._master`, stored so it stays seekable/killable),
two labeled phases:

1. **deconstruct (outro)** — `_buildDeconstruct` slides the hero panel off-stage
   left (`xPercent: -100`, **transform-only / compositor-safe — never
   width/layout**), revealing page content beneath. The lockup rides the header
   off, so the hero reads as exiting. Emits `home:outro:start` / `:complete`.
2. **seam** — a timeline `.call` flips `data-header-role` to `menu` **while the
   panel is fully off-screen**, so the instant CSS role-rest swap (full-bleed →
   narrow rail) is invisible and the progressive GSAP slide never fights it (the
   class of bug the removed `pin: true` experiment hit when a refresh re-ran the
   CSS reveal).
3. **build (intro)** — `_buildMenuIn` slides the now-narrow rail back to its
   resting left edge (`xPercent: 0`, `clearProps: "transform"` so CSS owns the
   rest) and nests the nav-item reveal (`_showNav`) as its tail.

Under **reduced motion** there is no slide: `_runTransition` emits the outro pair
instantly, flips the role, and calls `_showNav` (which emits the intro pair
instantly). `_enterMenuRole()` still guards on `_inMenuRole` as cheap insurance.

## Response on entering the menu role (`_enterMenuRole`)

`_enterMenuRole` is the seam callback fired mid-timeline by `_runTransition` (and
called directly under reduced motion). It flips state only — it does **not** play
the nav reveal (that is sequenced as the build-phase tail; see above). Note that
**header positioning is CSS-owned, not done here.** The template keeps the header
`fixed left-0 h-dvh` and `hanko.css` no longer returns it to flow on
`data-preloader-state="exit"`, so it persists as a fixed overlay with content
scrolling underneath. ScrollSmoother does not run on the home page (there is no
`#page-main-content`), so native `fixed` holds without a pin. Its responsibilities:

1. **Flip the role.** `_enterMenuRole` sets `data-header-role="menu"` on the
   header. The hero → menu layout swap is **CSS-owned** off that attribute via
   Tailwind v4 data-variants (see "The CSS-owned role layouts" below); JS sets only
   the one attribute, never the utility classes. This also renders the nav
   (`display: block`).
2. **Arm the side-drawer toggle** (base–md only). On small breakpoints the menu
   role is a **side drawer**: it rests **collapsed** (a `w-12` left rail) and a
   tap **anywhere in the header** — including on a page-nav link — expands it to
   full-screen; the next tap collapses it. `_enterMenuRole` attaches
   **pointer-event** listeners (`pointerdown`/`pointerup`/`pointercancel`) that
   detect a tap and call `_toggleDrawer()`, which only flips `data-drawer`
   (`open` ⇄ absent) on the header. Layout and the nav's visibility are
   **CSS-owned** off that attribute; JS owns no width. See "Side drawer" below.

The hgroup itself is **not** animated on this transition — it persists into the
menu rail (held visible by its CSS intro's `both` fill); only its CSS layout/sizing
changes by role. The previous `_hideHGroup` reverse-intro fade was removed when the
design changed from "header becomes nav (brand disappears)" to "header collapses to
a brand+nav rail".

### Side drawer (menu role, base–md)

The drawer is **breakpoint-gated to base–md** (`max-lg:` in the template); at
**lg+** the attribute is inert and the menu role is a static `w-48` rail. The
state model **reuses the `menu` role** — there is no separate role-level state
machine — and adds one boolean on the same element:

- **Collapsed** (default): no `data-drawer`. The menu role rests at `w-12`
  (`overflow-hidden`, `cursor-pointer`); the nav is `hidden`.
- **Expanded**: `data-drawer="open"`. `data-[header-role=menu]:data-[drawer=open]`
  overrides width to `max-lg:w-full` (the extra attribute selector wins on
  specificity); the nav reveals via `group-data-[header-role=menu]:group-data-[drawer=open]:block`.

JS only flips `data-drawer`; it never reads or writes width/visibility. Because
the width override is `max-lg:`, toggling the attribute at lg+ is a visual no-op,
so the listeners are attached unconditionally rather than guarded on breakpoint. A
tap on a page-nav `<a>` both navigates (anchor jumplink) and collapses the drawer
(the same tap flips `data-drawer` off) — closing the drawer as it jumps to the
section.

**Why pointer events, not `click`.** iOS WebKit (Safari/Chrome on iPhone/iPad)
does not reliably dispatch a `click` on a non-interactive element — the
`<header>` or its empty area — *even with* `cursor: pointer`, the usual desktop
workaround. A click-based toggle therefore silently no-ops on iOS while passing
on desktop. `pointerup` fires on a tap regardless of element type, so the toggle
listens for `pointerdown` (record origin) → `pointerup` (toggle **iff** travel ≤
`TAP_MOVE_TOLERANCE_PX`, else it was a scroll of the `overflow-auto` expanded
drawer) → `pointercancel` (reset). This unifies desktop mouse and touch on one
path; `cursor: pointer` is kept only as a hint (see the template sidecar note).

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
items are already visible at their resting position, so `_showNav` animates
nothing. It still **emits `home:intro:start` + `home:intro:complete` instantly**
before returning, so a larger sequence coordinating off the reveal is not left
waiting when motion is off (mirrors `AbstractSection._applyPostIntroState`).

### Seam motion tokens

`_showNav`'s timing is split deliberately, to keep a single source of truth
across the CSS→GSAP seam:

- **Duration** is the **seam token** `--hanko-enter-duration`, owned by the
  loader-state CSS in `styles/components/hanko.css` (it must exist there for the
  FCP-critical CSS loader motion). JS does **not** copy the value — `_arm()`
  calls `_readSeamTokens()` once (post-`preloader:out`, so GSAP is loaded and the
  computed-style read costs no FCP), parses it (`parseCssSeconds`, handles
  `s`/`ms`), and stores it on `this._seam`. A missing/unparseable var
  `console.warn`s loudly and falls back to a **named** safety value — never a
  silent inline default.
- **Distance / stagger / ease** are **GSAP-only** (the loader CSS does not use
  them), so they are named in [[motion|config/ix/motion]] as `HOME_NAV_REVEAL`.
  That block intentionally **omits duration** — defining it there would re-fork
  the seam token.

### Bus events

`HomeHeaderManager` receives the `AnimationBus` from the Director and resolves
its event names from `EVENTS.home` (`makeSectionEvents("home")`). The nav reveal
emits `home:intro:start` / `home:intro:complete` (instantly under reduced
motion). These exist so the reveal is **observable and sequenceable** by other
choreography; nothing consumes them yet. `_emit(name, payload)` mirrors
`AbstractSection._emit` (no-ops without a bus or event name).

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
  header managers, now receiving the shared `AnimationBus`; no-ops off the home
  page (hook absent).
- `kill()` removes the `preloader:out` listener **and the header pointer
  listeners** (`pointerdown`/`pointerup`/`pointercancel`), kills the **hold timer
  (`_holdCall`), the master transition timeline (`_master`), and the stored
  `_navReveal` timeline**, resets `data-header-role="hero"`, clears `data-drawer`,
  **and clears the header transform** (releasing the slide so CSS owns the resting
  position) — handing the header + nav layout and the nav's hidden state back to
  CSS (no class bookkeeping; `loader` is a one-time boot phase that can't be
  re-entered, so `hero` is the idle fallback). It also tears down the nav-item
  tweens (clear `opacity,visibility,transform`, left by the staggered fade-up).
  The header's position and the hgroup are CSS-owned, so teardown does not touch
  them.

## Notes for future maintenance

- The header is a fixed full-viewport overlay (`h-dvh`, opaque `bg-slate-950`);
  until it is sized/styled for the `menu` role it visually covers the content
  scrolling beneath it. Sizing is a later step.
- **`hero` is a real, timed resting state** (`HOME_HERO_HOLD`), no longer
  transient — the scroll-gated auto-enter that skipped it is gone. The
  hamburger-like open/close lives **inside** the menu role as the `data-drawer`
  side drawer (base–md).
- **Visual tuning is browser-verified follow-up.** The deconstruct/build is a
  transform-only `xPercent` slide of the **single header element** (no dedicated
  scrim layer yet); the spec's full scrim/rail two-layer split and the collapsed
  rail's hanko-handle sizing (`w-8` in the `w-12` rail) need an in-browser pass.
  The slide is compositor-safe and contract-correct; geometry/feel are the open
  knobs.
- The nav reveal staggers the list items (`data-page-nav-el="item"`); if items
  become dynamic, the manager queries them once at construction — re-query if the
  list can change after boot.
