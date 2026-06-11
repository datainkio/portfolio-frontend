---
title: "Frontend — Claude Code Entrypoint"
description: "Claude Code workspace entrypoint for the portfolio frontend."
type: entrypoint
status: stable
audience:
  - agents
tags:
  - "#frontend"
  - "#ux/navigation/entrypoint"
  - "#ux/accessibility/11ty"
  - "#design/motion/gsap"
---

# Frontend — Claude Code Entrypoint

Portfolio frontend: Eleventy (11ty) + Nunjucks + Tailwind v4 + GSAP + Sanity.

## Orientation Protocol

Read in this order before starting any task:

1. [`portfolio-frontend.md`](../aix/context/projects/portfolio-frontend.md) — stack constraints, choreography runtime snapshot, common pitfalls
2. [`constraints.md`](dataink.io/context/constraints.md) — non-negotiables; never violate
3. [`current-goals.md`](dataink.io/context/current-goals.md) — active work
4. [`.github/copilot-instructions.md`](.github/copilot-instructions.md) — repo conventions, do-not-edit files, build order

**Context load tier:**
- Fast path (single-file edit, template lookup, quick question): `portfolio-frontend.md` + `copilot-instructions.md` only
- Full path (implementation, choreography, architecture, multi-file): all four above

## Critical Constraints

- Never infer behavior from `_site/` — generated output; does not reflect source truth
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

Workspace agents live in [`../.claude/agents/`](../.claude/agents/). For GSAP / choreography work, use the skills table below — no dedicated agent exists.

| Agent | Use for |
|---|---|
| [`implementer`](../.claude/agents/implementer.md) | General code changes, new components, Sanity wiring |
| [`mechanic`](../.claude/agents/mechanic.md) | Build failures, 11ty config issues, tooling errors |
| [`reviewer`](../.claude/agents/reviewer.md) | Pre-merge checks, diff review, contract compliance |
| [`planner`](../.claude/agents/planner.md) | Sequence multi-step work before implementation begins |
| [`taskmaster`](../.claude/agents/taskmaster.md) | Embed TODOs aligned with the GitHub Issues workflow |

For the full agent roster and architecture agents: [`../aix/CLAUDE.md`](../aix/CLAUDE.md).

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

The [`gsap` agent](.claude/agents/gsap.md) selects the right skill automatically based on task type.

## Choreography Quick Reference

Full choreography context is in the [`gsap` agent](.claude/agents/gsap.md). Fast-path pointers:

- Config barrel: [`js/choreography/config/index.js`](js/choreography/config/index.js)
- Event contracts: [`js/choreography/config/contracts/events.js`](js/choreography/config/contracts/events.js)
- Section registry: [`js/choreography/system/registry.js`](js/choreography/system/registry.js)
- Boot sequence: `director:ready` → `preloader:out` → `LandingSequence` (never bypass)
- Always emit/listen via `AnimationBus` — never call sections directly
