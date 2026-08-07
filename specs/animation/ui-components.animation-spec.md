---
id: spec.animation.ui-components
title: Looping horizontal index-and-dwell UI-components sequence
status: draft
owner: Russell Lebo / Frontend Choreography
tags:
  - "#animation-spec"
  - "#choreography"
  - "#frontend"
  - "#home-landing"
---

# UI Components Animation — Motion Spec

- **Title:** Process Section — Looping index-and-dwell UI-components sequence
- **Owner(s):** Frontend / Motion System Maintainers
- **Status:** draft
- **Last reviewed:** 2026-07-13
- **Scope:** A decorative looping SVG scene in the Process section, delivered as a new variant of the existing `process` organism. Touches [../../views/organisms/section/process.njk](../../views/organisms/section/process.njk) (inline SVG + hooks), [../../js/choreography/molecules/process-motion/process-motion.js](../../js/choreography/molecules/process-motion/process-motion.js) (variant registration), and a new scene module beside [../../js/choreography/molecules/process-motion/blockframes.js](../../js/choreography/molecules/process-motion/blockframes.js) (the precedent to follow).
- **Links:** motion system [choreographer.animation-spec.md](choreographer.animation-spec.md), reduced-motion policy [motion-accessibility-policy.md](motion-accessibility-policy.md), tokens [../../js/choreography/tokens/motion/motion.js](../../js/choreography/tokens/motion/motion.js), token helpers/constants [../../js/choreography/config/ix/motion.js](../../js/choreography/config/ix/motion.js), profiles/overrides [../../js/choreography/config/ix/profiles.js](../../js/choreography/config/ix/profiles.js), selectors [../../js/choreography/config/contracts/selectors/selectors.js](../../js/choreography/config/contracts/selectors/selectors.js), source SVG [../../assets/svg/ui components anim.svg](../../assets/svg/ui%20components%20anim.svg)

> **Integration note.** A `process` organism already exists as the standard triad — [Process.js](../../js/choreography/organisms/process/Process.js), [ProcessAnimations.js](../../js/choreography/organisms/process/ProcessAnimations.js), [ProcessTriggers.js](../../js/choreography/organisms/process/ProcessTriggers.js) — with variant factories in `PROCESS_VARIANT_FACTORIES` (currently `blockframes`, `reduced`). This scene is added **within** that structure as a new variant, not as a standalone module. Do not introduce a `sections/` folder or a bespoke `init()` API; both contradict the current architecture.

## Intent

Create a decorative, seamlessly looping horizontal sequence of UI components from the inlined SVG ([../../assets/svg/ui components anim.svg](../../assets/svg/ui%20components%20anim.svg)) shown inside the Process section.

> **Replacement, not additive.** `process` variants are mutually exclusive (one-of-N; `Process.js` resolves a single `variant` per breakpoint). Selecting `ui-components-loop` therefore **replaces** the `blockframes` visual at the breakpoints it is wired to — the two cannot coexist in the same profile. If the intent is ever to show this loop *alongside* blockframes, the variant channel is the wrong lever and a second, independently-registered scene hook would be required — do not attempt it through `SECTION_OVERRIDES`.

The sequence uses an index-and-dwell pattern:

- **Index:** advance exactly one item.
- **Dwell:** pause while that item occupies the highlighted position.
- **Loop:** continue from the final item back to the first without a visible jump.

## Motion Principles

- Continuous, calm ambient loop — this is spatial/temporal texture, not a reveal.
- Transform-only motion (`x` translate of the track). No opacity, scale, rotation, bounce, or overshoot.
- Non-uniform slots — each item parks at its own x in the artwork; the track translates so each item's x aligns under the fixed `hero-start` marker (`track.x = heroStartX − itemX`). Animation order is by **ascending item x** (measured at init), not SVG DOM order, so the track only ever moves left and items always enter from the right.
- One repeating GSAP timeline. Never `setInterval`.

## Required Behavior

