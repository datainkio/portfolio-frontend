# Work Section - Motion Spec

- **Title:** Work Section - Intro/Outro Motion
- **Owner(s):** Frontend / Motion System Maintainers
- **Status:** draft
- **Last reviewed:** 2026-04-21
- **Scope:** Work section list and empty state in [../../njk/organisms/section/work.njk](../../njk/organisms/section/work.njk).
- **Links:** motion system [choreographer.animation-spec.md](choreographer.animation-spec.md), reduced motion policy [motion-accessibility-policy.md](motion-accessibility-policy.md), tokens/config [ix/motion.js](../../js/choreography/config/ix/motion.js)

## Motion Principles

- Calm, legible entrance for project cards and titles.
- Transform/opacity only; avoid layout-shifting animations.
- Progressive per-item reveal based on viewport threshold.

## Primitives & Utilities

- Use section timeline in `WorkAnimations` (GSAP).
- Default timing/easing and item-reveal threshold sourced from `WORK_ANIMATION_DEFAULTS` in `js/choreography/config/ix/motion.js`.
- Triggers use `WorkTriggers` extending `AbstractSectionTriggers`.

## Patterns by Component/View

- **Work list items (`[data-projects-el="project"]`)**: Reveal once when item top crosses `itemRevealViewportRatio * viewportHeight`.
- **Header/content (`context`, `heading`, `body`, `list`)**: Intro/outro timeline driven by section enter/leave.

## Performance & Budget

- Target 60fps; no layout animation.
- One ScrollTrigger per section; no per-item ScrollTriggers.
- Keep per-update work to item position checks and one-time reveal writes.

## Accessibility

- Reduced motion: skip animated reveal and render final/rest state immediately.
- Keyboard/focus unaffected (no focus shifts).

## Testing & Validation

- Intro triggers on first enter; outro on leave.
- Items reveal as they cross threshold; already revealed items do not re-animate.
- Reduced motion enabled: all items visible without motion.
