## Plan: Session-Gated Motion Playback

TL;DR: Reuse the exact mechanism reduced-motion already uses to skip animation and jump
to end state — `AbstractSection`'s `timeline.enabled` channel, which
`_applyPostIntroState()` resolves into an instant end-state jump. Gate only
`timeline.enabled` (not `trigger.enabled`, so scroll-driven side effects like
Bio's video pause/resume keep working) using the currently orphaned `SessionManager`
(sessionStorage, documented purpose: "gates one-time animations"), acquired ad hoc via
a `getSessionManager()` singleton — no `AnimationDirector` wiring. Scrubbed sections
bypass the gate entirely, mirroring the existing `isScrubbed()` bypass already coded
for reduced motion's `playIntro()` restart-jitter problem.

### Findings — how the existing system already almost does this

- **Single chokepoint already exists.** `resolveSectionMotionProfile(sectionKey,
  conditions)` in `js/choreography/config/ix/profiles.js` is the one place every
  section resolves `{ timeline: { enabled }, trigger: { enabled }, animation:
  { variant } }` from. `getActiveMotionProfileKey()` picks `'reduced'` over the
  breakpoint key when `conditions.reduceMotion` is true. This is the natural third
  input: add `conditions.sessionPlayed` (or similar) alongside `reduceMotion`.
- **End-state jump already exists.** `AbstractSection._applyResponsiveLifecycle()`
  (`js/choreography/system/AbstractSection.js`) calls `_applyPostIntroState()`
  whenever the resolved profile's `timeline.enabled` flips to `false` — it sets the
  intro timeline to `progress(1, false)` and emits `introComplete`. This is precisely
  "appear at its end state." No new end-state logic is needed — reusing the same
  channel gets this for free.
- **Events still fire even when animation is skipped.** `LandingSequence`
  (`js/choreography/templates/landing/LandingSequence.js`) is explicitly written to
  tolerate this: its own comment notes reduced motion "zeroes the hold rather than
  skipping the call — the video still emits `video:intro:complete` under a gated
  profile... so this chain must stay intact." Gating sections via the same profile
  channel means the whole hero → video → bio landing chain keeps firing in the right
  order, just instantly. **No changes needed to `LandingSequence` itself.**
- **The scrub exception is already coded — for reduced motion.**
  `AbstractSectionTriggers.isScrubbed()` reports whether a section's ScrollTrigger
  drives the timeline via scroll position. `AbstractSection.playIntro()` checks it
  *after* the lifecycle-enabled check and bails without touching the timeline,
  specifically to avoid "fighting the scrub controller for the same property
  (jitter)." Session-gating must respect the same bypass, and for the same reason:
  forcing `_applyPostIntroState()` on a scrubbed section would fight its
  scroll-driven playhead exactly like the restart case it's already guarding against.
  Concretely, scrub is per-section trigger config (`profiles.js` explicitly documents
  that scrub/pin/once are "intentionally NOT defined" at the profile level) — so the
  session bypass has to be applied where trigger config is visible, i.e. inside
  `AbstractSection`, not inside `resolveSectionMotionProfile`.
- **The persistence layer already exists, unwired.**
  `js/choreography/managers/SessionManager/SessionManager.js` reads/writes
  `sessionStorage['dataink_session']` and already exposes `hasHeroIntroPlayed` /
  `markHeroIntroPlayed()` / `reset()`. `js/choreography/managers/README.managers.md`
  documents it as: *"Persisted runtime session state; gates one-time animations"* —
  this is its stated purpose. But it is never imported by `AnimationDirector.js` or
  any section — only re-exported from the managers barrel. It needs generalizing
  from one hardcoded boolean to a per-section map, and wiring in.
- **The "ad hoc" manager pattern has a working precedent.** The same README notes
  `SessionManager` and `RulerIntroManager` are "not constructed by the Director —
  used where needed," unlike `reducedMotionHandler` (owned by
  `ScrollEffectsCoordinator`, threaded through `AnimationDirector`'s constructor to
  every section). `RulerIntroManager` (`js/choreography/managers/RulerIntroManager/RulerIntroManager.js:93-101`)
  implements this as a lazy module-level singleton: `let singleton = null` plus
  `initRulerIntro()` / `getRulerIntro()` accessors. **This precedent matters for
  correctness, not just style**: if every section instead did its own
  `new SessionManager()`, each would snapshot `sessionStorage` independently at
  construction, and whichever section's `markPlayed()` writes last would clobber
  every other section's already-recorded `played` state (last-write-wins on the
  full serialized object). A shared singleton avoids this. Mirror the
  `RulerIntroManager` factory shape exactly.
