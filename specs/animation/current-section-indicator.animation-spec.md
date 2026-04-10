- **Title:** Current Section Indicator - Scroll Threshold Focus and Relative Position
- **Owner(s):** Frontend / Choreography Maintainers
- **Status:** draft
- **Last reviewed:** 2026-04-10
- **Scope:** `#current-section-marker` updates based on scroll position and threshold crossings.
- **Links:** marker template [../../njk/molecules/current-section-title.njk](../../njk/molecules/current-section-title.njk), homepage placement [../../njk/pages/home.njk](../../njk/pages/home.njk), section registry [../../js/choreography/sections/registry.js](../../js/choreography/sections/registry.js), choreography events [../../js/choreography/config/events.js](../../js/choreography/config/events.js)

## Motion Principles

- **State clarity over animation:** This feature is an informational affordance and must prioritize deterministic text updates over decorative transitions.
- **Threshold-driven focus:** The active section is the last section whose top boundary crossed the configured threshold from the top of the viewport.
- **DOM-local truth:** Section ordering and totals come from the marker's DOM neighborhood, not hard-coded arrays.
- **DX-first modularity:** Keep focus detection logic separate from rendering logic and lifecycle wiring.

## Primitives & Utilities

### DOM Contracts

- Marker root: `#current-section-marker`
- Marker runtime config attributes:
  - `data-threshold-ratio`
  - `data-visibility-transition-duration-ms`
- Label parts:
  - `#current-section-prefix`
  - `#current-section-count`
  - `#current-section-separator`
  - `#current-section-title`

### Config Surface (minimum)

- `thresholdRatio` (default `0.12`), sourced from `DEFAULTS.thresholdRatio` and overridable via `data-threshold-ratio`.
- `visibilityTransitionDurationMs` (default `180`) for visibility fade in/out, sourced from `DEFAULTS.visibilityTransitionDurationMs` and overridable via `data-visibility-transition-duration-ms`.
- `selectorMarker` (default `#current-section-marker`).
- `selectorSiblingAnchor` (default `#section-cap-anchor`, fallback to marker when not found).
- `fallbackTitle` (default `none`).

### Data Model

- `followingSiblings`: ordered list of element siblings after `#current-section-marker` in the same parent.
- `trackedSections`: ordered subset of `followingSiblings` where `tagName === "SECTION"` and `id` is non-empty.
- `totalCount`: `followingSiblings.length`.
- `activeSectionId`: raw `id` of current section in focus.
- `activeSectionPosition`: 1-based index of active section within `trackedSections`.
- `isMarkerVisible`: boolean derived from first following sibling threshold crossing.

## Patterns by Component/View

### Focus and Count Rules

1. Build `followingSiblings` from the marker's parent:
   - Start at `marker.nextElementSibling`.
   - Continue through `nextElementSibling` until null.
2. Set `totalCount` to `followingSiblings.length`.
3. Build `trackedSections` by filtering `followingSiblings` to section elements with ids.
4. Determine marker visibility using first following sibling:
   - Compute threshold line: `thresholdPx = viewportHeight * thresholdRatio`.
   - Let `firstSibling = followingSiblings[0]`.
   - If `firstSibling` exists and `firstSibling.getBoundingClientRect().top > thresholdPx`, the marker view is not visible.
   - If `firstSibling` is missing, keep marker hidden and render fallback state.
   - When `firstSibling.getBoundingClientRect().top <= thresholdPx`, the marker becomes visible and normal focus/count updates apply.
   - Transition between visible and hidden states must animate opacity using `visibilityTransitionDurationMs` from `DEFAULTS`.
   - Visibility transitions must not toggle CSS `visibility`; opacity is the only style value transitioned.
5. Determine focus using threshold crossing:
   - Compute threshold line: `thresholdPx = viewportHeight * thresholdRatio`.
   - Active section is the last item in `trackedSections` where `section.getBoundingClientRect().top <= thresholdPx`.
   - Fallback when none crossed yet: first item in `trackedSections`.
