---
title: "Preloader package review — consolidation, conflicts, brittleness"
description: "Review of js/preloader/ as it stood on 2026-09-14 (10 files, 1081 lines) against what the site renders. Found ~two-thirds dead or redundant, an unbounded director gate, an exit that always hit its 1600ms fallback, and docs describing a preloader that no longer existed. The ranked plan in §5 was implemented on 2026-09-15 — see the implementation note at the end."
type: guide
status: historical
tags:
  - preloader
  - choreography
  - review
links:
  - "[[README.preloader|preloader/README.preloader]]"
  - "[[preloader-integration-checklist|preloader-integration-checklist]]"
  - "[[hanko|hanko.css]]"
---

# Preloader package review

Scope: `js/preloader/` plus its three touchpoints — the bootstrap partial
([choreography-script.njk](choreography-script.njk)),
the markup it targets ([home-landing.njk](../views/organisms/header/home/home-landing.njk)
+ [session-management-script.njk](../views/templates/partials/session-management-script/session-management-script.njk)),
and the CSS that owns the visuals ([hanko.css](../styles/components/hanko.css)).
Read-only. Implementation conflicts are named here and left for a later pass.

## 1. What the preloader actually does today

Strip the package to the code paths that execute on the live home page and the
strategy is small:

```
module boot (inline <script type="module">, runs on every page that includes choreography-script.njk)
  ├─ no [data-preloader] on page → warn + return           (contact, projects)
  └─ home
     ├─ SessionManager.hasVisited() → isReturnVisit; markVisited()
     ├─ first visit: lock html/body overflow, capture scrollY
     ├─ wait: fonts.ready (≤2000ms) → director:ready (unbounded)
     ├─ first visit: set data-preloader-state="exit" → CSS settles hanko (0.4s)
     │             wait for hgroup animationend OR 1600ms  ← always 1600ms (see §3.1)
     │  return:    dispatch preloader:out immediately (state already set pre-paint)
     ├─ dispatch preloader:out  → LandingSequence.start(), HomeHeaderManager._arm()
     └─ cleanup: restore overflow/scroll, main[aria-busy=false], hydrate data-defer-video
```

Everything not on that path — intro animation, filetype "Loading X..." messages,
ScrollSmoother preference + loader, console image, message-string tables — is
carried but never observable. That is the headline: the package is ~1081 lines
for a ~120-line strategy.

Evidence for "never observable", by subsystem:

| Subsystem | Files / lines | Why dead |
| --- | --- | --- |
| Intro animation (`animateIntro`) | `animations.js` L19–56, `PRELOADER_ANIMATION` intro/fallback keys | Targets `[data-preloader-stack]`; no template renders it (grep `views/` → 0 hits). `stack` is always `null` → early return. |
| Filetype loading messages | `resource-observer.js` (86 lines), `PRELOADER_RESOURCE_OBSERVER`, `PRELOADER_RESOURCE_MESSAGES` | Writes to `[data-preloader-text]`; no template renders it. `PerformanceObserver` is still started and disconnected on every first visit for nothing. |
| ScrollSmoother preference + DX hooks | `preferences.js` (81), `scroll-smoother.js` (100), 8 `SCROLL_SMOOTHER_*` constants, `PRELOADER_SCROLL_SMOOTHER_MESSAGES` | Three layers of dead: (a) `ScrollEffectsCoordinator.initialize()` already calls `getSmoother()` eagerly during Director boot, before the preloader ever exits — the "delegated" path just re-fetches and discards it; (b) the "standalone" path needs `data-gsap-src`, which no template sets → returns `null`; (c) no `#smooth-wrapper`/`#smooth-content` exists in `views/`, so `ScrollSmootherManager._isAvailable` is `false` and no smoother is ever created anywhere. The `?scrollSmoother=` / `localStorage.scrollSmoother` preference and `window.__scrollSmoother` control nothing. |
| Console image | `logger.js` L3–109 (~105 of 129 lines), `PRELOADER_ASSET`, `PRELOADER_LOGGER.consoleImageStyle/image/fallback*` | Gated off by `consoleImageEnabled: false`. |
| DOM-ready gate | `readiness.js` L51–66, `PRELOADER_TIMINGS.domReadyTimeoutMs`, `PRELOADER_READINESS.documentLoadingState/domContentLoadedEvent` | The bootstrap is a `<script type="module">` — deferred, so `document.readyState` is already `"interactive"` when it runs. `domReady` resolves synchronously every time; the 1800ms race never engages. |
| Trace messages | 16 of 21 `trace(...)` calls are commented out; `PRELOADER_*_MESSAGES` tables hold 105 keys | Only 5 traces are live. 15 constant keys are referenced by nothing at all (`exitFallback*`, `gsapExit*`, `stackExitTo`, `reducedMotion*`, `opacityHidden`, `preloaderElementRemoved/CleanupFailed`, …). |

