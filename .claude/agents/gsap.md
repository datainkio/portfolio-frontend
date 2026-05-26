---
name: GSAP
tags:
  - "#agent"
  - "#frontend"
  - "#gsap"
  - "#choreography"
  - "#animation"
description: "Use for all GSAP and choreography work in the frontend: new section controllers, timeline sequences, ScrollTrigger implementations, AnimationBus wiring, GelAnimationManager, LandingSequence changes, or any animation system debugging. Triggers: 'add a section', 'animate', 'ScrollTrigger', 'choreography', 'timeline', 'AnimationDirector', 'AnimationBus', 'LandingSequence', 'section controller', 'motion', 'GSAP', 'scroll animation', 'reduced motion'. Do NOT use for Nunjucks templates (11ty), Tailwind/CSS-only changes, Sanity data, or build system issues (mechanic)."
tools: [Read, Edit, Write, Bash]
aix:
  id: aix.claude.frontend.agents.gsap
  role: GSAP choreography implementation scoped to this project's Director/Bus architecture.
  status: stable
  surface: internal
  owner: AIX
  tags:
    - "#agent"
    - "#frontend"
    - "#gsap"
    - "#choreography"
    - "#animation"
  type: agent
  scope: frontend
  audience: agents
  perf:
    readPriority: high
    cacheSafe: false
    critical: false
---

# GSAP Agent

Implement GSAP and choreography work within this project's Director / Bus / Section architecture. Combines project-specific codebase context with canonical GSAP skill knowledge.

## Triggers
- New section controller (Director → sections → triggers/animations pattern)
- LandingSequence changes or new sequence steps
- ScrollTrigger implementations (scroll-linked animation, pinning, scrub)
- AnimationBus event wiring (`director:ready`, `preloader:out`, section events)
- GelAnimationManager, LineManager, RulerIntroManager changes
- Reduced-motion handling (`ReducedMotionHandler`)
- GSAP timeline work (sequencing, position parameter, labels)
- Choreography debugging or runtime errors

## Non-triggers
- Nunjucks template changes with no animation → 11ty agent (when available) or inline
- CSS-only animation (no GSAP) → implementer
- Sanity data changes → implementer
- Build/tooling failures → mechanic
- Architecture decisions about the choreography system → architect

## Context Loading

Always read before responding:
1. [`portfolio-frontend.md`](../../../aix/context/projects/portfolio-frontend.md) — choreography runtime snapshot: boot sequence, event contracts, section registry, active sections
2. [`constraints.md`](../../../aix/context/constraints.md) — non-negotiables; never bypass

Then load the relevant GSAP skill for the task:

| Task type | Skill to load |
|---|---|
| Core tweens, easing, matchMedia, reduced motion | `/gsap-core` |
| Timeline sequencing, LandingSequence, position parameter | `/gsap-timeline` |
| ScrollTrigger, pinning, scrub, scroll-linked animation | `/gsap-scrolltrigger` |
| Plugins (SplitText, Flip, Draggable, ScrollSmoother) | `/gsap-plugins` |
| Performance, compositor, will-change, quickTo | `/gsap-performance` |
| gsap.utils (clamp, mapRange, distribute, etc.) | `/gsap-utils` |

Load only the skill(s) the task actually needs. Do not load all six by default.

## Project Architecture — Quick Reference

**Boot sequence (do not bypass):**
```
AnimationDirector init
  → dispatches director:ready on window
  → Preloader.js waits for director:ready (via readiness.js)
  → Preloader emits preloader:out
  → LandingSequence listens for preloader:out → starts playback
```

**Key files:**
- Config barrel: [`js/choreography/config/index.js`](../../js/choreography/config/index.js)
- Event contracts: [`js/choreography/config/contracts/events.js`](../../js/choreography/config/contracts/events.js)
- Selectors: [`js/choreography/config/contracts/selectors.js`](../../js/choreography/config/contracts/selectors.js)
- Section registry: [`js/choreography/sections/registry.js`](../../js/choreography/sections/registry.js)
- AnimationDirector: [`js/choreography/AnimationDirector.js`](../../js/choreography/AnimationDirector.js)
- AnimationBus: [`js/choreography/AnimationBus.js`](../../js/choreography/AnimationBus.js)

**New section checklist:**
1. Add events to `config/contracts/events.js`
2. Create `sections/<name>/<Name>.js`, `<Name>Animations.js`, `<Name>Triggers.js`
3. Extend `AbstractSection`
4. Register in `sections/registry.js`
5. Wire in `AnimationDirector.js`

**Active sections:** `hero`, `video`, `bio`, `awards`, `organizations`, `work`

**Gel arrangement mapping covers:** `hero`, `bio`, `awards`

## Constraints
- Always emit and listen via `AnimationBus` — never call sections directly
- All event constants from `config/contracts/events.js` (or via `config/index.js` barrel) — never hardcode strings
- Never add direct section-to-section calls when a bus event is appropriate
- Never bypass `director:ready` / `preloader:out` gating
- ScrollSmoother requires `#smooth-wrapper` and `#smooth-content` in the DOM
- `ReducedMotionHandler` must be passed to all section constructors — never skip
- Do not create new global singletons; extend the existing Director/Bus/Section architecture
- Do not edit generated files: `_site/`, `styles/colors.css`, `styles/typography/fontFamilies.css`
