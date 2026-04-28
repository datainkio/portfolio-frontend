- **Title:** Choreographer Module — GSAP/Tailwind Motion Implementation & Selection
- **Owner(s):** Frontend / Motion System Maintainers
- **Status:** draft
- **Last reviewed:** 2026-01-18
- **Scope:** All animated UI and page choreography across the portfolio frontend (11ty/NJK templates, components, and views). Applies to micro-interactions (Tailwind-first candidates) and choreographed sequences (GSAP-first candidates).
- **Links:** context {{/context/motion.md}}, ADRs {{/docs/decisions/motion-*.md}}, runbooks {{/docs/runbooks/motion-debug.md}}

## Work plan (2026-01-22)

- Define Concierge module contract (inputs, triggers, outputs, acceptance criteria) so routing can target it.
- Convert the rubric into an explicit scoring/decision procedure the module must emit in outputs.
- Add a response template (recommendation, rationale, plan, reduced motion, performance, file paths).
- Capture file-path conventions and hook naming for scene registration so answers stay deterministic.
- Resolve open questions: canonical GSAP scene layout and whether to elevate the rubric to an ADR.

## Motion Principles

- **Cohesion over novelty:** Motion should feel like a single system: shared timing, easing families, and interaction intent.
- **Transform/opacity first:** Prefer GPU-friendly properties (transform, opacity, filter sparingly). Avoid animating layout properties unless justified.
- **State clarity:** Animations must preserve clear UI state at rest (no ambiguous mid-states as defaults).
- **Reduce motion is first-class:** Every pattern must define a motion-reduced variant.
- **Rapid iteration:** Optimize the developer loop—easy to tweak timings and sequencing without hunting through templates.
- **Least power that works:** Prefer Tailwind when it fully satisfies requirements; prefer GSAP when choreography, measurement, or scroll linkage is required.

## Primitives & Utilities

### Canonical Sources

- Motion tokens: [config/motion.js](../../js/choreography/config/motion.js) (single source of truth for durations, eases, distances, staggers; used by GSAP + Tailwind)
- Tailwind mapping: [tailwind.motion.config.cjs](../../js/choreography/tailwind.motion.config.cjs) (maps tokens into duration/ease utilities; keep import order consistent with main Tailwind setup)
- Accessibility policy: [motion-accessibility-policy.md](motion-accessibility-policy.md) (reduced-motion rules and strategies)

### Shared Motion Tokens (source of truth)

- **Durations:** fast / base / slow (project-defined ms)
- **Eases:** standard / enter / exit / emphasis (project-defined curves)
- **Staggers:** tight / base / loose (project-defined offsets)

Implementation guidance:

- GSAP: import tokens from `config/motion.js`; do not hard-code timings/eases.
- Tailwind: rely on the utilities emitted by `tailwind.motion.config.cjs`; avoid ad-hoc durations/eases in templates.

### Tailwind Utilities (when Tailwind is selected)

- Custom utilities should map to motion tokens:
  - duration-\* classes map to duration tokens
  - ease-\* classes map to easing tokens
  - motion-safe / motion-reduce variants required for all animated utilities
- Prefer component-scoped class bundles (e.g., via @apply or named utility groups) to reduce template noise.

### GSAP Primitives (when GSAP is selected)

- **Scene modules:** One scene per file exporting:
  - init(root, opts) -> returns controller with kill() / refresh() as needed
  - kill() must remove ScrollTriggers/tweens/listeners
- **Timelines:** Label-first timelines with consistent naming; avoid anonymous, unlabelled long chains.
- **Hooks:** Use stable DOM hooks (data-attributes) over brittle selectors:
  - data-anim="<scene>" on root
  - data-anim-item for children
  - optional data-anim-trigger overrides