## 2. Redundancies and conflicts (flagged, not fixed)

### 2.1 Two owners of the `data-defer-video` contract
`deferred-videos.js` hydrates `video[data-defer-video][data-src]` at cleanup —
sets `preload=metadata`, assigns `src`, strips both data attributes, respects
`data-motion-optional` under reduced motion, calls `load()`.
[BackgroundVideo.js](../js/choreography/organisms/background/BackgroundVideo.js) L27–35
independently does the same hydration in `_ensureVideoReady()` — but sets no
`preload`, strips nothing, and ignores `data-motion-optional`. Whichever runs
first wins; the other's guard (`if (video.src) return` / `src !== dataset.src`)
happens to make them coexist. One attribute contract, two implementations with
different semantics.

### 2.2 Preloader is not choreography-independent
`PRELOADER_LOGGER.description` and the vendor README claim "preloader visibility
can start without GSAP". Visibility is CSS, true — but `Preloader.js` imports
`EVENTS` and `SessionManager` from `js/choreography/`, and `SessionManager` pulls
Lumberjack. In no-bundle mode the preloader module graph overlaps the Director's
(deduped by URL, so no double-eval, but the coupling is real and undocumented).

### 2.3 Home-page-only feature, site-wide bootstrap
`choreography-script.njk` is included by `home.njk`, `contact.njk`, and
`landing.njk` (projects). On the two non-home pages, `initPreloader()` prints the
multi-sentence `PRELOADER_LOGGER.description` paragraph to the console, then
warns "No preloader element found", then returns. Pure noise, and the description
itself is stale (it says the exit waits for "BackgroundVideo announces it is
ready" and "removes itself from the DOM" — neither has been true since the
2026-06-16 redesign).

### 2.4 Logger duplicates Lumberjack
Every other runtime module uses `Lumberjack.createScoped(...)` with per-scope
enable/colour/levels. The preloader rolls its own three-function logger with a
hard-coded colour and no enable switch — which is why the description paragraph
can't be silenced without editing code.

### 2.5 Docs describe three different preloaders
- [home-landing.md](../views/organisms/header/home/home-landing.md) L33–52: describes a
  hidden hgroup (`opacity: 0` until outro), a FLIP of the hanko into flow via
  `--hanko-flip-from-x`/`--hanko-move-duration`, a `hanko-enter` reveal, and the
  header dropping its fixed overlay. **None of that exists in `hanko.css`** —
  the current file explicitly says the hgroup "stays visible the whole time" and
  the header "REMAINS a fixed full-viewport overlay".
- [preloader-integration-checklist.md](preloader-integration-checklist.md): "hgroup
  `animationend` ends the exit" (no longer fires — §3.1), "three readiness gates"
  (one is dead — §1), "keep `data-gsap-src` support" (never wired).
- [specs/animation/homepage-initialization.animation.md](../specs/animation/homepage-initialization.animation.md)
  step 03: "polls the page load until the video file is ready" — the video is
  not a gate; `director:ready` is.
- [js/vendor/README.vendor.md](../js/vendor/README.vendor.md): "preloader looks to
  see if GSAP is stored locally" — the `gsapSrc` path is unreachable.
- `constants.js` L82–85 comment: "must comfortably exceed the hanko move (0.6s)
  plus the hgroup enter (0.75s)" — neither animation exists; the real settle is
  0.4s.
