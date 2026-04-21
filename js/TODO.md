# Project Backlog

This file tracks JavaScript/runtime and DX backlog priorities.

## Now

- [ ] FEAT: Define preload body background color to prevent flash of unstyled background.
- [ ] FEAT: Define staged asset display sequence as assets become available (background color -> pixelator background -> text -> video).
- [ ] FEAT: Add deterministic CI pipeline (GitHub Actions) that runs `npm run validate` using cached fixtures/no network.
- [ ] FEAT: Introduce offline/fixture mode for `scripts/fetchFigma.js` and `scripts/syncContent.js`.

## Next

- [ ] FEAT: Add generated-file guard that blocks edits to `styles/colors.css` and `styles/typography/fontFamilies.css`.
- [ ] FEAT: Turn on type checking for `js/choreography/` and `scripts/`.
- [ ] FEAT: Add ESLint (Node + browser + Nunjucks globals) with Prettier integration.
- [ ] FEAT: Create JSDOM integration tests for choreography safety requirements.
- [ ] FEAT: Add snapshot/shape tests for generated design tokens.
- [ ] FEAT: Ship `.env.example` and gate `npm start`/`npm run build` with `npm run validate:env`.
- [ ] FEAT: Publish concise AI/maintainer playbook at repo root with required DOM IDs/classes.
- [ ] FEAT: Pin runtime tooling (`.nvmrc`, engine strictness, early system checks).
- [ ] FIX: Resolve performance hit from scroll snapping either from CSS or GSAP ScrollTrigger
- [ ] TODO: Remove logging for award logo images

## Later / Parked

- [ ] TODO: Expand fixture reliability for external dependencies if CI reveals flaky edge cases.

## Done

- [x] No completed JavaScript/DX backlog items recorded yet.
