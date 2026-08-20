---
title: "Frontend — Claude Code Entrypoint"
description: "Claude Code workspace entrypoint for the portfolio frontend."
type: entrypoint
status: stable
audience:
  - agents
system: "Eleventy"
tags:
  - entrypoint
  - frontend
  - gsap
---

# Frontend — Claude Code Entrypoint

Portfolio frontend: Eleventy (11ty) + Nunjucks + Tailwind v4 + GSAP + Sanity.

## Orientation Protocol

Read in this order before starting any task:

1. [`project.md`](../context/project.md) — stack constraints, choreography runtime snapshot, common pitfalls
2. [`constraints.md`](../context/constraints.md) — non-negotiables; never violate
3. [`Frontend.md`](../../goals/Frontend.md) — the Frontend project note in the **vault-root** `goals/` folder, a sibling of `dataink.io/`. Its tasks live in [`Frontend_tasks/`](../../goals/Frontend_tasks/); task frontmatter is the source of truth, and `status: "in-progress"` marks active work
4. [`.github/copilot-instructions.md`](.github/copilot-instructions.md) — repo conventions, do-not-edit files, build order

**Context load tier:**
- Fast path (single-file edit, template lookup, quick question): `portfolio-frontend.md` + `copilot-instructions.md` only
- Full path (implementation, choreography, architecture, multi-file): all four above

## Critical Constraints

- Page-level diagnosis/optimization starts at the page template — read `views/pages/<name>/<name>.njk` (homepage = `views/pages/home/home.njk`) and confirm the real above-the-fold composition + LCP element before any hypothesis or edit. Never infer page structure from arch docs, `hero.njk`, or frontmatter (`hero:`, `skipLinks`)
- Never infer *source behavior* from `_site/` — but DO read rendered `_site/<page>.html` to verify output. For an output/perf review, read the rendered artifact first instead of rebuilding or serving in memory; read the file, don't just grep it for your own edits
- Never hand-edit `styles/colors.css` or `styles/typography/fontFamilies.css` — overwritten by `build:design`
- Never call Tailwind CLI directly — always use npm scripts
- Never bypass choreography lifecycle gating (`director:ready` → `preloader:out`)
- Never introduce new global singletons — extend Director / Bus architecture
- CSS import order in `styles/main.css` is critical: fonts → Tailwind → base → theme → components
- Templates live in `views/` (Eleventy `includes`), not `njk/` — that path no longer exists

## Key Commands

```bash
npm start              # dev: Tailwind watch + 11ty serve (most common)
npm run build          # full build: design → css → 11ty
npm run quick          # fast build: css + 11ty only (skips Figma sync)
npm run build:design   # sync Figma tokens → CSS (run before build:css)
npm run validate       # format check + tests + preview build
npm run scaffold:component  # generate new atomic design component
```

## Available Agents

Workspace agents live in [`../.claude/agents/`](../.claude/agents/).

| Agent | Use for |
|---|---|
| [`choreographer`](../.claude/agents/choreographer.md) | Motion, GSAP choreography, ScrollTrigger, scroll behavior, reduced-motion |
| [`implementer`](../.claude/agents/implementer.md) | General code changes, new components, Sanity wiring |
| [`mechanic`](../.claude/agents/mechanic.md) | Build failures, 11ty config issues, tooling errors |
| [`reviewer`](../.claude/agents/reviewer.md) | Pre-merge checks, diff review, contract compliance |
| [`planner`](../.claude/agents/planner.md) | Sequence multi-step work before implementation begins |
| [`taskmaster`](../.claude/agents/taskmaster.md) | Embed TODOs aligned with the GitHub Issues workflow |

For the full agent roster and architecture agents: [`../CLAUDE.md`](../CLAUDE.md).

## Available Skills

GSAP skills are installed globally at `~/.claude/skills/`. Load only the skill the task needs — do not load all by default.

| Skill | Load for |
|---|---|
| `/gsap-core` | Tweens, easing, stagger, `gsap.matchMedia()`, reduced motion |
| `/gsap-timeline` | Timeline sequencing, position parameter, LandingSequence |
| `/gsap-scrolltrigger` | ScrollTrigger, pinning, scrub, scroll-linked animation |
| `/gsap-plugins` | SplitText, Flip, Draggable, ScrollSmoother |
| `/gsap-performance` | Compositor properties, `quickTo`, `will-change`, batching |
| `/gsap-utils` | `clamp`, `mapRange`, `distribute`, `snap`, `toArray` |
| `/gsap-react` | React / Next.js animation (not used in this project) |
| `/gsap-frameworks` | Vue / Svelte / Nuxt (not used in this project) |

The [`choreographer` agent](../.claude/agents/choreographer.md) selects the right skill automatically based on task type.

## Model Selection

Frontend task tiers — applied via Agent tool `model` param when dispatching subagents:

| Task type | Model |
|---|---|
| Choreography/motion implementation, page-level planning | `opus` (motion-timing + LCP judgment) |
| Template/component implementation, Sanity wiring | `sonnet` |
| Copy tweaks, sidecar docs, formatting | `haiku` |

## Current Goals

Goals and tasks live in Obsidian's **Project Manager** plugin at the **vault root** — [`goals/`](../../goals/), a sibling of the `dataink.io/` directory, not inside this repo. Frontend work is the [`Frontend.md`](../../goals/Frontend.md) project note (`pm-project: true`), with its tasks and subtasks in [`Frontend_tasks/`](../../goals/Frontend_tasks/) (`pm-task: true`).

A project note's `taskIds` and `## Tasks` checklist are plugin-generated and drift — **task frontmatter is the source of truth**. `type: subtask` tasks are nested under a parent and are deliberately absent from the top-level checklist. Start at [`README.goals.md`](../../goals/README.goals.md) for the Dataview dashboard across all projects.

Update task frontmatter as work completes; never fork or restate goals into this repo — link to them.

**`frontend/context/current-goals.md` and `frontend/context/goals/` do not exist.** Earlier revisions of this file routed there; both were removed when goals migrated to the vault root. Do not recreate them.

## Choreography Quick Reference

Full choreography context is in the [`choreographer` agent](../.claude/agents/choreographer.md). Fast-path pointers:

- Config barrel: [`js/choreography/config/index/index.js`](js/choreography/config/index/index.js)
- Event contracts: [`js/choreography/config/contracts/events/events.js`](js/choreography/config/contracts/events/events.js)
- Section registry: [`js/choreography/system/registry.js`](js/choreography/system/registry.js)
- Boot sequence: `director:ready` → `preloader:out` → `LandingSequence` (never bypass)
- Always emit/listen via `AnimationBus` — never call sections directly