- 6 of 10 `.js` files have **no sidecar** (`dom`, `deferred-videos`,
  `preferences`, `readiness`, `resource-observer`, `scroll-smoother`); the other
  4 are untouched auto-stubs. `session-management-script.njk` has no sidecar.
  `choreography-script.md` is a generic stub ("Likely used by: Unknown"). All
  violate the every-file-gets-a-sidecar non-negotiable.

## 3. Stability and brittleness

### 3.1 The exit always takes the 1600ms fallback — and any child animation could short-circuit it
`animateExit` resolves on `hgroup` `animationend` or after
`cssOutroFallbackMs` (1600). The CSS outro no longer animates the hgroup; the
only animated descendants are the hanko paths, whose infinite pulse is *cancelled*
(`animation: none` → `animationcancel`, never `animationend`). So on every first
visit `preloader:out` — the seam that starts `LandingSequence` and arms
`HomeHeaderManager` — fires ~1.2s after the hanko has visibly settled (0.4s).

Conversely, `animationend` bubbles: the first finite CSS animation anyone adds
to any hgroup descendant would resolve the exit at that animation's end, silently
re-timing the whole landing chain. The contract ("hgroup animationend") is both
currently dead and accidentally load-bearing.

**Direction:** listen for `transitionend` on the hanko settle (the animation
that actually runs), or drop the event entirely and use a timeout equal to
`--hanko-settle-duration`. Either makes the handoff match the visual.

### 3.2 `director:ready` is an unbounded gate on the hero
Fonts are bounded (2000ms). DOM is bounded (and dead). Director is not: if
`AnimationDirector.js` (or `bundle.js` *and* its fallback) fails to load, the
promise never resolves, the scroll lock never lifts, `main` stays `aria-busy`,
and the page is stuck on the splash. The fonts comment in `constants.js` L70–75
is exactly right about why unbounded waits are dangerous — the same reasoning
applies one line down and was not applied.

**Direction:** race the director gate against a generous timeout (e.g. 6–8s) and
warn once when it trips. The hero is already visible; the cost of a late Director
is a late landing chain, not a broken page.

### 3.3 `"instant" in window` is always false
`dom.js` L47: `PRELOADER_STYLE_VALUES.scrollBehaviorInstant in window` checks
for a global named `instant`. It never exists, so restoration always uses
`behavior: "auto"`. Harmless today (scrollY at boot is ~0 and the lock is only
ever restored to that), but it's a feature-detect that detects nothing.

### 3.4 Return-visit correctness depends on two scripts agreeing on a storage shape
`session-management-script.njk` (pre-paint, inline) and `SessionManager.js`
(module) both read `sessionStorage.dataink_session` and both hard-code the key
and the `visited === true` shape. Nothing links them; a rename in one silently
reintroduces the splash flash the inline script exists to prevent. Worth a
comment cross-reference at minimum, or having the inline script read a single
exported constant at build time.

### 3.5 Deferred video downloads start *after* the outro
`hydrateDeferredVideos` runs in `cleanup()`, which runs in `finally` — after
`animateExit` resolves, i.e. after `preloader:out`. The 1600ms (really 0.4s +
1.2s idle) outro window is never used to warm the sizzle video. `LandingSequence`
later awaits `_ensureVideoReady()` and its comment assumes "the preloader has
long since hydrated" — true only because the hero hold that follows is longer
than the download. If `HOME_HERO_HOLD` shrinks, the video intro stalls.

**Direction:** hydrate at readiness (just before the state flip) rather than at
cleanup. The video is not the LCP element, so this costs nothing on the metric
the deferral was protecting.

### 3.6 `markVisited()` fires before the splash succeeds
The session is marked visited at the top of `initPreloader`, before any gate is
awaited. A first visit that hangs on §3.2 and gets reloaded will skip the splash
on reload — which is arguably the *desired* recovery, but it's incidental, not
designed. Note only.

## 4. DX consolidation — recommended shape

Target: one file the size of §1's diagram plus one shared constants block, using
the project's existing logger. Rough shape (not a spec):

```
js/preloader/
  Preloader.js        orchestration: session check, scroll lock, gates, exit, cleanup  (~120)
  deferred-videos.js  keep — OR move into BackgroundVideo and make it the single owner (§2.1)
  constants.js        SELECTORS, STATE, TIMINGS (fontsReady, directorReady, settle)     (~40)
  README.preloader.md package sidecar: the §1 diagram + the three contracts
```