- The browser chrome (`uicomponents-chrome`) and the `hero-start` highlight position remain stationary; only the `uicomponents-track` translates.
- Items move from right to left within the crop (the outer svg's own `viewBox`/overflow clip — set to the CHROME bbox — is the clipped viewport; no separate clip element).
- Each transition advances the track to the next item's x (by ascending x), never more than one item at a time.
- Each item pauses in the highlighted position before the next transition.
- The final-to-first wrap has no visible jump, gap, overlap, or direction change.

## Lifecycle & Integration

This scene is a continuous, self-driving loop scoped to the section's viewport visibility. It hangs off the `buildIntro` factory hook — the only lifecycle slot the factory contract actually exposes. **Note the factory shape:** `ProcessAnimations` consumes `buildIntro` / `buildOutro` only; `_buildIdle()` returns a hardcoded empty timeline and never consults the factory. So despite being an ambient loop, this is registered as a `buildIntro` factory, exactly like blockframes — do **not** describe or wire it as an "idle" timeline, and do not add a `buildIdle` hook (that is a factory-contract change, out of scope).

Follow the [reveal.js](../../js/choreography/molecules/process-motion/reveal.js) → [blockframes.js](../../js/choreography/molecules/process-motion/blockframes.js) precedent: the `buildIntro` function fires a self-contained, idempotent scene as a side-effect (it owns its own ScrollTrigger with a stable id and kills the prior instance on rebuild), then returns an empty intro timeline so `AbstractSection.playIntro` has something to bind while the scene stays scroll-owned.

- **Registration:** add a `ui-components-loop: { buildIntro: <sceneFn> }` factory to `PROCESS_VARIANT_FACTORIES` in [process-motion.js](../../js/choreography/molecules/process-motion/process-motion.js). It is selected by pointing the relevant `SECTION_OVERRIDES["process"][profile].animation.variant` at it in [profiles.js](../../js/choreography/config/ix/profiles.js) (replacing `blockframes` there — see the Intent replacement note). `Process.js` already reads the resolved variant and calls `animations.rebuild(...)`, so no new Director/registry wiring is required.
- **Own ScrollTrigger:** build one repeating timeline (paused) plus one ScrollTrigger keyed by a stable id (e.g. `process-uicomponents-loop`). Call `ScrollTrigger.getById(id)?.kill()` before creating a fresh one so matchMedia/resize rebuilds never stack duplicates. **Reuse blockframes' _structure_ (self-owned trigger + kill-by-stable-id), not its trigger _config_:** blockframes fires once (`once: true`) and has no leave/reset semantics. This loop must NOT use `once`; drive `play` / `pause` + reset through `onEnter` / `onLeave` callbacks (or `toggleActions`) per the beats below.
- **Initial state:** first item in the highlighted position; timeline paused.
- **Enter (`onEnter` / `onEnterBack`):** play the loop.
- **Leave (`onLeave` / `onLeaveBack`):** pause and immediately reset to the initial state (first item highlighted). Support both scroll directions.
- **Re-entry:** always restart from the first item.
- **Refresh:** re-measure geometry without creating duplicate timelines or ScrollTriggers.
- **Teardown:** killing the variant/section removes the timeline, its ScrollTrigger, and listeners, then restores the initial state. Reverts must flow through the standard rebuild/kill path, not ad-hoc cleanup.

## SVG Hook Contract

Resolve inner hooks with the section's `data-process-el` attribute (`PROCESS_SELECTORS.elementAttribute`), consistent with the rest of the organism — never a `data-anim-*` namespace and never CSS classes.

The real artwork is a composite browser-window mockup (Pixelmator export), **not** a sequence of uniform slots. It resolves to these hooks:

```html
<!-- viewBox is the CHROME bbox → the outer svg's own overflow clip is the crop -->
<svg data-process-el="uicomponents" viewBox="2471 548 590 606"
     aria-hidden="true" focusable="false">
  <g data-process-el="uicomponents-chrome">...</g>   <!-- CHROME: fixed window frame -->

  <g data-process-el="uicomponents-track">           <!-- HERO: GSAP translates its x -->
    <g data-process-el="uicomponents-item">...</g>   <!-- 7 HERO item children -->
    <!-- ...pars, image-card, title-and-abstract, cards, map, charts, team... -->
    <g data-process-el="uicomponents-hero-start" opacity="0">...</g> <!-- dwell/destination marker -->
  </g>

  <!-- ASIDE + BODY: fixed mockup content composed inside the CHROME crop -->
</svg>
```

- **Per-item alignment, not slots.** Items sit at fixed, non-uniform x across the wide canvas. Each is brought under the highlight by translating the track to `heroStartX − itemX`, where `heroStartX` is the x of the invisible `uicomponents-hero-start` marker (read once at init via `getBBox`). There is no `data-slot-width` / uniform-pitch contract.
- **Ordering.** Animate items by **ascending x** (canvas left→right), which makes the track target strictly decreasing → the track only moves left and items enter from the right (Motion Principles: "items move right→left", Acceptance: "no direction change"). This artwork's raw DOM order is spatially non-monotonic; animating in DOM order reverses direction between items, so x-order is the realization of "item order defines the animation order" that satisfies the motion constraints.
- **Crop.** The outer `<svg>` `viewBox` equals the `CHROME` group's bbox (`2471 548 590 606`); the svg's default overflow clip is the browser window, so no separate `uicomponents-viewport` clipPath is required.
- **hero-start.** Kept inside the track, rendered invisible (`opacity="0"`, must not paint), read once for the destination x, then it rides the track harmlessly.
- Inline the SVG in [process.njk](../../views/organisms/section/process.njk) via the `ui-components-loop` atom; keep all animation logic in the choreography module.

## Motion Tokens

Pull all timing/easing from the token system — no magic numbers. Consume tokens via the `motion.*` helpers / named constants exported from [config/ix/motion.js](../../js/choreography/config/ix/motion.js), which derive from [tokens/motion/motion.js](../../js/choreography/tokens/motion/motion.js).

| Role             | Token           | Value                            |
| ---------------- | --------------- | -------------------------------- |
| Index transition | `duration.base` | 460 ms                           |
| Dwell            | `duration.slow` | 660 ms                           |
| Ease             | `ease.standard` | `cubic-bezier(0.4, 0.0, 0.2, 1)` |

**Units gotcha:** `motionTokens.duration` values are in **milliseconds**. GSAP durations are seconds — divide by 1000 (`motion.duration("base") / 1000`) or use a pre-converted `…DEFAULTS` constant. `stagger` tokens are already seconds.

## Accessibility

The SVG is decorative:

- Set `aria-hidden="true"` and `focusable="false"`.
- Do not introduce keyboard-focusable controls.

Reduced motion is handled **by the profile system**, not an inline `prefers-reduced-motion` check (which the choreography contracts reject). `SECTION_OVERRIDES["process"].reduced` already resolves to the `reduced` variant, so no new profile wiring is needed. That `reduced` treatment must:

- Never create the looping timeline.
- **Actively `gsap.set()` the canonical initial state (first item highlighted).** The resting state has an explicit owner — do not assume it. The current shared `reduced` factory (`reducedIntro` in [process-motion.js](../../js/choreography/molecules/process-motion/process-motion.js)) returns an empty timeline and sets nothing, and the source SVG has no default-highlighted markup, so relying on either as-is leaves no first-item highlight. Resolve one of: (a) give this scene its own reduced/static builder that `gsap.set()`s the first item, or (b) author the inlined SVG so its default markup renders the first item highlighted (then the empty `reduced` variant is sufficient). Pick one in implementation; do not leave both empty.

## Performance & Budget

- Target smooth 60fps; animate the track's `transform` only.
- Pause the timeline outside the active ScrollTrigger range.
- Measure geometry on init/refresh, not per cycle.
- Do not create duplicate timelines, ScrollTriggers, or listeners.
- Avoid permanent `will-change` unless profiling shows a need.
- **Inline weight:** the source SVG is ~84 KB. Inlining it into `process.njk` adds that to the home document's HTML payload and DOM node count (parse + layout cost). Before inlining, minify/optimize the SVG (drop editor metadata, collapse groups not needed as hooks) and confirm the trimmed size against the section's budget.

## Acceptance Criteria

- The first item is highlighted before the animation starts.
- The track advances exactly one item per transition.
- Every item receives one dwell period in sequence.
- The final-to-first transition has no visible jump, gap, overlap, or direction change.
- Leaving the active range immediately restores the first item.
- Re-entering starts from the first item.
- Resizing preserves correct alignment.
- Reduced-motion mode contains no horizontal movement or timed cycling and shows the first item highlighted.
- Rebuild/refresh does not create duplicate timelines or ScrollTriggers.
- Section/variant teardown restores the initial state.
- The scene is a registered `process` variant driven by `SECTION_OVERRIDES`; no `sections/` folder, bespoke `init()` API, or Director/registry changes are introduced.
- No unrelated templates, tokens, or choreography modules are refactored.