- **File structure & registration:**
  - Place GSAP scenes under `frontend/js/choreography/sections/<Scene>/<Scene>.js` (or `sequences/` for multi-section flows) and export init/kill.
  - Register scenes via the Director/Stage wiring (e.g., `Director.js`) so lifecycle and bus events remain centralized.
  - Keep shared helpers (e.g., reduced-motion guards, measurement utilities) under `frontend/js/choreography/managers/` or `utils/` to avoid per-scene duplication.

### How to consume motion tokens (copy/paste)

- **GSAP:**

  ```js
  import {
    motion,
    motionTokens,
  } from "../../../../js/choreography/config/motion.js";

  const tl = gsap.timeline({
    defaults: {
      duration: motion.duration("base"),
      ease: motion.ease("standard"),
    },
  });
  tl.from(items, {
    y: motion.distance("md"),
    stagger: motion.stagger("base"),
    opacity: 0,
  });
  ```

  > Adjust the relative import path to match the file location.

- **Tailwind:** use utilities emitted by `tailwind.motion.config.cjs`; keep motion gated:
  ```html
  <button
    class="
    motion-safe:duration-base motion-safe:ease-enter motion-safe:transition-transform motion-safe:hover:-translate-y-1
    motion-reduce:transition-none motion-reduce:transform-none
  "
  >
    Action
  </button>
  ```

## Patterns by Component/View

### Tailwind-first Patterns (micro-interactions)

Use Tailwind if ALL are true:

1. Discrete transition between two states (open/closed, selected/unselected, hover/focus)
2. No scroll coupling (no scrub/pin/parallax)
3. No layout measurement needed (no animating to/from auto height unless handled without measurement)
4. No choreography beyond trivial delay
5. Limited element count (<= ~6 animated elements)

Examples:

- Button/links hover and focus affordances
- Simple dropdown open/close using opacity/scale and state classes
- Selected state transitions for tabs/pills

### GSAP-first Patterns (choreography)

Use GSAP if ANY are true:

1. Timeline choreography (multi-step, overlaps, labels, staggers)
2. Scroll-linked behavior (enter/leave/scrub/pin)
3. Dynamic measurement required (height auto, FLIP-like, measured endpoints)
4. Reversible sequences with precise state fidelity (play/reverse)
5. Larger element counts or lists/grids where batching matters
6. Needs robust init/teardown due to navigation/partial re-render

Examples:

- Hero intro sequences with staged entrances (current hero scene keeps clip-path and width reveal disabled, and uses a transparent section surface)
- Section reveals with stagger + scroll gating
- ScrollTrigger storytelling (pin/scrub)
- Modal/overlay sequences with coordinated background + content motion

### Selection & Evaluation (module behavior)

The Choreographer module MUST evaluate both Tailwind and GSAP against:

- **Estimated runtime performance** (JS overhead, observers, property choices)
- **Tool capabilities & fit** (timeline/scroll/measurement needs)
- **Adherence to existing motion system & conventions** (tokens, hooks, file structure)
- **DX / extensibility / maintainability** (rapid iteration, readability, reuse)

Guiding assumptions:

- GSAP generally provides better DX than Tailwind for complex motion.
- Code readability is a priority.
- Design for rapid iteration.

### Deterministic Decision Rubric (scoring)

Start score: GSAP = +2 (DX bias), Tailwind = 0

Add points:

- Tailwind +2 if the request is a single 2-state transition with no scroll and no measurement
- Tailwind +1 if the interaction is CSS-native (hover/focus) or purely state-class driven
- Tailwind +1 if <= ~6 targets and no sequencing

- GSAP +2 if choreography/timeline required (stagger, overlaps, labels)
- GSAP +2 if scroll-linked behavior required
- GSAP +2 if measurement required (auto height, FLIP, measured endpoints)
- GSAP +1 if reversible sequences required
- GSAP +1 if > ~6 targets or list/grid entrances
- GSAP +1 if scene must be reusable across multiple pages/components

Decision:

- Choose higher score
- Tie-breaker: choose GSAP

Required output from the module:

