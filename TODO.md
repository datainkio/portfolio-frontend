# General Project TODO Items

Purpose: This file provides triage for todo items.
Why: It keeps me away from the rabbithole of writing and organizing tasks.
How: All new todo items get created here and distributed when convenient and appropriate.
Instructions: For each item, describe the action to take and the benefits it is meant to bring. Keep it tight and concise.

## Developer experience and AI agent performance

- TODO: Add a deterministic CI pipeline (GitHub Actions) that runs npm run validate with cached fixtures/no network.
  Catches regressions on every change and gives AI agents a single pass/fail signal before merges; risk: medium because CI will need reliable fixtures for Figma/Airtable and might surface currently hidden flaky steps.
- TODO: Introduce an offline/fixture mode for scripts/fetchFigma.js and scripts/syncContent.js (e.g., --fixtures flag reading JSON under test/fixtures/)
  Lets AI agents run builds/tests without real tokens, improving speed and reproducibility; risk: low—mainly wiring conditionals and keeping fixtures current.
- TODO: Turn on type-checking (// @ts-check or TypeScript --noEmit) for js/choreography/_ and scripts/_
  Catches DOM null cases and wrong configs (e.g., missing #smooth-wrapper) before runtime, boosting agent accuracy; risk: medium because existing code may need JSDoc annotations to satisfy the checker.
- TODO: Add ESLint (Node + browser + Nunjucks globals) with Prettier integration
  Codifies patterns already described in .github/copilot-instructions.md and prevents common slips (unused vars, unsafe DOM access); risk: low—mostly config work and a short fix pass.
- TODO: Create integration tests for choreography requirements using JSDOM (e.g., assert StageManager in js/choreography/StageManager.js no-ops gracefully when #overlay-view/#smooth-wrapper are missing)
  Guards template changes and ensures animations fail safe; risk: medium due to GSAP stubbing but contained to tests.
- TODO: Add snapshot/shape tests for generated design tokens (styles/colors.css, styles/typography/fontFamilies.css)
  Flags unexpected Figma structure changes early and gives AI agents confidence in token outputs; risk: low because snapshots are read-only checks.
- TODO: Ship a .env.example and gate npm start/npm run build with npm run validate:env
  Reduces setup confusion and prevents agents from running half-configured builds; risk: low, just wiring scripts together.
- TODO: Add a generated-file guard (pre-commit or small script) that blocks edits to styles/colors.css, styles/typography/fontFamilies.css, njk/\_data/airtableSchema.json
  Prevents AI or humans from accidentally changing files overwritten by pipelines; risk: low.
- TODO: Promote a concise “AI/maintainer playbook” at repo root that mirrors .github/copilot-instructions.md with do/don’t lists and required DOM IDs/classes
  Shortens onboarding and reduces missteps when agents touch Nunjucks or choreography; risk: very low.
- TODO: Pin runtime tooling (.nvmrc, npm config set engine-strict true, surface scripts/systemCheck.js early)
  Prevents subtle Node/NPM drift that can skew builds/tests, improving reproducibility for agents; risk: low.