- **Section registry is fixed and small.** `js/choreography/system/registry.js`:
  `hero`, `video`, `bio`, `process`, `awards`, `organizations`, `work` — all extend
  `AbstractSection`. Gating in `AbstractSection` covers all seven with one change;
  no per-section edits needed unless a section wants to opt out.

### Design

1. **`SessionManager`** — generalize state shape from `{ heroIntroPlayed }` to
   `{ played: { [sectionKey]: true }, lastVisit }`. Replace `hasHeroIntroPlayed` /
   `markHeroIntroPlayed()` with generic `hasPlayed(sectionKey)` /
   `markPlayed(sectionKey)`. `markPlayed()` re-reads `sessionStorage` immediately
   before merging in the new key (cheap, storage is small) rather than trusting
   possibly-stale `this.state`, closing the multi-writer race even if a future
   caller ever bypasses the singleton. Add the singleton factory
   (`getSessionManager()`), same shape as `RulerIntroManager`'s.
2. **`AbstractSection`** — in `_applyResponsiveLifecycle()`, after resolving
   `profile` from `resolveSectionMotionProfile()`: if `!this.triggers?.isScrubbed?.()`
   and `sessionManager.hasPlayed(this.sectionKey)`, force
   `profile.timeline.enabled = false` before it's assigned to
   `_isLifecycleMotionEnabled`. Scrubbed sections skip this branch entirely —
   profile stays exactly as breakpoint/reduced-motion resolved it, unchanged from
   today.
3. **Marking played** — in `_onIntroComplete()` (already the single convergence
   point for both a real animated completion and an instant
   `_applyPostIntroState()` jump — both paths call it), call
   `sessionManager.markPlayed(this.sectionKey)`. Idempotent on repeat calls.
4. **Wiring (decided: Option A)** — acquire the shared instance via
   `getSessionManager()` inside `AbstractSection`'s own constructor. No
   `AnimationDirector.js` edit — matches the documented "ad hoc, not
   Director-constructed" pattern as-is. Store as `this._sessionManager`.
5. **No changes needed**: `LandingSequence.js`, `registry.js`, individual section
   subclasses (`Hero.js`, `Bio.js`, etc.), `resolveSectionMotionProfile()`/
   `getActiveMotionProfileKey()` in `profiles.js`. The gate lives entirely in
   `AbstractSection`, which every section already extends.

### Steps

1. `SessionManager.js` — generalize state shape, add `hasPlayed`/`markPlayed`, add
   singleton factory functions. → verify: unit-level manual check in devtools
   console (`sessionStorage.dataink_session` reflects a `played` map after
   scrolling through sections).
2. `SessionManager.md` — update sidecar role description for the generalized API.
3. `AbstractSection.js` — thread `sessionManager` in, add the scrub-aware gate in
   `_applyResponsiveLifecycle()`, call `markPlayed()` from `_onIntroComplete()`. →
   verify: first homepage load in a fresh tab plays hero/video/bio/awards/
   organizations/work intros normally; reloading the same tab (session persists)
   shows every section already at its end state on scroll, no animation.
4. Confirm the scrub exception holds: identify current scrubbed sections/molecules
   (card-motion sticky variant, hero's gel scrub trigger, bio's scrub-driven outro
   beats — grep `scrub: true` across `js/choreography/molecules/` and
   `config/ix/` for the current list) and manually verify their scroll-driven
   behavior is unchanged on a repeat-session load.
5. Verify the reduced-motion path is untouched: with `prefers-reduced-motion:
   reduce` (or `ACCESSIBILITY_SETTINGS.testReducedMotion`), confirm sections still
   resolve through the existing `'reduced'` profile key exactly as before —
   session-gating is additive, not a replacement of that branch.
