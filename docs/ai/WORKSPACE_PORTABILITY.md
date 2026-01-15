# Frontend AI system portability

## Goal

The AI assets in this repo (agents, prompts, and AIX docs) should **travel with the frontend** and remain effective when this repo is:

- opened alone, or
- opened as a second root inside a larger multi-root workspace.

## What “travels with the frontend”

### Agents (task-level workflows)

- `frontend/.github/agents/`
  - **Frontend Choreography Planner**: planning-only interaction choreography
  - **Frontend Choreography Implementer**: implements an approved plan

These are intentionally domain-specific to the portfolio frontend’s GSAP + 11ty architecture.

### Prompts (file-scoped constraints)

- `frontend/.copilot/js.prompt.md` — browser-first JS, progressive enhancement, idempotent init
- `frontend/.copilot/html.prompt.md` — 11ty/Nunjucks semantics, minimal template logic
- `frontend/.copilot/README.md` — scoping, precedence, and editing rules

### AIX maintenance (human-facing)

- `frontend/docs/ai/` — AIX hygiene, checklists, and local prompt experiments

## Authority model

### When this repo is opened alone

- Treat this repo’s `.copilot/*` constraints and `docs/ai/*` guidance as authoritative for work inside this repo.
- Use the choreography agents freely.

### When this repo is opened in a multi-root workspace

This repo remains authoritative for:

- how to implement changes _inside the frontend codebase_
- what constraints apply to `.njk` templates and browser JS
- the frontend’s preferred choreography architecture and patterns

If another root provides a platform scaffold (routing policy / evaluation rubric), treat that scaffold as authoritative for:

- agent routing policy across the whole workspace
- cross-workspace AIX measurement and logging conventions

## Design principle: link, don’t fork

If you need to connect this repo’s AI system to an external scaffold:

- prefer pointers/links from the scaffold to these files
- avoid copying AIX checklists or evaluation prompts between repos (copying drifts)

## Minimal “self-check”

To sanity-check portability, open this repo alone and verify:

- you can discover prompts quickly via `frontend/.copilot/README.md`
- the choreography agents appear and describe their scope clearly
- `frontend/_site/` remains treated as generated output (not a learning source)
