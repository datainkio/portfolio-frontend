# Breakpoint Motion Profiles Spec

- Title: Breakpoint-Aware Motion Profiles for Choreography
- Owner(s): Frontend / Motion System Maintainers
- Status: draft
- Last reviewed: 2026-05-17
- Scope: Choreography runtime motion behavior across section controllers and card animations, including timeline and ScrollTrigger policy by breakpoint and reduced-motion preference.
- Links: [js/choreography/config/ix/motion.js](../../js/choreography/config/ix/motion.js), [js/choreography/config/ix/breakpoints.js](../../js/choreography/config/ix/breakpoints.js), [js/choreography/config/ix/scrolltriggers.js](../../js/choreography/config/ix/scrolltriggers.js), [js/choreography/sections/abstract-section/AbstractSection.js](../../js/choreography/sections/abstract-section/AbstractSection.js), [js/choreography/card/Card.js](../../js/choreography/card/Card.js)

## Objective

Maintain user engagement and design impact across the full experience by applying different motion styles per breakpoint, instead of relying on a binary motion/static toggle. Keep configuration centralized to optimize iteration speed and consistency.

## Problem Statement

Current behavior uses a narrow policy switch in the section lifecycle and card lifecycle. This supports accessibility but does not support expressive, breakpoint-specific motion styles (for example, restrained motion on smaller screens and richer choreography on larger screens).

## Principles

- One policy source for motion behavior across sections and cards.
- Configuration-first design to reduce cost of iteration.
- Reduced motion remains a first-class override.
- Scroll behavior should scale by breakpoint capability tier.
- No duplicated policy logic in section or card implementations.

## Proposed Architecture

### 1) Profile Schema

Add centralized profile configuration in [js/choreography/config/ix/motion.js](../../js/choreography/config/ix/motion.js).

Define profile keys:

- base
- sm
- md
- lg
- xl
- reduced

Each profile contains two channels:

- timeline:
  - enabled
  - durationScale
  - staggerScale
  - distanceScale
  - easePreset

- trigger:
  - enabled
  - scrub
  - pin
  - once
  - start
  - end
  - invalidateOnRefresh

Add section-specific overrides under the same schema for:

- hero
- video
- bio
- awards
- organizations
- work
- card

### 2) Resolution Layer

In [js/choreography/config/ix/motion.js](../../js/choreography/config/ix/motion.js), add resolver helpers:

- getActiveMotionProfileKey(conditions)
  - Uses breakpoint conditions from [js/choreography/config/ix/breakpoints.js](../../js/choreography/config/ix/breakpoints.js).
  - If prefers-reduced-motion is active, always resolves to reduced.

- resolveSectionMotionProfile(sectionKey, conditions)
  - Merges global profile defaults and section overrides.
  - Returns a fully resolved profile object consumed by runtime code.

### 3) Integration Points

#### AbstractSection lifecycle

Integrate profile resolution in [js/choreography/sections/abstract-section/AbstractSection.js](../../js/choreography/sections/abstract-section/AbstractSection.js):

- On matchMedia update:
  - Resolve profile key and resolved section profile.
  - Store resolved profile on the section instance.
  - Gate timeline and trigger behavior from resolved profile values.

- Trigger behavior:
  - If resolved trigger.enabled is false, kill and do not bind section triggers.
  - If enabled, bind with resolved trigger policy.

- Timeline behavior:
  - If resolved timeline.enabled is false, use static end state where required.
  - If enabled, apply profile scaling values to section timeline creation paths.

#### ScrollTrigger defaults and composition

Keep primitive defaults in [js/choreography/config/ix/scrolltriggers.js](../../js/choreography/config/ix/scrolltriggers.js), and add profile-aware composition helper(s) to map resolved profile.trigger values into final trigger config.

#### Card system

Use the same resolver strategy in [js/choreography/card/Card.js](../../js/choreography/card/Card.js) so cards follow identical policy semantics as sections.

### 4) Scroll Trigger Capability Strategy

Use breakpoint capability tiers:

- reduced:
  - no scrub, no pin, typically no trigger-driven motion.

- sm:
  - simple reveal-style interactions only.
  - no pin, no scrub.
  - short ranges, once true where applicable.

- md:
  - moderate complexity.
  - selective scrub where valuable.
  - minimal pin usage.

- lg and xl:
  - richer choreography.
  - broader use of scrub and pin where interaction value justifies cost.

## Why This Strategy

- Centralized profile policy keeps design and engineering aligned.
- Motion behavior can evolve quickly without section-by-section rewrites.
- Reduced motion remains consistent and safe.
- Sections and cards no longer risk policy drift.

## Implementation Plan (for tomorrow)

### Phase 1: Config and Resolver

- Extend [js/choreography/config/ix/motion.js](../../js/choreography/config/ix/motion.js) with profile schema and resolver helpers.
- Keep existing tokens as the foundation.

### Phase 2: Section Integration

- Update [js/choreography/sections/abstract-section/AbstractSection.js](../../js/choreography/sections/abstract-section/AbstractSection.js) to consume resolved profiles.
- Route trigger and timeline enablement through resolved profile values.

### Phase 3: Trigger Composition

- Add profile-aware trigger composition in [js/choreography/config/ix/scrolltriggers.js](../../js/choreography/config/ix/scrolltriggers.js).
- Apply composition in section trigger classes, including secondary trigger systems.

### Phase 4: Card Alignment

- Ensure [js/choreography/card/Card.js](../../js/choreography/card/Card.js) consumes profile resolver output for parity with section policy.

### Phase 5: Verification

- Validate behavior for base, sm, md, lg, xl, and reduced profiles.
- Confirm no duplicate trigger accumulation during profile transitions.
- Verify cards and sections change behavior consistently.

## Acceptance Criteria

- Motion profile key resolves deterministically from matchMedia conditions.
- Reduced profile always overrides breakpoint profile.
- Section triggers and card triggers honor resolved trigger.enabled.
- Timeline and trigger behavior differ by breakpoint profile as configured.
- Policy remains centralized and not hardcoded in section/card implementations.
- Repeated profile transitions do not leak or duplicate ScrollTriggers.

## Out of Scope

- Full redesign of existing section timeline choreography.
- Rewriting all section animations in a single pass.
- Non-choreography UI animations outside this runtime.

## Open Questions

- Which section-specific overrides should be part of the first implementation cut versus follow-up tuning?
- Should profile transitions emit a standardized motion profile change event for diagnostics?
- Should profile composition output be cached per section key and profile key for performance?
