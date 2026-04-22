# Organizations Section — Motion Spec

- **Title:** Organizations Section — Intro/Outro Motion
- **Owner(s):** Frontend / Motion System Maintainers
- **Status:** draft
- **Last reviewed:** 2026-01-23
- **Scope:** Organizations section list and empty state in [../../njk/organisms/section/organizations.njk](../../njk/organisms/section/organizations.njk).
- **Links:** motion system [choreographer.animation-spec.md](choreographer.animation-spec.md), reduced motion policy [motion-accessibility-policy.md](motion-accessibility-policy.md), tokens/config [ix/motion.js](../../js/choreography/config/ix/motion.js), [tailwind.motion.config.cjs](../../js/choreography/tailwind.motion.config.cjs)

## Motion Principles

- Calm, legible entrance; prioritize readability of organization names.
- Transform/opacity only; avoid layout-shifting animations.
- Minimal stagger to avoid slow scans; keep sequence tight.

## Primitives & Utilities

- Use section timeline in `OrganizationsAnimations` (GSAP).
- Default timing/easing and item-reveal threshold sourced from `ORGANIZATIONS_ANIMATION_DEFAULTS` in `js/choreography/config/ix/motion.js`.
- Triggers use `AbstractSectionTriggers` with enter/leave callbacks.

## Patterns by Component/View

- **Organizations list items (`[data-organizations-el="organization"]`)**: Reveal once when item top crosses `itemRevealViewportRatio * viewportHeight`.
- **Section content (`context`, `heading`, `body`, `list`)**: Intro/outro timeline driven by section enter/leave.
- **Empty state**: Single non-animated fallback paragraph when no organizations are available.
- **Outro**: Reverse intro or explicit fade-out with smaller offset.

## Performance & Budget

- Target 60fps; no layout animation.
- Use `transform` + `opacity` only.
- One ScrollTrigger per section; no per-item triggers.

## Accessibility

- Reduced motion: skip animation and render final/rest state immediately.
- Avoid excessive stagger; ensure text is readable as it appears.
- Keyboard/focus unaffected (no focus shifts).

## Testing & Validation

- Intro triggers on first enter; outro on leave.
- Reduced motion enabled: list is visible without motion.
- Visual check: stagger timing is readable; no flicker on load.
- Performance: no long tasks during scroll.

## Decisions

- GSAP timeline for list-based stagger ensures consistent choreography.
- Use a single section trigger rather than per-item ScrollTriggers.

## Open Questions

- Should the Organizations section be re-enabled on the landing page?
- Do we need a dedicated sequence handoff from Hero/Bio to Organizations?
