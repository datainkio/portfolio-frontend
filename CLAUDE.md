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

Portfolio frontend: Eleventy (11ty) + Nunjucks + Tailwind v4 + GSAP + Sanity. Own repo (`portfolio-frontend`) — run git from here. [`../CLAUDE.md`](../CLAUDE.md) (auto-loaded) covers repo topology, authority, and non-negotiables; don't restate them.

## Context load tier

- **Fast path** (single-file edit, lookup, quick question): this file + the target file's `.md` sidecar. Nothing else.
- **Full path** (implementation, choreography, architecture, multi-file): also [`project.md`](../context/project.md), [`constraints.md`](../context/constraints.md), and the active task in [`goals/Frontend/_tasks/`](../../goals/Frontend/_tasks/).
- [`.github/copilot-instructions.md`](.github/copilot-instructions.md) is ~18 KB — read only the section you need (conventions, do-not-edit list), never whole.

## Goals

Frontend project note: [`goals/Frontend/Frontend.md`](../../goals/Frontend/Frontend.md); tasks and subtasks: [`goals/Frontend/_tasks/`](../../goals/Frontend/_tasks/) (vault root, outside this repo). Task frontmatter is the source of truth; `status` values appear both quoted and unquoted, so match both:

```bash
grep -lE '^status: "?in-progress' ../../goals/Frontend/_tasks/*.md
```

When your work on a task is finished and verified, set it to `review` (In Review). Never set `done`; only the reviewer does. Status ids and their meanings: the Workflow section of [`Skill Development.md`](../../goals/Skill%20Development/Skill%20Development.md). Never recreate `frontend/context/goals/` or `current-goals.md`.

## Critical Constraints

- Page-level diagnosis/optimization starts at the page template — read `views/pages/<name>/<name>.njk` and confirm the real above-the-fold composition + LCP element before any hypothesis or edit. Never infer page structure from arch docs or frontmatter (`skipLinks` in `ia/index.md` is stale).
- Homepage: `views/pages/home/home.njk`. Its first section is `views/organisms/section/hero.njk` (renders `#manifesto`), driven by `js/choreography/organisms/hero/`. "Hero" was "Bio" before 2026-10-05; plan prompts and `specs/animation/` written earlier use the old names and may describe a removed legacy Hero.
- Never infer _source behavior_ from `_site/` — but DO read rendered `_site/<page>.html` to verify output. For an output/perf review, read the rendered artifact first instead of rebuilding or serving in memory.
- `ia/**/*.md` pages are rendered by 11ty as Nunjucks — a broken import there fails the build.
- Never hand-edit `styles/colors.css` or `styles/typography/fontFamilies.css` — overwritten by `build:design`
- Never call Tailwind CLI directly — always use npm scripts
- Never bypass choreography lifecycle gating (`director:ready` → `preloader:out`)
- Never introduce new global singletons — extend Director / Bus architecture
- CSS import order in `styles/main.css` is critical: fonts → Tailwind → base → theme → components
- Templates live in `views/` (Eleventy `includes`)

## Key Commands

```bash
npm start              # dev: Tailwind watch + 11ty serve (most common)
npm run quick          # fast build: js → 11ty → css (skips Figma sync) — use to verify changes
npm run build          # full build: clean → design → js → 11ty → css
npm run build:design   # sync Figma tokens → CSS
npm test               # logger + choreography contract tests
npm run validate       # format:check → lint:frontmatter → audit:sidecars → test
npm run scaffold:component  # generate new atomic design component
```

`format:check` and `lint:frontmatter` carry pre-existing findings — compare counts against a `git stash` baseline rather than expecting zero.

## Searching

Generated and historical files swamp repo-wide searches. `assets/**/*.svg` and `docs/frontmatter-audit/` hold huge single-line files that flood output. Start from:

```bash
rg -n '<pattern>' -g '!node_modules' -g '!_site' -g '!graphify-out' -g '!.codegraphy' \
  -g '!docs/frontmatter-audit/**' -g '!responsive-testing/screenshots/**' -g '!*.svg' -g '!package-lock.json' .
```

## Section map

The registry key, element attribute, and rendered DOM id differ. Don't assume `#<key>`.

| Registry key    | Template                                                         | DOM id          | Element attribute         | Controller                                 |
| --------------- | ---------------------------------------------------------------- | --------------- | ------------------------- | ------------------------------------------ |
| `hero`          | `views/organisms/section/hero.njk`                               | `manifesto`     | `data-hero-el`            | `organisms/hero/Hero.js`                   |
| `video`         | `views/molecules/background/sizzle-background.njk`               | `background`    | — (media resolved by tag) | `organisms/background/BackgroundVideo.js`  |
| `work`          | `views/organisms/section/work.njk`                               | `work`          | `data-projects-el`        | `organisms/work/Work.js`                   |
| `organizations` | `views/organisms/section/organizations.njk`                      | `organizations` | `data-organizations-el`   | `organisms/organizations/Organizations.js` |
| `awards`        | `views/organisms/section/awards.njk`                             | `awards` ⚠     | `data-awards-el`          | `organisms/awards/Awards.js`               |
| `process`       | `views/organisms/section/process.njk` — not rendered on any page | `process`       | `data-process-el`         | `organisms/process/Process.js`             |

