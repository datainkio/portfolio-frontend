# Section Gel Arrangements — MVP Spec

- **Title:** Section Gel Arrangements — Event-Driven Layout Mapping (MVP)
- **Owner(s):** Frontend / Choreography Maintainers
- **Status:** draft
- **Last reviewed:** 2026-02-19
- **Scope:** Landing choreography gel layers (`.bg-gel`) reacting to section lifecycle events (`EVENTS.*.enter` / `EVENTS.*.exit`).
- **Links:** choreography coordinator [../../js/choreography/sequences/landing/LandingSequence.js](../../js/choreography/sequences/landing/LandingSequence.js), event contracts [../../js/choreography/config/events.js](../../js/choreography/config/events.js), gel manager [../../js/choreography/managers/GelAnimationManager.js](../../js/choreography/managers/GelAnimationManager.js), choreography config [../../js/choreography/config/runtime.js](../../js/choreography/config/runtime.js)

## Motion Principles

- **No transitions in MVP:** Arrangement switches are immediate state updates (no tweening, no scrub).
- **Section-owned layouts:** Each section has exactly one canonical arrangement.
- **Constants-first tuning:** Arrangement values live in constants so iteration is edit-refresh only.
- **Viewport-relative geometry:** Position and dimensions are normalized to viewport, not fixed pixels.
- **Mask state is part of layout state:** Clipping mask geometry/settings switch with the arrangement and apply immediately.

## Primitives & Utilities

### Proposed constants location (DX)

Create a dedicated constants file:

- `frontend/js/choreography/config/arrangements.js`

Rationale:

- Keeps `config/runtime.js` focused on base choreography/site config.
- Keeps arrangement definitions near choreography runtime logic.
- Enables direct imports from `LandingSequence` and `GelAnimationManager` without inflating global constants.

### Canonical schema (single shape)

All arrangements MUST use this schema:

```js
/** viewport-normalized values, each in range [0, 1] */
export type GelViewportRect = {
  x: number;      // left offset as viewport fraction
  y: number;      // top offset as viewport fraction
  width: number;  // width as viewport fraction
  height: number; // height as viewport fraction
  origin?: string; // optional transform origin, default "center center"
};

export type GelMaskState = {
  enabled?: boolean; // default true
  invert?: boolean; // optional hole-punch behavior
  corners?: {
    topLeft?: { x: number; y: number };
    topRight?: { x: number; y: number };
    bottomRight?: { x: number; y: number };
    bottomLeft?: { x: number; y: number };
  };
};

export type GelArrangementEntry = {
  rect: GelViewportRect;
  mask?: GelMaskState;
};

export type GelArrangement = {
  id: string; // arrangement id (typically section id)
  gels: Record<string, GelArrangementEntry>; // keyed by gel id, e.g. "bg-gel-0"
};
```

### Constants contract

```js
export const GEL_ARRANGEMENTS = {
  video: {
    id: "video",
    gels: {
      /*
      "bg-gel-0": {
        rect: { x, y, width, height, origin },
        mask: { enabled, invert, corners }
      }
      */
    },
  },
  hero: {
    id: "hero",
    gels: {
      /* bg-gel-* rects */
    },
  },
  bio: {
    id: "bio",
    gels: {
      /* bg-gel-* rects */
    },
  },
  awards: {
    id: "awards",
    gels: {
      /* bg-gel-* rects */
    },
  },
};

/** 1:1 section → arrangement */
export const SECTION_TO_GEL_ARRANGEMENT = {
  video: "video",
  hero: "hero",
  bio: "bio",
  awards: "awards",
};
```

Rules:

- `SECTION_TO_GEL_ARRANGEMENT` must contain every section in `SECTION_REGISTRY`.
- Each arrangement must define every active `.bg-gel` id.
- Each gel entry uses a single shape: `{ rect, mask? }` (no mixed legacy shapes).
- If `mask` is omitted, existing gel mask state is preserved.
- If `mask.enabled === false`, manager removes the mask for that gel in that arrangement.
- If `mask.corners` is present, corner updates apply immediately (no tween).
- Unknown section id or missing arrangement is a no-op + warning log (non-fatal).

## Patterns by Component/View

- **Source events:** `EVENTS.<section>.enter` is the MVP source of truth to apply that section’s arrangement.
- **Exit handling:** `EVENTS.<section>.exit` is wired but does not trigger a different arrangement by default in MVP (prevents churn); it can optionally re-apply the current section arrangement as a consistency guard.
- **1:1 ownership:** No shared arrangement ids between sections in MVP.