- Recommendation (GSAP or Tailwind)
- Rationale summary (why it won)
- Implementation plan aligned to conventions
- Reduced-motion behavior
- Performance notes and measurement guidance

### Concierge module contract (implemented in frontend/.copilot/prompts/choreographer.prompt.md)

- **Triggers:** animation/choreography requests, GSAP/Tailwind choice, motion system questions, reduced-motion handling, performance/ScrollTrigger guidance.
- **Inputs:** user request + assets/links; this spec; motion tokens/config files; project routes/templates if provided; reduce-motion policy.
- **Outputs (template):**
  - Decision: GSAP vs Tailwind (include winner and tie-break if used).
  - Rationale: 3–5 bullets mapped to rubric factors (timeline, scroll, measurement, element count, DX).
  - Implementation plan: file destinations, hooks/selectors, token usage, reduced-motion adjustments, teardown expectations.
  - Performance: risks + mitigations (property choice, ScrollTrigger count, batching, lazy init).
  - Reduced motion: explicit behavior (disable/simplify) and how to gate it.
  - Validation: what to test (functional, visual, performance, reduced motion).
  - **Acceptance criteria:**
    - Fills the template above.
    - References token sources and hook conventions.
    - Chooses winner via the rubric; states if tie-break was used.
    - Names concrete file paths for scenes/templates (or states “path TBD” if unknown).
    - Includes reduced-motion plan and performance callouts.

## Performance & Budget

- **Frame budget:** target 60fps; avoid long main-thread work during scroll.
- **Property budget:** prefer transform/opacity; avoid animating layout (top/left/width/height) unless necessary.
- **Scroll budget:** minimize ScrollTrigger instances; batch where possible; avoid continuous per-frame work beyond transforms.
- **Conditional loading:** GSAP scenes should lazy-init by presence of hooks (data-anim) and avoid global eager setup.
- **Measurement guidance:**
  - GSAP: do layout reads once per init (or per refresh) and cache values
  - Tailwind: prefer pure CSS transitions; avoid JS-driven class thrash
- **How to measure:**
  - Use browser Performance panel and FPS meter
  - Record scroll interactions; verify minimal long tasks
  - Add a dev flag to enable GSAP markers and timing logs (project runbook)

## Architecture Direction (2026-01-23)

This section documents the recommended architecture for a more performant, maintainable Choreographer. It is the reference for future refinements.

### Decision

- **Primary engine:** GSAP (no tie-break needed)
- **Scope for Tailwind:** micro-interactions that meet the Tailwind-first criteria (2-state, no scroll, no measurement, <= ~6 targets)

### Rationale (rubric-mapped)

- Choreography requires **timelines/sequence control** (GSAP +2)
- Sections likely need **reusable scenes** (GSAP +1)
- Portfolio interactions often include **scroll-linked behavior** (GSAP +2)
- Typical sections exceed micro-interaction element counts (GSAP +1)

### Architecture Overview

- **Scene-first modularity:** One scene per section. Each scene lives in `frontend/js/choreography/sections/<Scene>/<Scene>.js` (or `sequences/` for multi-section flows).
- **Central lifecycle orchestration:** Register scenes via Director/Stage wiring so lifecycle, bus events, and teardown are centralized.
- **Cross-section media handoff:** Sequence orchestration (LandingSequence) owns media playback transitions between sections (for example, pausing background video on `bio.enter` and `bio.onEnterBack`, and resuming on `bio.onLeaveBack`).
- **Token-driven motion:** Use [config/motion.js](../../js/choreography/config/motion.js) for all durations/eases/distances/staggers. No hard-coded values.
- **Stable hooks:** `data-anim="<scene>"` on the root, `data-anim-item` on children, optional `data-anim-trigger` overrides.
- **Shared utilities:** Reduced-motion guards + measurement helpers in `frontend/js/choreography/managers/` or `frontend/js/choreography/utils/`.

### Scene Contract (required)