DOM ids live in `SELECTORS` ([`selectors.js`](js/choreography/config/contracts/selectors/selectors.js)). ⚠ `SELECTORS.awards` is `"recognition"`, but the page renders `id="awards"`, so lookups by id miss the Awards section (open bug). The homepage order is hero → work → organizations → awards.

## Renames

A name lives in more places than the code. Update all of these together:

- File and folder names, **and** their `.md` sidecars
- Frontmatter `links:` wikilinks (`[[Name|Name]]`) and body `[[ ]]` links. Check for duplicates after replacing.
- Barrels: `organisms/index.js` and its `index.md`, plus `system/registry.js`, `events.js`, `selectors.js`, `config/ix/profiles.js`, `config/ix/motion.js`
- `ia/**/*.md` — rendered by 11ty, so a stale import breaks the build
- `data/sanity/transforms/` — the serializers emit `data-*-el` attributes
- `.github/copilot-instructions.md`

Don't rewrite history. Leave `docs/**/*.prompt.md` and specs marked `status: historical` as written, and add a dated naming note at the top instead. Leave `docs/frontmatter-audit/` and `responsive-testing/screenshots/` untouched.

## Definition of done

Run the checks for the task type before committing:

| Task type         | Verify                                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| Any code change   | `npm test` and `npm run quick` pass                                                                 |
| Template / page   | Read the rendered `_site/<page>.html` and confirm the change appears                                |
| Rename / refactor | Searching for the old name returns only intentional hits; the rendered `_site` has no old hooks     |
| Choreography      | The reduced-motion branch is present; events go through `AnimationBus`; the bundle builds (`quick`) |
| Docs / sidecars   | `format:check` and `lint:frontmatter` counts are no higher than the `git stash` baseline            |

Then commit and push following the git policy in [`../CLAUDE.md`](../CLAUDE.md), and set the task to `review`.

## Skills

Linked from Skillet into [`.claude/skills/`](.claude/skills/), declared in [`.skillet`](.skillet). Load only what the task needs. A skill not listed here is absent — `~/Projects/skillet/bin/skillet add <skill>`, never copy it in.

| Skill                                    | Load for                                                               |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| `choreography`                           | This project's GSAP motion system — topology, boot sequence, contracts |
| `gsap-core`, `gsap-timeline`             | Tweens, easing, `matchMedia`, reduced motion; timeline sequencing      |
| `gsap-scrolltrigger`, `gsap-performance` | Pinning, scrub; compositor props, `quickTo`, batching                  |
| `eleventy`                               | 11ty config, collections, filters, shortcodes, build failures          |
| `tailwindcss`                            | Tailwind v4 utilities, theme layer, CSS import order                   |
| `ixd`                                    | Interaction design review                                              |
| `accessibility`                          | Semantic structure, ARIA, keyboard support, reduced motion             |
| `core-web-vitals`, `performance`         | LCP/CLS/INP diagnosis and budgets                                      |
| `best-practices`                         | Pre-merge review, contract compliance                                  |
| `atomic-design`                          | Component hierarchy (atoms → organisms)                                |
| `graphify`                               | Query the knowledge graph at [`graphify-out/`](graphify-out/)          |
| `json-canvas`                            | `.canvas` files (e.g. `LandingSequence Flow.canvas`)                   |
| `prime`                                  | Loadout: caveman + karpathy-guidelines + graphify                      |

Frontmatter/sidecar hygiene has no skill here — use `npm run lint:frontmatter` and `npm run audit:sidecars`.

## Model Selection

Frontend task tiers — applied via the Agent tool's `model` param when delegating:

| Task type                                               | Model                                 |
| ------------------------------------------------------- | ------------------------------------- |
| Choreography/motion implementation, page-level planning | `opus` (motion-timing + LCP judgment) |
| Template/component implementation, Sanity wiring        | `sonnet`                              |
| Copy tweaks, sidecar docs, formatting                   | `haiku`                               |

## Choreography Quick Reference

Full context is in the `choreography` skill. Fast-path pointers:

- Config barrel: [`js/choreography/config/index/index.js`](js/choreography/config/index/index.js)
- Event contracts: [`js/choreography/config/contracts/events/events.js`](js/choreography/config/contracts/events/events.js)
- Section registry: [`js/choreography/system/registry.js`](js/choreography/system/registry.js) — `hero, video, process, awards, organizations, work`
- Boot sequence: `director:ready` → `preloader:out` → `LandingSequence` (never bypass)
- Always emit/listen via `AnimationBus`; JS binds to `data-<section>-el` attributes, never CSS classes; every ScrollTrigger animation needs a reduced-motion branch
- `build:js` bundles from `AnimationDirector.js` with esbuild into `assets/js/choreography/bundle.js` (git-ignored) — `npm run quick` fails on a broken import