## Event Orchestration (LandingSequence)

### A) Assumptions + constraints

- Current sections in runtime registry: `video`, `hero`, `bio`, `awards`.
- Existing bus events are stable and already emitted by section triggers.
- Reduced-motion should not alter arrangement selection logic (only future animation behavior).

### B) Component map + state model

- `LandingSequence`: subscribes to section events and requests arrangement changes.
- `GelAnimationManager`: exposes imperative `applyArrangement(arrangement)` API (immediate geometry + mask updates).
- `config/arrangements.js`: authoritative constants map and schema.
- State model: `activeArrangementId` stored in `LandingSequence` (or manager) to avoid redundant reapplies.

### C) Choreography timeline

- Immediate switch on relevant event dispatch:
  1. Receive section event
  2. Resolve arrangement id from `SECTION_TO_GEL_ARRANGEMENT`
  3. Resolve arrangement object from `GEL_ARRANGEMENTS`
  4. Apply all gel rects synchronously (no animation)
  5. Apply mask state synchronously (enable/disable/invert/corners)

### D) Trigger/lifecycle/abort/resize rules

- Enter event applies arrangement for that section.
- Exit event is subscribed for future flexibility; MVP behavior is no-op (or idempotent re-apply).
- On resize: re-apply `activeArrangementId` so viewport-relative rects remain accurate.
- Abort/teardown: on `LandingSequence.destroy()`, unsubscribe only (no forced visual reset).

### E) Implementation plan (no code yet)

1. Add `config/arrangements.js` with schema docs and two constants (`GEL_ARRANGEMENTS`, `SECTION_TO_GEL_ARRANGEMENT`).
2. Add `applyArrangement(arrangement)` to `GelAnimationManager`:
   - Iterates `arrangement.gels`.

- Applies position + dimensions immediately from `entry.rect`.
- Applies mask state immediately from `entry.mask`:
  - `enabled` => `applyMask()` / `removeMask()`
  - `invert` => `invertMask()`
  - `corners` => `setCornerImmediate()` per corner key
- Skips unknown gels safely.

3. Add `applySectionArrangement(sectionId)` helper in `LandingSequence`:
   - Resolves ids via constants.
   - Guards duplicate applications.
   - Logs when config is incomplete.
4. Wire helper to `EVENTS.video.enter`, `EVENTS.hero.enter`, `EVENTS.bio.enter`, `EVENTS.awards.enter`.
5. Optionally wire `exit` listeners through same helper in idempotent mode if needed for stability.

### F) Test checklist (MVP)

- Entering each section applies exactly one arrangement update.
- No tween/transition calls are used for arrangement application.
- Every registered section resolves to one arrangement id.
- Mask state updates per arrangement apply deterministically (same inputs, same mask output).
- `mask.enabled: false` removes mask for that gel; `true` reapplies it.
- Corner overrides update mask shape immediately without interpolation.
- Missing mapping/gel ids fail gracefully with warning logs only.
- Resizing window keeps gels in the same relative viewport arrangement.

### G) Iteration options (minimum → enhanced)

- **Minimum (MVP):** static constants + immediate application on `enter`.
- **Enhanced v1:** optional `exit` strategy map (`noop | reapply | targetSection`).
- **Enhanced v2:** optional `animate: false|true` toggle per arrangement for future transition support.

## Performance & Budget

- O(number of gels) per arrangement switch; expected tiny cost (3 gels currently).
- Mask updates are also O(number of configured gel masks) per switch.
- No ScrollTrigger dependency for arrangement switching.
- Avoid layout thrash by batching style writes per arrangement application.

## Accessibility

- MVP uses no motion for arrangement switching, so reduced-motion compliance is naturally satisfied.
- If transitions are introduced later, they must be disabled/simplified under reduced-motion.

## Decisions

- Dedicated file `config/arrangements.js` for high-iteration DX.
- Viewport-normalized rect + mask schema for portable, swappable arrangements.
- `enter` events are authoritative for MVP section-to-arrangement mapping.

## Open Questions

- Should organizations be included once the section is re-enabled in `SECTION_REGISTRY`?
- Should `video` and `hero` remain separate arrangements or share values while preserving distinct ids?
- Do we want hard validation (throw) in dev mode for missing arrangement definitions?
