<!-- @format -->

# Copilot Instructions for dataink.io Portfolio (11ty + Figma + Airtable)

These instructions make AI coding agents immediately productive in this repo by summarizing architecture, workflows, conventions, and gotchas specific to this project.

## Big Picture

- **11ty static site**: Nunjucks templates in `njk/` generate `_site/`. Atomic design components live under `njk/_includes/`.
- **Design tokens via Figma**: CSS files in `styles/` are generated from Figma (colors, typography) by `scripts/fetchFigma.js` and services in `figma/services/*`.
- **Content via Airtable**: Data fetched at build time and exposed as 11ty collections. Config in `njk/_data/site.json`; schema in `njk/_data/airtableSchema.json`.
- **Tailwind v4**: Uses `@tailwindcss/cli`. CSS import order matters for correct token application.
- **Animation system**: GSAP-based choreography under `js/choreography/` with managers, sections, and event bus.

## Core Workflows

```bash
npm install                  # Required on fresh clone
npm run build:design         # Sync Figma tokens → CSS
npm run build:11ty           # Compile Nunjucks → _site/
npm start                    # Tailwind watch + 11ty serve
```

- Always run `build:design` before `build:11ty` to ensure CSS tokens are up to date.
- Env vars required: `FIGMA_TOKEN`, `AIRTABLE_PERSONAL_ACCESS_TOKEN`, `AIRTABLE_BASE_TOKEN`.

## Key Directories & Files

- Templates: `njk/_pages/` (routes), `njk/_includes/` (atoms/molecules/organisms/templates)
- Data: `njk/_data/site.json` (Airtable config), `njk/_data/airtableSchema.json` (schema)
- Collections: `eleventy/collections/content.js` (auto-collection mapping)
- Design sync: `scripts/fetchFigma.js`, `figma/services/PaletteService.js`, `figma/services/TypographyService.js`
- Styles: `styles/main.css`, `styles/colors.css`, `styles/typography/*`
- JS runtime: `js/main.js`, `js/choreography/*`, `js/utils/lumberjack/*`

## Nunjucks Conventions

- Prefer macros for reusable components with parameters; includes for static content only.
- Avoid `with` in includes; use macro pattern instead.
- Import paths are relative to `njk/_includes/`.

Example macro:

```njk
{% macro render(params = {}) %}
  {%- set value = params.key | default('fallback') -%}
  <element>{{ value }}</element>
{% endmacro %}

{% import "atoms/component.njk" as component %}
{{ component.render({ key: "value" }) }}
```

## GSAP Choreography

- Register plugins: `gsap.registerPlugin(ScrollTrigger, ScrollSmoother)` before use.
- Controllers: `js/choreography/sections/*` (e.g., `Hero.js`, `Work.js`), coordinated by `Director.js` and `AnimationBus`.
- `StageManager` expects existing DOM `#overlay-view` with a child `video`; template must render it first via overlay-view molecule.

Overlay-View usage:

```njk
{% import "molecules/overlay-view/overlay-view.njk" as overlayView %}
{{ overlayView.render({ videoSrc: "/assets/video/sizzle.mp4" }) }}
```

## Airtable Data Flow

- Configure tables and caching in `njk/_data/site.json`.
- Collections are generated (lowercase names) and accessible in Nunjucks.
- Reference schema via `{{ airtableSchema }}` for template safety.

## Tailwind & Styles

- CSS import order in `styles/main.css`: fonts → Tailwind → base → generated design files.
- Tailwind v4 uses `@tailwindcss/cli` (not `tailwindcss` binary).

## Logging

- Use `js/utils/lumberjack` for unified logging in Node/browser.
- Pattern: `lumberjack.trace(..., 'brief' | 'verbose', 'standard' | 'success' | 'error')`.

## Common Gotchas

- Run `build:design` before 11ty build; stale tokens break styles.
- GSAP ScrollSmoother enables only if both `#smooth-wrapper` and `#smooth-content` exist.
- Use web-optimized MP4 for background video (Safari issues with MOV).
- Airtable view names are case-sensitive; 11ty collections are lowercase.
- Asset paths in templates are `/assets/...` (site root).

## Sanity Workspace (separate)

- Lives under `sanity/sanity/` with schema in `sanity/sanity/schemaTypes/`.
- Not part of 11ty build; treat as independent studio config.

Questions or gaps? If any workflow or directory is unclear, tell me which part and I’ll refine this guide with concrete examples from the codebase.

## Troubleshooting

- Build fails fetching Figma: Ensure `FIGMA_TOKEN` is set; run `npm run build:design`. Check `figma/services/*` logs.
- Missing styles/tokens: Verify `styles/main.css` import order (fonts → Tailwind → base → generated). Re-run `build:design`.
- Airtable 429/rate limits: Confirm `AIRTABLE_PERSONAL_ACCESS_TOKEN` and `AIRTABLE_BASE_TOKEN`. Adjust caching in `njk/_data/site.json` and re-run `npm run build:11ty`.
- GSAP animations not running: Confirm `gsap.registerPlugin(ScrollTrigger, ScrollSmoother)` and DOM IDs exist (`#smooth-wrapper`, `#smooth-content`, `#overlay-view`).
- Background video not visible: Ensure overlay-view molecule renders before choreography; use MP4 under `/assets/video/`.
- Tailwind classes missing: Use `@tailwindcss/cli` and check `tailwind.config.js`. Restart `npm start` to refresh watch processes.

## Try-It: Add a Molecule

- Create `njk/_includes/molecules/<name>/<name>.njk` exporting a `render(params)` macro.
- Use in a page: `{% import "molecules/<name>/<name>.njk" as m %} {{ m.render({ ... }) }}`.
- Add styles under `styles/` (respect `styles/main.css` order). If using tokens, run `npm run build:design`.
- If animated, add a section controller under `js/choreography/sections/<name>/<Name>.js` and wire via `Director.js`.
- Verify DOM IDs/classes expected by controllers exist in the template.

## Hero Section Hooks

- The hero controller lives at `js/choreography/sections/hero/Hero.js`.
- Expects hero DOM container and any target elements to be present before `Director` initialization.
- Coordinate cross-section timing via `AnimationBus` rather than direct calls.
- Keep GSAP timelines modular and avoid side effects outside the hero container.
