# Motion Accessibility Policy (Portfolio Frontend)

**Status:** Draft v1  
**Audience:** Humans + AI agents (Concierge, Choreographer, Frontend implementers)  
**Scope:** Motion authored via **GSAP** and/or **Tailwind** utilities across the portfolio frontend.

---

## Goals

1. Respect user motion preferences (system settings) and reduce vestibular triggers.
2. Keep motion **optional** for comprehension: state and content must remain clear without animation.
3. Preserve a rapid-iteration DX while enforcing consistent accessibility outcomes.
4. Ensure the Choreographer can make deterministic, auditable decisions.

---

## Non-goals

- Defining aesthetic “taste” for motion direction beyond the token system.
- Supporting every animation library; this policy covers GSAP + Tailwind.

---

## Definitions

### Pattern Types

- **ui**: Micro-interactions, affordances (hover, focus, pressed, expand/collapse).
- **reveal**: Section/item entrances, list/grid reveals, simple attention cues.
- **narrative**: Scroll storytelling, parallax, pinning, scrubbing, long timelines.

### Accessibility Priority

- **essential**: Motion communicates critical state change that must be perceivable (but can be simplified).
- **decorative**: Motion is purely aesthetic/branding; must be safely removable.

### Reduced Motion

User prefers reduced motion when:

- `prefers-reduced-motion: reduce` is true.

---

## Hard Rules (Must)

### R1 — Respect reduced motion

If `prefers-reduced-motion: reduce`:

- **Never** attach scroll-driven narratives (scrub, pin, parallax).
- **Never** run continuous motion (loops, perpetual keyframes).
- **Never** apply large movement distances.
- Prefer **static** final state, or **fade-only** if essential.

### R2 — Motion must not be required for understanding

- Content and state must be clear without animation.
- Any motion used to indicate state must be paired with non-motion cues:
  - text, iconography, ARIA state, layout/state changes.

### R3 — Keep transforms GPU-friendly

Prefer animating:

- `opacity`, `transform` (translate/scale/rotate), and `filter` (sparingly)
  Avoid animating:
- layout properties (`top/left/width/height`) unless unavoidable and controlled.
  If height animation is required:
- Use a controlled strategy (GSAP measurement or CSS technique) and test reduced-motion behavior.

### R4 — Avoid surprise and disorientation

- Avoid rapid flashes, sudden large translations, or high-frequency motion.
- Avoid “camera movement” effects (large parallax, aggressive zoom) unless explicitly requested and disabled for reduced motion.

### R5 — Always provide teardown for JS motion

Any GSAP scene must support:

- `init()` and `kill()` (or equivalent).
- Clean up ScrollTriggers, observers, and inline styles if applied.
- Be resilient to re-init (e.g., partial navigation, re-render).

---

## Default Reduced-Motion Strategies

Every animation spec MUST declare:

- `patternType`: `ui | reveal | narrative`
- `accessibilityPriority`: `essential | decorative`
- (optional) `reducedMotionStrategy`: `disable | simplify | keep`

### Default mapping (if not explicitly set)

| patternType | priority   | reducedMotionStrategy |
| ----------- | ---------- | --------------------- |
| ui          | essential  | simplify              |
| ui          | decorative | disable               |
| reveal      | essential  | simplify              |
| reveal      | decorative | disable               |
| narrative   | essential  | disable               |
| narrative   | decorative | disable               |

**Simplify** means:

- No scroll-linking.
- No stagger unless tiny (or remove stagger entirely).
- No movement distance beyond `distance.xs` (or 0).
- Prefer fade-only.

**Disable** means:

- Skip animation entirely and set to final/rest state.

**Keep** is rare:

- Only allowed for `ui` + `essential` when motion is minimal and non-triggering.

---

## Implementation Guidance

### Tailwind (CSS-first)

**Rule of thumb:** complex motion should be `motion-safe:` gated.

#### Required patterns

- Use `motion-safe:` for transitions/animations that are non-essential.
- Use `motion-reduce:` to cancel or simplify:
  - `motion-reduce:transition-none`
  - `motion-reduce:transform-none`
  - `motion-reduce:animate-none`

Example:

```html
<div
  class="
  motion-reduce:transition-none motion-reduce:transform-none
  motion-safe:transition-base motion-safe:duration-base motion-safe:ease-enter
"
>
  ...
</div>
```

### GSAP (JS choreography)

All GSAP entry points MUST gate by reduced motion:

- If reduced: apply final state or fade-only.
- Do not register ScrollTrigger, observers, or loops.

Required helper:

- Central `isReducedMotion()` utility (with optional override for testing).

Example:

```js
if (isReducedMotion()) {
  // Option A: final state
  root.classList.add("is-revealed");
  return;
}
```

---

## Token Constraints Under Reduced Motion

When reduced motion is enabled:

- Allowed duration: `instant | fast | base` (avoid `slow/slower`)
- Allowed distance: `0 | xs` (avoid sm+)
- Allowed eases: `standard | enter | exit` (avoid overshoot/springy)

---

## QA Checklist

### For every animation

- [ ] Reduced motion: animation disabled or simplified per mapping.
- [ ] No continuous/looping motion (or disabled in reduced).
- [ ] No scroll narrative in reduced.
- [ ] Motion not required to understand state/content.
- [ ] Uses motion tokens (no ad-hoc timings unless justified).
- [ ] GSAP scenes have teardown and are re-init safe.
- [ ] Tested at least one keyboard-only path (focus states still clear).

---

## Choreographer Decision Notes (For Agents)

When choosing Tailwind vs GSAP:

- Prefer **Tailwind** for discrete, state-based transitions that can be gated by `motion-safe:`.
- Prefer **GSAP** for choreography, sequencing, measurement, or complex state—but enforce the reduced-motion gate and defaults above.

Agents MUST output:

1. Chosen tool (Tailwind or GSAP)
2. Reduced-motion behavior (disable/simplify/keep)
3. Rationale referencing this policy

---

## Versioning

- Update this policy when motion tokens change materially or new motion patterns are introduced.
- Breaking changes should bump major version (v2, v3…).
