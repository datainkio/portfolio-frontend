# Copilot Prompt Module: Portfolio Frontend — Choreography Planning

> Planning-only module for interaction choreography in the `frontend/` repo.

## Purpose

Produce an accessible, implementable choreography plan for portfolio frontend pages/components without making code changes.

## Triggers (use when…)

Use this module when the request is about **designing/structuring motion** in the portfolio frontend, especially:

- animation “storyboarding” for landing pages, sections, or atomic components
- defining timelines, triggers, state models, event orchestration
- specifying reduced-motion graceful degradation and cancel/escape hatches

## Non-triggers (do not use when…)

- The user is asking to implement code changes (use `domain.prompt.md` or Mechanic as appropriate).
- The request is primarily docs/spec work inside `aix/`.

## Hard Guardrails

- Planning only: do not edit files.
- Progressive enhancement: content must work without JS.
- Accessibility: always include a **graceful reduced-motion** variant (shorten/simplify; don’t “turn everything off” unless requested).
- Include cancel/escape hatches: scroll early, focus/keyboard changes, route/page teardown/re-entry.
- Config/constants-first planning: for `js/choreography` decisions, prefer values/events/selectors sourced from `frontend/js/choreography/config/runtime.js` and `frontend/js/choreography/config/events.js`; explicitly call out any required additions there before per-file literals.

## Output (must fit Concierge schema)

Return using Concierge’s required structure:

1. **Classification**
2. **Answer / Deliverable**
3. **Assumptions**
4. **Next actions**

Handoff to implementation: include a concise, numbered checklist of decisions (timelines, targets, triggers, reduced-motion rules). The implementation module will assume this checklist exists and will not re-plan.
Include configuration mapping in the checklist: identify which decisions are sourced from existing `config/runtime.js`/`config/events.js` keys and which new keys/events must be introduced.

Inside **Answer / Deliverable**, include the plan sections:

- A) Assumptions + constraints (including reduced motion)
- B) Component map (templates/components) + state model
- C) Choreography timeline (step-by-step, timing + easing intent)
- D) Event orchestration (triggers, lifecycle, abort rules, resize)
- E) Implementation plan (files/modules, bindings, tuning surface; described, not pasted code)
- F) Test checklist (a11y, performance, regression)
- G) Iteration options (minimum → enhanced)

## Authority notes (multi-root)

- When planning, prefer frontend’s authoritative constraints and conventions:
  - `frontend/.github/copilot-instructions.md`
  - `frontend/js/choreography/**` architecture (Director/sections/triggers)
  - `frontend/njk/**` atomic component structure
- Do not assume sections/controllers exist; verify via repo search before naming concrete targets.
