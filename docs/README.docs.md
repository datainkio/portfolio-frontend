<!-- @format -->

# Frontend Documentation Index

Durable reference docs for the dataink.io frontend. Optimized for the **Concierge** agent and its modules — pointers are short, paths are exact, and content is grouped by intent.

> When a doc conflicts with code, the code wins. Update the doc.

## Start here

- [[.github/copilot-instructions]] — AI agent context (commands, env, gotchas, troubleshooting).
- [[README.frontend]] — AIX-focused workspace reference.
- [[docs/architecture|architecture]] — Repo boundaries and folder semantics.

## By task

### "I need to run / build the site"

- Commands and env: [[.github/copilot-instructions]]
- Build order rationale: [[docs/architecture|architecture]]

### "I'm working on content / Sanity"

- Sanity contract, queries, collections: [[docs/sanity-integration|sanity-integration]]
- Page frontmatter conventions: [[docs/ia/frontmatter|ia/frontmatter]]

### "I'm working on templates (views/) or 11ty"

- Top-level conventions: [[README.frontend#Conventions]]
- Eleventy modules: [[eleventy/README.eleventy]]

### "I'm working on choreography / animation"

- System overview: [[js/choreography/README.choreography]]
- Section controllers (Hero, BackgroundVideo, Bio, Awards, Organizations, Work): [[js/choreography/sections/README.sections]]
- Managers (reduced-motion, smoother, gel, line, ruler, session): [[js/choreography/managers/README.managers]]
- Director init sequence diagram: [[docs/director-initialization-sequence|director-initialization-sequence]]
- Preloader contract and smoke tests: [[docs/preloader-integration-checklist|preloader-integration-checklist]]
- Landing performance plan: [[docs/ai/plan-landing-performance.prompt|plan-landing-performance]]

### "I'm working on styling / design tokens"

- Import order and generated files: [[README.frontend#Styles]]
- Figma → CSS pipeline: [[.github/copilot-instructions]] (Design System section)

### "I need agent / prompt context"

- AI prompts and onboarding: [ai/](ai/)
- Storyboards: [[docs/storyboards/README.storyboards]]

### "I want to see the backlog"

- Frontend backlog: [[docs/TODO|docs/TODO]]
- Repo TODO: [[TODO]]

## Conventions

- Documentation files use `README.<scope>.md` naming inside subdirectories (matches the AIX workspace convention). Top-level `README.md` remains for GitHub.
- Generated artifacts are never committed and never documented as editable: `_site/`, `.cache/`, `logs/`, `styles/colors.css`, `styles/typography/fontFamilies.css`.
- Deprecated / historical documentation lives in [\_archive/](_archive/). See [[docs/_archive/README|_archive/README]] for an inventory.

## Module-to-doc map (for Concierge routing)

| Module    | Primary docs                                                     |
| --------- | ---------------------------------------------------------------- |
| Mechanic  | [[.github/copilot-instructions]], [[docs/sanity-integration]]    |
| Navigator | This file, [[docs/architecture]]                                 |
| Librarian | This file, [\_archive/](_archive/)                               |
| Architect | [[docs/architecture]], [[docs/director-initialization-sequence]] |
| Editor    | [ai/](ai/), [storyboards/](storyboards/)                         |
