# Frontend AIX Prompt Modules (Concierge Routing Index)

This folder contains **task-scoped prompt modules** intended to be selected by the workspace Concierge when working in this repo.

## Module routing hints

- **Templates / Nunjucks / 11ty** → `frontend-templates.prompt.md`
  - Use for: `.njk`, page/layout structure, macros/includes, semantic HTML, accessibility.

- **Browser JavaScript (progressive enhancement)** → `frontend-js.prompt.md`
  - Use for: DOM initialization, event handlers, choreography glue, lightweight UI behavior.

- **Choreography planning (no code)** → `frontend-choreography-planning.prompt.md`
  - Use for: interaction timelines, triggers, reduced-motion variants, orchestration plans.

- **Choreography implementation (code changes)** → `frontend-choreography-implementation.prompt.md`
  - Use for: implementing an approved plan inside `js/choreography/**` + templates.
