# Project Backlog

This file tracks frontend-wide backlog priorities.

## Now

- [ ] BUG: Fix heading template parsing so Prettier passes (replace dynamic tag with explicit `h1-h6` branches and fallback `p`).
  - Issue: [#24](https://github.com/datainkio/portfolio-frontend/issues/24)
- [ ] BUG: Remove orphan `</label>` in global nav dialog template.
  - Issue: [#23](https://github.com/datainkio/portfolio-frontend/issues/23)
- [ ] BUG: Clean up project page nugget loop by removing stray `</section>` and keeping the loop inside `article`.
  - Issue: [#22](https://github.com/datainkio/portfolio-frontend/issues/22)
- [ ] BUG: Fix landing page crash when browser console is open.
  - Issue: [#34](https://github.com/datainkio/portfolio-frontend/issues/34)
- [ ] BUG: Fix Lumberjack enabled/disabled behavior leaking across scoped instances.
  - Issue: [#33](https://github.com/datainkio/portfolio-frontend/issues/33)
- [ ] BUG: Fix gel disappearing on scroll.
  - Issue: [#32](https://github.com/datainkio/portfolio-frontend/issues/32)
- [ ] FEAT: Define preload body background color to prevent flash of unstyled background.
- [ ] FEAT: Define staged asset display sequence as assets become available (background color -> pixelator background -> text -> video).
- [ ] FEAT: Introduce offline/fixture mode for `scripts/fetchFigma.js` and `scripts/syncContent.js` to support a deterministic CI pipeline (GitHub Actions) that runs `npm run validate` with no network.
  - Issue: [#36](https://github.com/datainkio/portfolio-frontend/issues/36)
- [ ] FEAT: Explore lazy loading for images and other assets, especially on the design-heavy homepage.

## Next

- [ ] FEAT: Diagram 11ty navigation system to support IA/content strategy and detect orphaned pages.
- [ ] FEAT: Create automatic skip-links generator for 11ty sites with configurable element selection.
- [ ] FEAT: Define and pilot a Choreography Auditor flow using browser automation checks (open page, trigger hero, scroll early, verify no stuck states).
- [ ] TODO: Audit and standardize `aria-live` usage across the site (when to use `polite`, `off`, or no live region).
  - Issue: [#21](https://github.com/datainkio/portfolio-frontend/issues/21)
- [ ] PERF: Audit large in-memory datasets, heavy client-side caches, third-party scripts, and potential memory leaks; target heap size <80MB (currently 180MB+).
  - Issue: [#31](https://github.com/datainkio/portfolio-frontend/issues/31), [#28](https://github.com/datainkio/portfolio-frontend/issues/28)
- [ ] TODO: Add in-page jump links to header.
  - Issue: [#30](https://github.com/datainkio/portfolio-frontend/issues/30)
- [ ] TODO: Add site navigation to header.
  - Issue: [#29](https://github.com/datainkio/portfolio-frontend/issues/29)
- [ ] FEAT: Add generated-file guard that blocks edits to `styles/colors.css` and `styles/typography/fontFamilies.css`.
- [ ] FEAT: Turn on type checking for `js/choreography/` and `scripts/`.
- [ ] FEAT: Add ESLint (Node + browser + Nunjucks globals) with Prettier integration.
- [ ] FEAT: Create JSDOM integration tests for choreography safety requirements.
- [ ] FEAT: Add snapshot/shape tests for generated design tokens.
- [ ] FEAT: Ship `.env.example` and gate `npm start`/`npm run build` with `npm run validate:env`.
- [ ] FEAT: Publish concise AI/maintainer playbook at repo root with required DOM IDs/classes.
- [ ] FEAT: Pin runtime tooling (`.nvmrc`, engine strictness, early system checks).
- [ ] FIX: Resolve performance hit from scroll snapping either from CSS or GSAP ScrollTrigger.
- [ ] TODO: Remove logging for award logo images.
  - Issue: [#62](https://github.com/datainkio/portfolio-frontend/issues/62)

## Later / Parked

- [ ] IDEA: Build things that matter; design experiences that matter.
- [ ] STYLE: Standardize optional chaining for method calls across all choreography files.
- [ ] STYLE: Standardize explicit checks for property assignments across all choreography files.
