# Frontend AIX Prompt Modules (Concierge Routing Index)

This folder contains **task-scoped prompt modules** intended to be selected by the workspace Concierge when working in this repo.

## Module routing hints

- **Templates / Nunjucks / 11ty** → `display.prompt.md`
  - Use for: `.njk`, page/layout structure, macros/includes, semantic HTML, accessibility.

- **Browser JavaScript (progressive enhancement)** → `js.prompt.md`
  - Use for: DOM initialization, event handlers, choreography glue, lightweight UI behavior.

- **Choreography decision (GSAP vs Tailwind)** → `choreographer.prompt.md`
  - Use for: choosing GSAP vs Tailwind, reduced-motion approach, performance tradeoffs, file paths/hooks, integration outline (no storyboard).

- **Choreography planning (no code)** → `choreography-planning.prompt.md`
  - Use for: interaction timelines, triggers, reduced-motion variants, orchestration plans (assumes engine decision).

- **Choreography implementation (code changes)** → `choreography-implementation.prompt.md`
  - Use for: implementing an approved plan inside `js/choreography/**` + templates (coding assistant for edits).