- Each scene exports:
  - `init(root, opts)` → returns controller with `kill()` and optional `refresh()`
  - `kill()` must remove ScrollTriggers/tweens/listeners

### Reduced Motion (required)

- Default: **disable decorative**, **simplify essential** per [motion-accessibility-policy.md](motion-accessibility-policy.md).
- GSAP: gate `init()` with `isReducedMotion()`. If reduced, remove scroll-scrub/pin, collapse staggers, reduce distance to 0–xs, and shorten durations.
- Tailwind: always provide `motion-safe:*` and `motion-reduce:*` variants.

### Performance Guidance (enforced)

- Prefer transform/opacity. Avoid layout animation unless required.
- Minimize ScrollTrigger count; batch when possible.
- For list sections (for example awards), prefer one section-level trigger plus viewport-threshold checks in `onUpdate` instead of per-item ScrollTriggers.
- Lazy-init scenes by presence of `data-anim` roots.
- Measure once per init/refresh and cache values.

### Validation Checklist (minimum)

- **Functional:** init/kill does not duplicate triggers or leak listeners.
- **Visual:** rest states match design; labels resolve intended sequence.
- **Performance:** scroll interactions show minimal long tasks; stable FPS.
- **Reduced motion:** OS reduced motion results in safe disable/simplify behavior.

## Accessibility

- Follow the policy in [motion-accessibility-policy.md](motion-accessibility-policy.md): reduced motion defaults to disable/simplify per pattern type and priority.
- Default strategies (if spec does not override):
  - ui: essential → simplify; decorative → disable
  - reveal: essential → simplify; decorative → disable
  - narrative: essential → disable; decorative → disable
- Simplify means: no scroll-linking, no/ tiny stagger, distance 0–xs, prefer fade-only, short durations (instant/fast/base).
- Disable means: skip animation and set final/rest state.
- **prefers-reduced-motion:**
  - Tailwind: use motion-safe/motion-reduce variants; reduced-motion defaults to minimal fade or no motion
  - GSAP: respect reduced motion by shortening timelines, removing movement, and avoiding scroll-scrub; provide instant state or fades
- **Keyboard/focus:**
  - No focus loss during transitions
  - Modals/overlays must maintain focus trap and restore focus on close (if applicable)
- **Fallbacks:**
  - When JS fails, UI must remain usable; Tailwind state classes should not depend on JS for baseline visibility

### Reduced-motion implementation checklist (apply per scene)

- Gate scene init with `isReducedMotion()`; if reduced, apply disable/simplify per strategy before registering ScrollTriggers/tweens.
- Enforce token constraints under reduced motion: durations ∈ {instant, fast, base}; distance ∈ {0, xs}; eases ∈ {standard, enter, exit}; no springy/overshoot.
- No scroll narratives (scrub/pin/parallax) in reduced motion; avoid continuous/looping motion.
- Provide non-motion state cues (text/icon/ARIA) so motion is never required for comprehension.

## Testing & Validation

- **Functional verification:**
  - Verify start/end states match expected UI states
  - Verify init/kill does not duplicate triggers or leak listeners
- **Visual validation:**
  - Record before/after clips for key scenes
  - Optional visual regression snapshots at rest states
- **Performance validation:**
  - Scroll interactions: check for long tasks and dropped frames
  - Count active ScrollTriggers and ensure teardown works
- **Reduced-motion validation:**
  - Test with OS reduced motion enabled; confirm safe behavior

## Decisions

- **Default bias to GSAP** for iterative choreography and reusable scene patterns due to better DX and maintainability.
- **Tailwind preferred** for simple 2-state micro-interactions to reduce JS overhead and complexity.
- **Single token system** required so Tailwind and GSAP outputs feel cohesive.

## Open Questions

- Standard file structure for GSAP scenes and registration (exact paths)?
- Do we need an ADR for the decision rubric and tie-break rule?
- Should the Concierge module response always include a mini scorecard table? (Proposed: yes.)
