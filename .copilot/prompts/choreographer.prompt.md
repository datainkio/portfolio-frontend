# Copilot Prompt Module: Portfolio Frontend — Choreographer (GSAP vs Tailwind)

> Decide the motion engine and outline high-level integration for accessible, performant IX.

## Purpose

Produce a deterministic GSAP vs Tailwind recommendation and a **high-level integration outline** that conforms to the portfolio frontend motion system.
This module does **not** storyboard timelines or define full choreography plans.
If the user requests code changes, hand off to `choreography-implementation.prompt.md` after the decision is made.

## Triggers (use when…)

- User asks how to implement/choose motion, choreography, ScrollTrigger, or reduced-motion behavior.
- Need a GSAP vs Tailwind decision, including file paths and hooks.
- Need an architecture-level recommendation aligned to the motion system (tokens, hooks, lifecycle).

## Non-triggers

- Motion storyboarding or timeline planning (route to `choreography-planning.prompt.md`).
- Pure code edits (route to `choreography-implementation.prompt.md`).
- Non-motion UI tasks.

## Primary Output (Type: Choreography Decision Packet)

Structured response with: 0) Scorecard (GSAP vs Tailwind points per rubric factor; include totals)

1. Decision (winner and whether tie-break applied)
2. Rationale (3–5 bullets mapped to rubric factors)
3. Integration outline (files/paths, hooks/selectors, token usage with explicit references to config/motion.js and tailwind.motion.config.cjs, lifecycle/teardown expectations)
4. Reduced-motion behavior (disable/simplify plan)
5. Performance risks + mitigations (include measurement guidance)
6. Validation checklist (functional, visual, performance, reduced motion)
7. Acceptance criteria (explicit checklist per spec)
8. Assumptions/gaps

## Inputs to read first

- frontend/specs/animation/choreographer.animation-spec.md (this is the contract)
- Motion tokens/configs: frontend/js/choreography/config/motion.js, frontend/js/choreography/tailwind.motion.config.cjs
- Motion accessibility: frontend/specs/animation/motion-accessibility-policy.md
- If provided: page/template references, asset links, user requirements

## Process (rubric -> decision)

- Start scores: GSAP +2, Tailwind 0
- Tailwind: +2 single 2-state, no scroll, no measurement; +1 CSS-native or state-class only; +1 <= ~6 targets, no sequencing
- GSAP: +2 timeline/choreography; +2 scroll-linked; +2 measurement/auto-height/FLIP; +1 reversible; +1 > ~6 targets or list/grid; +1 reusable scene
- Pick higher score; tie-breaker → GSAP
- State the winner and whether a tie-break was needed

## File/Hook conventions (cite in plan)

- Hooks: data-anim="<scene>" on root; data-anim-item on children; optional data-anim-trigger override
- GSAP scene files: frontend/js/choreography/sections/<Scene>/<Scene>.js (or sequences/ for multi-section); export init(root, opts)/kill()
- Registration: via Director/Stage wiring (e.g., Director.js) to centralize lifecycle/bus
- Shared helpers: frontend/js/choreography/{managers,utils}/ for reduced-motion guards, measurement utilities
- Tailwind: use motion-safe/motion-reduce utilities emitted by frontend/js/choreography/tailwind.motion.config.cjs; avoid ad-hoc durations/eases

## Reduced motion

- Always state disable vs simplify; default: disable decorative, simplify essential
- GSAP: gate with isReducedMotion(), shorten timelines, remove scroll-scrub/pin, use rest states or minimal fades
- Tailwind: provide motion-reduce variants and non-motion affordances

## Performance notes

- Prefer transform/opacity; avoid layout anims unless justified
- Minimize ScrollTrigger count; batch where possible; lazy-init scenes via hooks
- Call out measurement strategy and teardown expectations (kill removes triggers/listeners)

## Output style

- Be concise; use bullets; cite paths/hooks
- If inputs are missing (no template/page info), state assumptions and mark paths as TBD
- Do not storyboard timelines here; hand off to the planning module for sequence design

## Acceptance criteria (must include in output)

- Fills the template above (including scorecard and acceptance criteria section).
- References token sources explicitly: config/motion.js and tailwind.motion.config.cjs.
- Chooses winner via rubric; states if tie-break was used.
- Names concrete file paths for scenes/templates (or states “path TBD” if unknown).
- Includes reduced-motion plan and performance callouts (with measurement guidance).

## Blocking question (only if required)

If you cannot pick GSAP vs Tailwind without page/interaction details, ask for the interaction description and target elements; otherwise proceed with reasonable assumptions.