Delete outright: `animations.js` (intro dead; exit is 15 lines — inline it),
`resource-observer.js`, `preferences.js`, `scroll-smoother.js`, `logger.js`
(replace with `Lumberjack.createScoped("Preloader")`), `dom.js` (three small
functions — inline into `Preloader.js`). Inline the five live trace strings;
drop the `*_MESSAGES` tables.

Net: 10 files / 1081 lines → 3–4 files / ~200 lines, zero behaviour change on
the home page, quieter console on every other page.

## 5. Ranked plan

Value-for-cost order. Effort is for the change itself; docs/sidecars for each
are included in the estimate.

**Do now**
1. **Bound the director gate** (S) — §3.2. Only item with a user-facing failure mode.
2. **Fix the exit signal** (S) — §3.1. `transitionend` on the settle, or a timeout
   matched to `--hanko-settle-duration`. Recovers ~1.2s on every first visit's
   landing chain; removes the bubbling-`animationend` trap.
3. **Delete the dead subsystems** (M) — §1 table + §4. Mechanical; the only
   judgement call is whether `deferred-videos.js` stays here or moves to
   `BackgroundVideo` (recommend: move, single owner — §2.1). Land with the
   package README so the sidecar debt is paid in the same commit.

**Minor**
4. **Hydrate video at readiness, not cleanup** (S) — §3.5. Do it inside item 3
   since `cleanup()` is being rewritten anyway.
5. **Rewrite the stale docs** (S–M) — §2.5. `home-landing.md` motion contract
   section, checklist, spec step 03, vendor README, `constants.js` comment.
   `home-landing.md` is the one that actively misleads; do it first.
6. **Silence non-home noise** (S) — falls out of item 3 once the logger is
   Lumberjack and the element check precedes any logging.

**Leave alone**
- `session-management-script.njk` pre-paint check — correct as designed; add the
  cross-reference comment (§3.4) and its missing sidecar, nothing more.
- `readiness.js` fonts race — correct and well-commented; it survives into the
  consolidated `Preloader.js` unchanged.
- `"instant" in window` (§3.3) — dies with `dom.js` in item 3; not worth a
  standalone fix.

## Verification for whoever picks this up

- Rendered `_site/index.html`: `[data-preloader]` present, `[data-preloader-stack]`
  / `[data-preloader-text]` absent, no `data-gsap-src` / `data-scroll-smoother`.
- `grep -rn "smooth-wrapper" views` → 0 hits (ScrollSmoother never instantiates).
- `hanko.css` L178–184: exit state declares `animation: none` + `transition`
  on the paths, nothing on the hgroup → no `animationend` reaches the listener.
- `git log --oneline -- js/preloader` — last substantive change was the
  session-gated return-visit path (`19b25d2c`, 2026-08-29); `hanko.css` last
  changed 2026-06-18. The dead subsystems predate both — none reflects a recent
  decision.

## Implementation note (2026-09-15)

All of §5 landed, plus one finding the review missed: on pages without a
preloader (`/work`, `/contact`) `initPreloader()` returned before
`hydrateDeferredVideos()`, so the 15 deferred card videos on `/work` never
received a `src`. Hydration now runs on every page.

- `js/preloader/` is three files: `Preloader.js`, `constants.js`,
  `deferred-videos.js`, plus `README.preloader.md` and real sidecars.
- Director gate bounded (`directorReadyTimeoutMs`, 8000ms, warns once).
- Exit resolves on `transitionend` from inside `.hanko-mount` or
  `settleFallbackMs` (600ms > `--hanko-settle-duration` 0.4s).
- Video hydrates at readiness, before the exit flip.
- `BackgroundVideo._ensureVideoReady()` no longer assigns `src`;
  `deferred-videos.js` is the single owner.
- Logging via scoped Lumberjack; non-home pages are silent.
- Stale docs rewritten: `home-landing.md`, the integration checklist, the
  homepage-initialization spec step 03, `README.vendor.md`, the
  landing-motion-sequence diagram doc.