6. Manual QA pass across breakpoints (`base`/`sm`/`md`/`lg`/`xl`) since
   `resolveSectionMotionProfile` is breakpoint-aware and the gate must hold at
   every tier, including the `card` section's `lg`/`xl` static baseline and dev
   `?cardVariant=` override, which resolve outside the shared path (see Further
   Considerations #1).
7. Update `js/choreography/managers/README.managers.md`'s roster row for
   `SessionManager`: role text still says "gates one-time animations" tied to hero
   specifically — reword for the generalized per-section API. Stays `ad hoc` in
   the lifecycle column (Decision #1).

### Decisions

1. **Wiring: Option A.** Each `AbstractSection` calls `getSessionManager()` itself
   in its own constructor. No `AnimationDirector.js` edit — matches the documented
   "ad hoc, not Director-constructed" pattern as-is.
2. **Gate only `timeline.enabled`, not `trigger.enabled`.** `ScrollTrigger` stays
   bound and `_onEnter`/`_onLeave` keep firing on repeat visits — only the
   animation replay is suppressed. Concretely, this keeps Bio's
   `enter`/`exit`-driven background-video play/pause
   (`_resumeBackgroundVideo`/`_pauseBackgroundVideo` in `LandingSequence`) working
   on a repeat visit, since that's functional video state, not animation replay.

### Further Considerations

1. **`card` section's dev/variant overrides bypass the shared profile path.**
   `resolveSectionMotionProfile()` has an early return for `sectionKey === "card"`
   when the `?cardVariant=` query override is present, and `lg`/`xl` breakpoints
   already resolve to `CARD_STATIC` (`timeline.enabled: false`) as their normal,
   non-reduced baseline (issue #147, dev-baseline card motion is off by design).
   Session-gating logic added in `AbstractSection` runs after profile resolution,
   so it composes fine with both cases (a profile that's already
   `timeline.enabled: false` just stays that way) — flagging only so QA doesn't
   mistake `card`'s existing static-breakpoint behavior for a session-gating bug.
2. ~~`playLanding()` has no end-state jump.~~ **Fixed during implementation.**
   This was flagged here as a pre-existing reduced-motion-only gap, then hit
   immediately in practice: session-gating makes the cold-start-disabled case
   the *common* path (every repeat visit, not just `prefers-reduced-motion`),
   and `LandingSequence.start()`'s first call is `video.playLanding()` — so the
   landing timeline never settling meant the very first post-preloader beat
   looked stuck. Added `_applyPostLandingState()` to `AbstractSection.js`
   (mirrors `_applyPostIntroState()`) and call it from `playLanding()`'s
   disabled branch, same shape as `playIntro()`'s existing handling.
3. **Scope: homepage sections only, confirmed by `SECTION_REGISTRY`.** The seven
   registered sections are homepage-scoped; `AbstractSection` self-disables via
   `isDisabled = !view` on pages where a section's element doesn't exist, so this
   naturally doesn't touch project/work-listing pages.
3a. ~~Preloader out of scope.~~ **In scope as of implementation** — user
   confirmed the preloader itself must not display at all on repeat visits, not
   just settle instantly. `js/preloader/Preloader.js`'s `initPreloader()` isn't
   part of `SECTION_REGISTRY`/`AbstractSection` (preloader is intentionally
   GSAP/choreography-independent — "preloader visibility can start without
   GSAP"), so gating lives in `Preloader.js` itself, reusing the same
   `SessionManager` via a new `hasVisited()`/`markVisited()` pair (distinct from
   per-section `hasPlayed`/`markPlayed`, since a visitor can leave before any
   section finishes and still count as "visited"). On a return visit:
   `animateIntro()` is skipped, `data-preloader-state="exit"` is set
   immediately instead of via `animateExit()`'s CSS-transition-driven promise
   (which would otherwise hold `preloaderOut` for its ~1.6s no-op fallback),
   and `preloaderOut` dispatches directly — but `waitForPreloaderReadiness()`
   (fonts/DOM/`directorReady`) still runs underneath, unchanged, so the
   `director:ready → preloader:out → LandingSequence` boot gate is never
   bypassed. Scroll-lock and the resource-observer filetype message are also
   skipped (no-op) — nothing is visible for either to serve.
   **Known residual risk, not fully closed:** `initPreloader()` runs from a
   `type="module"` script (`choreography-script.njk`), which defers until
   after HTML parsing completes — but the pulsing loader animation
   (`hanko-loading-pulse` in `styles/components/hanko.css`) is CSS-only,
   running by default from first paint with no JS required to start it. So
   there's a real (likely sub-~300ms, unmeasured) window where the pulse could
   still flash before the module script sets `data-preloader-state="exit"`.
   **Closed.** Added a synchronous, non-module inline `<script>` immediately
   after `</header>` in `views/organisms/header/home/home-landing.njk` (see
   that file's sidecar, "Repeat-visit pre-paint check"). It re-checks
   `sessionStorage["dataink_session"].visited` directly (can't import the
   `SessionManager` module — must run synchronously, pre-paint) and sets
   `data-preloader-state="exit"` before first paint if true. Duplicates the
   storage key/shape and the `PRELOADER_STATE` attribute/value from
   `js/preloader/constants.js` by necessity; both call sites note the other
   and must be kept in sync if either changes.
4. **Reset/debug affordance.** `SessionManager.reset()` already exists. Worth
   deciding whether to expose a dev console hook (mirroring `window.__scrollSmoother`
   in `js/preloader/preferences.js`) for QA to clear session-played state without
   closing the tab — e.g. `window.__session.reset()`.
