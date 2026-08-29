---
title: "Frontend — Claude Code Entrypoint"
description: "Claude Code workspace entrypoint for the portfolio frontend."
type: index
status: stable
tags:
  - entrypoint
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
- Never infer _source behavior_ from `_site/` — but DO read rendered `_site/<page>.html` to verify output. For an output/perf review, read the rendered artifact first instead of rebuilding or serving in memory; read the file, don't just grep it for your own edits
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

## Available Skills

**Named subagents are retired.** `.claude/agents/` no longer exists; routing goes
through skills, symlinked into [`../.claude/skills/`](../.claude/skills/) from the
`skillet` repo. Load only the skill the task needs — do not load all by default.

| Skill                                   | Load for                                                               |
| --------------------------------------- | ---------------------------------------------------------------------- |
| `/choreography`                         | This project's GSAP motion system — topology, boot sequence, contracts |
| `/eleventy`                             | 11ty config, collections, filters, shortcodes, build failures          |
| `/tailwindcss`                          | Tailwind v4 utilities, theme layer, CSS import order                   |
| `/ixd`, `/ixd-development`              | Interaction design and its implementation                              |
| `/accessibility`                        | Semantic structure, ARIA, keyboard support, reduced motion             |
| `/core-web-vitals`, `/performance`      | LCP/CLS/INP diagnosis and budgets                                      |
| `/best-practices`                       | General frontend review and contract compliance                        |
| `/frontmatter-lint`, `/drift-check`     | Workspace hygiene — sidecar and frontmatter presence, doc drift        |
| `/graphify`                             | Query the knowledge graph at [`graphify-out/`](graphify-out/)          |
| `/obsidian-markdown`, `/obsidian-bases` | Sidecar and vault authoring conventions                                |

GSAP API skills — load alongside `/choreography` for the specific technique:

| Skill                 | Load for                                                     |
| --------------------- | ------------------------------------------------------------ |
| `/gsap-core`          | Tweens, easing, stagger, `gsap.matchMedia()`, reduced motion |
| `/gsap-timeline`      | Timeline sequencing, position parameter, LandingSequence     |
| `/gsap-scrolltrigger` | ScrollTrigger, pinning, scrub, scroll-linked animation       |
| `/gsap-plugins`       | SplitText, Flip, Draggable, ScrollSmoother                   |
| `/gsap-performance`   | Compositor properties, `quickTo`, `will-change`, batching    |
| `/gsap-utils`         | `clamp`, `mapRange`, `distribute`, `snap`, `toArray`         |

`/gsap-react` and `/gsap-frameworks` cover React and Vue/Svelte — neither is used here.

## Model Selection

Frontend task tiers — applied via the Agent tool's `model` param when delegating:

| Task type                                               | Model                                 |
| ------------------------------------------------------- | ------------------------------------- |
| Choreography/motion implementation, page-level planning | `opus` (motion-timing + LCP judgment) |
| Template/component implementation, Sanity wiring        | `sonnet`                              |
| Copy tweaks, sidecar docs, formatting                   | `haiku`                               |

## Current Goals

Goals and tasks live in Obsidian's **Project Manager** plugin at the **vault root** — [`goals/`](../../goals/), a sibling of the `dataink.io/` directory, not inside this repo. Frontend work is the [`Frontend.md`](../../goals/Frontend.md) project note (`pm-project: true`), with its tasks and subtasks in [`Frontend_tasks/`](../../goals/Frontend_tasks/) (`pm-task: true`).

A project note's `taskIds` and `## Tasks` checklist are plugin-generated and drift — **task frontmatter is the source of truth**. `type: subtask` tasks are nested under a parent and are deliberately absent from the top-level checklist. Start at [`README.goals.md`](../../goals/README.goals.md) for the Dataview dashboard across all projects.

Update task frontmatter as work completes; never fork or restate goals into this repo — link to them.

**`frontend/context/current-goals.md` and `frontend/context/goals/` do not exist.** Earlier revisions of this file routed there; both were removed when goals migrated to the vault root. Do not recreate them.

## Choreography Quick Reference

Full choreography context is in the `/choreography` skill. Fast-path pointers:

- Config barrel: [`js/choreography/config/index/index.js`](js/choreography/config/index/index.js)
- Event contracts: [`js/choreography/config/contracts/events/events.js`](js/choreography/config/contracts/events/events.js)
- Section registry: [`js/choreography/system/registry.js`](js/choreography/system/registry.js)
- Boot sequence: `director:ready` → `preloader:out` → `LandingSequence` (never bypass)
- Always emit/listen via `AnimationBus` — never call sections directly