6. Resolve title as raw id:
   - `#current-section-title = activeSectionId`.

### Output Format Contract

The marker must read as:

`section <current-section-count> : <current-section-title>`

Where:

- `#current-section-prefix` is fixed to `section`.
- `#current-section-count` is formatted as `<activeSectionPosition> of <totalCount>`.
- `#current-section-separator` is fixed to `:`.
- `#current-section-title` is the raw active section id.

Example:

`section 2 of 3 : recognition`

## Event Orchestration (Controller Lifecycle)

### A) Initialization

- Resolve marker nodes.
- Build sibling/section lists and initial state.
- Evaluate visibility gate from first following sibling.
- Render initial marker value only when visible; otherwise keep view hidden.

### B) Scroll handling

- Subscribe with passive scroll listener.
- Schedule recomputation in `requestAnimationFrame`.
- Re-render only when active section position or id changes.
- Animate marker visibility transitions when the first-sibling threshold gate changes.

### C) Resize handling

- Recompute threshold and section geometry on resize/orientation changes.
- Re-evaluate active section and render if changed.

### D) Refresh and teardown

- Expose `refresh()` to rebuild sibling-derived lists after DOM changes.
- Expose `destroy()` to remove listeners and cancel pending frame work.

## Performance & Budget

- **One frame, one update:** At most one compute/render pass per animation frame.
- **Low allocation:** Reuse arrays/state where possible; avoid repeated selector scans during active scroll.
- **Read-then-write discipline:** Batch all geometry reads before DOM writes.
- **No extra observers required for MVP:** Use event listeners + optional explicit `refresh()`.

## Accessibility

- Preserve `role="status"`, `aria-live="polite"`, and `aria-atomic="true"` on marker root.
- Do not move keyboard focus when updating the marker.
- Marker updates are informative only and must not gate content comprehension.
- Keep separator and wording stable for screen-reader predictability.
- Hidden state should be non-visible visually via opacity and excluded from live updates until visible.
- During non-visible states, live announcements remain off until the marker is visible again.

## Testing & Validation

- [ ] Marker shows raw id of active section.
- [ ] Total in `#current-section-count` equals number of element siblings after `#current-section-marker`.
- [ ] Marker view remains hidden while the first following sibling top is below the threshold line.
- [ ] Marker view becomes visible once the first following sibling crosses the threshold line.
- [ ] Visibility changes animate with duration controlled by `DEFAULTS.visibilityTransitionDurationMs`.
- [ ] Threshold uses `DEFAULTS.thresholdRatio` unless overridden by `data-threshold-ratio`.
- [ ] Visibility duration uses `DEFAULTS.visibilityTransitionDurationMs` unless overridden by `data-visibility-transition-duration-ms`.
- [ ] Visibility transitions change opacity only and do not toggle CSS `visibility`.
- [ ] Active position updates to the last section crossing threshold from top.
- [ ] Scrolling down and up both produce deterministic section swaps.
- [ ] Fast scroll (trackpad fling) does not skip final active state.
- [ ] Resize recalculates threshold correctly.
- [ ] With no tracked sections, marker falls back to safe default (`0 of 0 : none`) without errors.
- [ ] Only changed values are written to DOM on update.

## Decisions

- Use raw section ids for titles (no slug prettification in MVP).
- Use threshold-ratio focus evaluation as the source of truth.
- Base `totalCount` on marker-following siblings in DOM, per product requirement.
- Gate marker visibility on first following sibling threshold crossing.
- Animate visibility transitions and centralize duration in `DEFAULTS.visibilityTransitionDurationMs`.
- Keep runtime logic modular: `Catalog -> Focus Tracker -> Renderer -> Controller`.

## Open Questions

- Should non-section following siblings continue to count toward `totalCount` if introduced later?
- Should the fallback title be `none`, empty text, or first tracked section id when nothing has crossed threshold?
