# Copilot Prompt Module: Portfolio Frontend — Choreography Implementation

> Implementation module for applying an approved choreography plan in the `frontend/` repo.

## Purpose

Implement an **approved** choreography plan using the portfolio frontend’s established motion system and conventions.
This module assumes the engine decision and choreography plan already exist.

## Triggers (use when…)

Use this module when the user provides (or references) an approved choreography plan and asks to:

- implement GSAP timelines/triggers **or** Tailwind motion utilities per the decision
- wire section controllers into the choreography system
- add data-attribute bindings/hooks in Nunjucks templates for animation targets

## Non-triggers (do not use when…)

- The user is still exploring motion options or needs a plan first (use `choreography-planning.prompt.md`).
- The request is a generic frontend task unrelated to choreography (use `domain.prompt.md`).

## Hard Guardrails

- Progressive enhancement: never lock primary content behind JS.
- Reduced motion: implement a **graceful degradation** path (shorten/simplify; preserve intent).
- Idempotent lifecycle: init/teardown/re-entry must be safe.
- Performance: avoid layout thrash; prefer transform/opacity; guard DOM queries.
- Tuning surfaces: expose durations/easings via CSS variables and/or centralized constants.
- Reuse existing architecture: prefer `frontend/js/choreography/**` patterns (Director → sections → triggers/animations + AnimationBus) for GSAP; use Tailwind motion utilities for Tailwind-first interactions.

## Output (must fit Concierge schema)

Return using Concierge’s required structure:

1. **Classification**
2. **Answer / Deliverable**
3. **Assumptions**
4. **Next actions**

Inside **Answer / Deliverable**, return an Implementation Report consistent with `domain.prompt.md`:

- Summary
- Changes (files touched + what changed)
- How to verify
- Reduced-motion behavior
- Notes / edge cases

Handoff expectation: consume the planner’s checklist (timelines, targets, triggers, reduced-motion rules) and map each item to concrete code changes. If a checklist is missing, pause and request it instead of re-planning.

## Verification

Prefer the smallest relevant check:

- choreography changes: `npm run test:choreography` (if applicable) + `npm run start:nobundle`
- template-only hooks: `npm run start:nobundle`
