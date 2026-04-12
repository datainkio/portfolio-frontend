- **Title:** Current Section Title - Parent-Scoped Section Metadata
- **Owner(s):** Frontend / Choreography Maintainers
- **Status:** draft
- **Last reviewed:** 2026-04-12
- **Scope:** Per-instance `CurrentSectionTitle` rendering from each marker parent section.
- **Links:** marker template [../../njk/molecules/current-section-title.njk](../../njk/molecules/current-section-title.njk), section examples [../../njk/organisms/section/bio.njk](../../njk/organisms/section/bio.njk), runtime [../../js/utils/current-section-indicator.js](../../js/utils/current-section-indicator.js)

## Motion Principles

- **Section-local source of truth:** Each marker resolves its parent section and computes metadata from that local context.
- **No global overlay dependency:** The system does not depend on SectionCap or `#page-main` queries.
- **Deterministic output:** Marker text is stable and derived from section order, not scroll timing.

## DOM Contracts

- Marker root: `[data-current-section-marker]`
- Marker runtime config attribute:
  - `data-tracked-sections-selector`
- Label parts:
  - `[data-current-section-prefix]`
  - `[data-current-section-count]`
  - `[data-current-section-separator]`
  - `[data-current-section-title]`

## Config Surface

- `selectorMarker` (default `[data-current-section-marker]`).
- `selectorTrackedSections` (default `section[id]:not(#hero)`).
- `fallbackTitle` (default `none`).

## Data Model

For each marker instance:

- `parentSection`: section element that directly contains marker (or closest section ancestor).
- `trackedSections`: sibling sections under `parentSection.parentElement` matching `selectorTrackedSections`.
- `totalCount`: `trackedSections.length`.
- `activeSectionPosition`: 1-based position of `parentSection` in `trackedSections`.
- `activeSectionId`: `parentSection.id` fallback to `none`.

## Rules

1. Resolve marker instances from `selectorMarker`.
2. For each instance, resolve `parentSection`.
3. Resolve `trackedSections` from `parentSection.parentElement` direct section children matching `selectorTrackedSections`.
4. Compute `position` as `indexOf(parentSection) + 1`.
5. Render output text:
   - `section <position> of <total> : <parentSection.id>`
6. If parent section is not tracked (for example `#hero`), keep marker non-live and hidden:
   - `aria-hidden="true"`
   - `aria-live="off"`

## Controller Lifecycle

### Initialization

- Build all marker instances from the DOM.
- Render each instance once.
- Bind resize/orientation listeners and refresh on change.

### Refresh

- Recompute each marker from its current parent/sibling state.
- Use refresh for DOM changes that alter section ordering.

### Teardown

- Remove listeners.
- Clear runtime instances.

## Accessibility

- Preserve `role="status"` and `aria-atomic="true"` on marker roots.
- Keep `aria-live="polite"` for tracked sections.
- Turn live announcements off for non-tracked sections.

## Testing & Validation

- [ ] Each section with a marker shows deterministic metadata for its own parent section.
- [ ] Total count matches tracked sibling sections in parent container.
- [ ] Hero markers are hidden when `selectorTrackedSections` excludes `#hero`.
- [ ] Runtime works without `#page-main` or SectionCap.
- [ ] Refresh updates counts/positions after DOM reordering.

## Decisions

- Abandon SectionCap as the source for CurrentSectionTitle.
- Use per-section marker instances with parent-scoped data lookup.
- Keep hero excluded by default through `selectorTrackedSections`.
